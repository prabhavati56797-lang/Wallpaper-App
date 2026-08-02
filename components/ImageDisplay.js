import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Constants from 'expo-constants';

import { AntDesign as Icon } from '@expo/vector-icons';

const Dev_Height = Dimensions.get('screen').height;
const Dev_Width = Dimensions.get('screen').width;

// Note: the app now passes the full photo object when navigating to this screen.
export default class ImageDisplay extends React.Component{

  constructor(props){
    super(props);
    const photo = this.props.route?.params?.photo || {};
    const uri = photo?.src?.original || photo?.src?.large2x || photo?.src?.large || photo?.src?.medium || '';

    this.state={
      photo: photo,
      image_uri: uri,
      isloading: false,
      Activity_Indicator: true
    }
  }

  async downloadImage(){
    try {
      if (!this.state.image_uri) {
        Alert.alert('No image available to download.');
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted'){
        Alert.alert('Permission required', 'Permission to access media library is required to save images.');
        return;
      }

      const extMatch = /[^.]+$/.exec(this.state.image_uri);
      const ext = extMatch ? '.' + extMatch[0] : '.jpg';
      const filename = `image_${Date.now()}${ext}`;
      const fileUri = FileSystem.cacheDirectory + filename;

      const downloadRes = await FileSystem.downloadAsync(this.state.image_uri, fileUri);

      if (downloadRes && downloadRes.status === 200) {
        const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
        await MediaLibrary.createAlbumAsync('Download', asset, false).catch(()=>{});
        Alert.alert('Download Success!', 'Image saved to your gallery.');
        // Optionally clean cache file
        try { await FileSystem.deleteAsync(downloadRes.uri, { idempotent: true }); } catch(e){}
      } else {
        Alert.alert('Download failed', 'Unable to download image.');
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while saving the image.');
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" /> 
        {!this.state.isloading ? (
          <ImageBackground 
            source={{uri:this.state.image_uri}} 
            style={{height:"100%",width:"100%"}}
            onLoadStart={()=>this.setState({ Activity_Indicator : true })}
            onLoadEnd={()=>this.setState({ Activity_Indicator : false })}
          >
            <ActivityIndicator 
              color="#FFF" 
              size="large"  
              style={{position:"absolute",top:Dev_Height-(0.5*Dev_Height),right:Dev_Width-(0.55*Dev_Width)}} 
              animating={this.state.Activity_Indicator}
            />

            <View style={styles.close_button_style}>
              <TouchableOpacity style={styles.Close_Button_Touchable} onPress={()=>this.props.navigation.goBack()}>
                <Icon name="left" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={{height:"70%",width:"100%",justifyContent:"flex-end",backgroundColor:"transparent",alignItems:"center"}}>
              <TouchableOpacity onPress={()=>this.downloadImage()}
                style={{height:50,width:160,borderRadius:15,backgroundColor:"rgba(225,225,225,0.9)",justifyContent:"center",alignItems:"center",marginBottom:40}}>
                <Text style={{color:"#121212",fontSize:16}}>Download</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <View style={{height:"100%",width:"100%"}}>
            <View style={styles.close_button_style}>
              <TouchableOpacity style={styles.Close_Button_Touchable} onPress={()=>this.props.navigation.goBack()}>
                <Icon name="left" size={18} color="#2abb9b" />
              </TouchableOpacity>
            </View>
            <View style={{height:"50%",width:"100%",justifyContent:"center",alignItems:"center"}}>
              <ActivityIndicator color="#2abb9b" size="large" />
            </View>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    height:Dev_Height,
    width:Dev_Width,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#222222",
  },
  close_button_style: {
    height: '20%',
    width: '90%',
    justifyContent:"center",
    paddingTop:StatusBar.currentHeight
  },
  Close_Button_Touchable: {
    height: 50,
    width: 50,
    backgroundColor: 'rgba(225,225,225,0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:"10%"
  },
})
