import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default class AiChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* कस्टम हेडर जिसमें पीछे जाने का बटन है */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Ionicons name="sparkles" size={16} color="#C084FC" style={{ marginRight: 6 }} />
            <Text style={styles.headerTitle}>Gemini AI Assistant</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* इन-ऐप WebView जहाँ Gemini खुलेगा */}
        <View style={styles.webviewWrapper}>
          {this.state.isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#C084FC" />
              <Text style={styles.loaderText}>AI लोड हो रहा है, कृपया प्रतीक्षा करें...</Text>
            </View>
          )}
          <WebView 
            source={{ uri: 'https://gemini.google.com/' }}
            style={styles.webview}
            onLoadEnd={() => this.setState({ isLoading: false })}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 35 : 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C084FC',
  },
  webviewWrapper: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0F19',
    zIndex: 99,
  },
  loaderText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '600',
  },
});