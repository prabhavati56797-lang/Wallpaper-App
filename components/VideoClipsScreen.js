import React, { Component } from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, BackHandler 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview'; // ऐप के अंदर Pexels दिखाने के लिए

export default class VideoClipsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // हार्डवेयर बैक बटन को हैंडल करने के लिए
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackPress();
      return true;
    });
  }

  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
  }

  // वापस जाने के लिए
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
            <Text style={styles.headerTitle}>Pexels Video Clips</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* पूरी स्क्रीन पर डायरेक्ट Pexels वेबसाइट खुलेगी */}
          <WebView 
            source={{ uri: 'https://www.pexels.com/search/videos/' }} 
            style={styles.webview}
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