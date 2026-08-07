import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function UniversalSearchScreen({ route, navigation }) {
  // होम पेज से जो URL भेजा जाएगा, वह यहाँ आ जाएगा (अगर नहीं भेजा तो बायडिफ़ॉल्ट गूगल खुलेगा)
  const initialUrl = route?.params?.initialUrl || 'https://www.google.com';

  const [searchText, setSearchText] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);

  // अगर यूजर होम पेज से दूसरा बटन दबाता है, तो यूआरएल अपने आप अपडेट हो जाएगा
  useEffect(() => {
    if (route?.params?.initialUrl) {
      setCurrentUrl(route.params.initialUrl);
      setSearchText(route.params.initialUrl);
    }
  }, [route?.params?.initialUrl]);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    let targetUrl = searchText.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;
    }
    setCurrentUrl(targetUrl);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌐 प्रोफेशनल ब्राउज़र टॉप हेडर */}
      <View style={styles.header}>
        {/* होम पेज पर जाने के लिए बैक बटन */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* यूआरएल / सर्च बार */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={16} color="#9AA0A6" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search or type URL"
            placeholderTextColor="#9AA0A6"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#9AA0A6" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator जब वेबसाइट लोड हो रही हो */}
      {isLoading && (
        <ActivityIndicator size="large" color="#8ab4f8" style={styles.loader} />
      )}

      {/* 🌍 WebView - एक ही पेज पर दुनिया का हर लिंक खोलने के लिए */}
      <WebView 
        ref={webViewRef}
        source={{ uri: currentUrl }} 
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        onLoadEnd={() => setIsLoading(false)}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setSearchText(navState.url); // यूआरएल बदलते ही बार में दिखाने के लिए
        }}
      />

      {/* 🧭 बॉटम ब्राउज़र कंट्रोल बार */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          disabled={!canGoBack} 
          onPress={() => webViewRef.current && webViewRef.current.goBack()}
          style={styles.bottomIcon}
        >
          <Ionicons name="chevron-back" size={24} color={canGoBack ? "#FFFFFF" : "#5F6368"} />
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={!canGoForward} 
          onPress={() => webViewRef.current && webViewRef.current.goForward()}
          style={styles.bottomIcon}
        >
          <Ionicons name="chevron-forward" size={24} color={canGoForward ? "#FFFFFF" : "#5F6368"} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => webViewRef.current && webViewRef.current.reload()}
          style={styles.bottomIcon}
        >
          <Ionicons name="reload" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {
            setCurrentUrl('https://www.google.com');
            setSearchText('https://www.google.com');
          }}
          style={styles.bottomIcon}
        >
          <Ionicons name="home-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#202124'
  },
  header: { 
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    paddingVertical: 35, 
    backgroundColor: '#202124', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3c4043'
  },
  backButton: {
    padding: 8,
    marginRight: 4,
    borderRadius: 20,
    backgroundColor: '#303134',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#303134',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#5f6368'
  },
  searchIcon: {
    marginRight: 8,
  },
  input: { 
    flex: 1, 
    color: '#ffffff', 
    fontSize: 15,
    paddingVertical: 0,
  },
  goButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#8ab4f8',
    borderRadius: 8,
  },
  goButtonText: {
    color: '#202124',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  webView: { 
    flex: 1,
    backgroundColor: '#202124'
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#202124',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#3c4043'
  },
  bottomIcon: {
    padding: 6,
  }
});