import React from "react"
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  RefreshControl
} from "react-native"

import Constants from 'expo-constants';

const Dev_Height = Dimensions.get('screen').height
const Dev_Width = Dimensions.get('screen').width

// Fallback images used when Pexels API key is not provided
const FALLBACK_PHOTOS = [
  { id: '1', src: { medium: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg', original: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg' } },
  { id: '2', src: { medium: 'https://images.pexels.com/photos/2147029/pexels-photo-2147029.jpeg', original: 'https://images.pexels.com/photos/2147029/pexels-photo-2147029.jpeg' } },
  { id: '3', src: { medium: 'https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg', original: 'https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg' } },
  { id: '4', src: { medium: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg', original: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg' } },
  { id: '5', src: { medium: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg', original: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg' } },
  { id: '6', src: { medium: 'https://images.pexels.com/photos/159393/gamepad-video-game-controller-game-controller-controller-159393.jpeg', original: 'https://images.pexels.com/photos/159393/gamepad-video-game-controller-game-controller-controller-159393.jpeg' } }
]

export default class FullScreen extends React.Component{

    FindImages=async(query,page_no)=>{
      this.setState({ refreshing : true})
      const PEXELS_KEY = Constants.expoConfig?.extra?.PEXELS_API_KEY || Constants.manifest?.extra?.PEXELS_API_KEY || null;

      if (!PEXELS_KEY) {
        // fallback to static images
        this.setState({ carouselItems: FALLBACK_PHOTOS, refreshing:false });
        return;
      }

      try {
        const resp = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=${page_no}`, {
          headers: { Authorization: PEXELS_KEY }
        });
        const json = await resp.json();
        if (json && json.photos) {
          this.setState({ carouselItems: json.photos, refreshing:false });
        } else {
          this.setState({ carouselItems: FALLBACK_PHOTOS, refreshing:false });
        }
      } catch (err) {
        console.warn(err);
        this.setState({ carouselItems: FALLBACK_PHOTOS, refreshing:false });
      }
    }


    constructor(props){
        super(props);
        this.state = {
          carouselItems:[ ],
          query:this.props.route.params?.query || 'Nature',
          refreshing:false
      }
    }

    componentDidMount(){
      this.FindImages(this.state.query,1)
    }
    
  render(){
    return(
      <SafeAreaView style={styles.container}>
      <View style={styles.FlatList_Container}>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          data={this.state.carouselItems}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.FindImages(this.state.query,2)} 
               title="Refreshing" 
               titleColor="#FFF" 
               colors={["gray","orange"]}
            />
           }
          renderItem={({item}) => {
            return (
              <TouchableOpacity 
               style={{height:Dev_Height-(0.7*Dev_Height),width:"48%",borderRadius:15,justifyContent:"center",alignItems:"center"}} 
               onPress={()=>this.props.navigation.navigate("ImageDisplay",{ photo: item })}
               >
                <Image source={{uri:item['src']['medium']}} style={{height:"95%",width:"95%",borderRadius:15}} />
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={()=>{
            return(
              <View style={{height:10}} />
            )
          }}
      />
      </View>
      </SafeAreaView>
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
    paddingTop:StatusBar.currentHeight
  },
  FlatList_Container:{
    height:"100%",
    width:"95%"
  }
})
