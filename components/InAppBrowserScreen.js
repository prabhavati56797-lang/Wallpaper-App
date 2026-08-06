import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ सही इम्पोर्ट पाथ
import NetInfo from '@react-native-community/netinfo';

export default function InAppBrowserScreen({ route, navigation }) {
  const { url, title } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [hasInternet, setHasInternet] = useState(true);

  useEffect(() => {
    // 1. इंटरनेट कनेक्शन चेक करें
    const unsubscribe = NetInfo.addEventListener(state => {
      setHasInternet(state.isConnected);
      if (!state.isConnected) {
        Alert.alert("⚠️ No Internet", "Please check your internet connection and try again.");
      }
    });

    // 2. एंड्रॉइड हार्डवेयर बैक बटन हैंडल करने के लिए
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  if (!hasInternet) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color="#EF4444" />
        <Text style={styles.errorText}>No Internet Connection</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Go Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔝 टॉप कस्टम हेडर */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle} numberOfLines={1}>{title || 'App'}</Text>
        </TouchableOpacity>
      </View>

      {/* 📱 वेबव्यू */}
      <WebView 
        source={{ uri: url }} 
        style={{ flex: 1, backgroundColor: '#0F172A' }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* लोडिंग इंडिकेटर */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    height: 90,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    elevation: 4,
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 15, maxWidth: '80%' },
  loaderContainer: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }] },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A', padding: 20 },
  errorText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  retryButton: { marginTop: 20, backgroundColor: '#3B82F6', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  retryText: { color: '#FFFFFF', fontWeight: 'bold' }
});