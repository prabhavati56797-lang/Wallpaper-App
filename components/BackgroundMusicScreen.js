import React, { Component } from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, BackHandler 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview'; // ऐप के अंदर NCS वेबसाइट लोड करने के लिए

export default class NCSMusicScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // मोबाइल के हार्डवेयर बैक बटन को हैंडल करने के लिए
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackPress();
      return true;
    });
  }

  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
  }

  // वापस होम पेज पर जाने के लिए
  handleBackPress = () => {
    this.props.navigation?.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <SafeAreaView style={{ flex: 1 }}>
          
          {/* टॉप हेडर जिसमें सिर्फ बैक बटन और टाइटल रहेगा */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={this.handleBackPress}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>NCS Music Library</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* सीधे ऐप के अंदर NCS (NoCopyrightSounds) की वेबसाइट खुलेगी */}
          <WebView 
            source={{ uri: 'https://ncs.io/' }} 
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 35, 
    paddingBottom: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a'
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: '#161616', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#222' 
  },
  headerTitle: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  webview: { 
    flex: 1,
    backgroundColor: '#000000'
  }
});