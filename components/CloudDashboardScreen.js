import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  state = {
    searchQuery: '',
    isBrowserOpen: false,
    selectedAppUrl: '',
    selectedAppName: '',
    firebaseAppsList: [
      { id: '1', title: 'YouTube', desc: 'वीडियो और कंटेंट', url: 'https://m.youtube.com', icon: 'logo-youtube', color: '#FF0000' },
      { id: '2', title: 'Instagram', desc: 'रील्स और फोटो', url: 'https://www.instagram.com', icon: 'logo-instagram', color: '#E1306C' },
      { id: '3', title: 'WhatsApp', desc: 'फास्ट मैसेजिंग', url: 'https://web.whatsapp.com', icon: 'logo-whatsapp', color: '#25D366' },
      { id: '4', title: 'Facebook', desc: 'सोशल अपडेट्स', url: 'https://m.facebook.com', icon: 'logo-facebook', color: '#4267B2' },
      { id: '5', title: 'X (Twitter)', desc: 'लेटेस्ट न्यूज़', url: 'https://twitter.com', icon: 'logo-twitter', color: '#1DA1F2' },
      { id: '6', title: 'Telegram', desc: 'क्लाउड मैसेजिंग', url: 'https://web.telegram.org', icon: 'paper-plane', color: '#2AABEE' },
      { id: '7', title: 'LinkedIn', desc: 'जॉब्स और नेटवर्किंग', url: 'https://www.linkedin.com', icon: 'logo-linkedin', color: '#0A66C2' },
      { id: '8', title: 'Snapchat', desc: 'कैमरा मैसेजिंग', url: 'https://web.snapchat.com', icon: 'camera', color: '#FFFC00' },
      { id: '9', title: 'Pinterest', desc: 'क्रिएटिव आइडियाज', url: 'https://in.pinterest.com', icon: 'logo-pinterest', color: '#E60023' },
      { id: '10', title: 'Reddit', desc: 'कम्युनिटी चर्चाएं', url: 'https://www.reddit.com', icon: 'chatbubbles', color: '#FF4500' },
      { id: '11', title: 'Discord', desc: 'गेमिंग चैट', url: 'https://discord.com', icon: 'chatbox', color: '#5865F2' },
      { id: '12', title: 'Threads', desc: 'टेक्स्ट ऐप', url: 'https://www.threads.net', icon: 'at', color: '#000000' },
    ]
  };

  openAppWebView = (app) => {
    this.setState({ selectedAppUrl: app.url, selectedAppName: app.title, isBrowserOpen: true });
  };

  render() {
    const { searchQuery, firebaseAppsList, isBrowserOpen, selectedAppName, selectedAppUrl } = this.state;
    
    // सर्च करने पर पूरा फिल्टर होगा, अन्यथा केवल पहले 10 ऐप्स दिखेंगे
    const filteredApps = searchQuery.length > 0 
      ? firebaseAppsList.filter(app => app.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : firebaseAppsList.slice(0, 10);

    // ब्राउज़र व्यू
    if (isBrowserOpen) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1C1F26" />
          
          <View style={styles.browserHeader}>
            <TouchableOpacity onPress={() => this.setState({ isBrowserOpen: false })}>
              <Ionicons name="arrow-back" size={26} color="#FFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle} numberOfLines={1}>
              {selectedAppName}
            </Text>
            
            <TouchableOpacity onPress={() => this.setState({ isBrowserOpen: false })}>
              <Ionicons name="home" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.webViewContainer}>
            <WebView 
              source={{ uri: selectedAppUrl }} 
              style={styles.webView}
              overScrollMode="never"
              bounces={false}
              allowsBackForwardNavigationGestures={false} 
            />
          </View>
        </SafeAreaView>
      );
    }

    // होम व्यू
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0e0f12" />
        
        {/* होम पेज का हेडर - तीर का निशान हटा दिया गया है */}
        <View style={styles.homeHeader}>
          <Text style={styles.homeTitle}>Prabhavati Super App</Text>
        </View>

        {/* सर्च बॉक्स - टाइपिंग हटाने के लिए X का निशान */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Search Apps..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={(text) => this.setState({ searchQuery: text })}
          />
          {/* अगर टाइप किया है तो कट (X) बटन दिखाएं */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => this.setState({ searchQuery: '' })}>
              <Ionicons name="close-circle" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* स्क्रॉल व्यू में ऐप्स की लिस्ट - ताकि फिल्टर होने पर स्क्रॉल हो सके */}
        <ScrollView 
          style={styles.listContainer}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filteredApps.map((app) => (
            <TouchableOpacity 
              key={app.id} 
              style={styles.appCard} 
              activeOpacity={0.7}
              onPress={() => this.openAppWebView(app)}
            >
              <View style={[styles.iconBox, { backgroundColor: app.color + '25' }]}>
                <Ionicons name={app.icon} size={28} color={app.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{app.title}</Text>
                <Text style={styles.cardDesc}>{app.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0f12' },
  homeHeader: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 15 },
  homeTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1C1F26', 
    marginHorizontal: 20, 
    paddingHorizontal: 15, 
    borderRadius: 16, 
    height: 55, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2A2E3D'
  },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  
  listContainer: { flex: 1, paddingHorizontal: 20 },
  appCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1C1F26', 
    padding: 16, // कार्ड को बड़ा करने के लिए पैडिंग बढ़ाई गई है
    borderRadius: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#232733'
  },
  iconBox: { 
    width: 55, // आइकॉन बॉक्स का साइज़ बढ़ाया
    height: 55, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  textContainer: { marginLeft: 16, flex: 1 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }, // टाइटल का साइज़ बढ़ाया
  cardDesc: { color: '#aaa', fontSize: 13, marginTop: 4 },
  
  browserHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 35, backgroundColor: '#1C1F26' },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 10 },
  webViewContainer: { flex: 1, overflow: 'hidden' },
  webView: { flex: 1, backgroundColor: '#0D0F14' }
});