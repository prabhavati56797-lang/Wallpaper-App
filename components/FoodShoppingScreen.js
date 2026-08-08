import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

export default function FoodShoppingScreen({ route, navigation }) {
  // होम स्क्रीन से भेजा गया ऐप का नाम और URL यहाँ मिलेगा
  const { appName, appUrl, iconColor } = route.params || { 
    appName: 'Store', 
    appUrl: 'https://www.google.com', 
    iconColor: '#3B82F6' 
  };
  
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* ऊपर का हेडर */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{appName}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{appUrl}</Text>
        </View>
      </View>

      {/* मुख्य वेबव्यू बॉडी */}
      <View style={styles.body}>
        <WebView 
          source={{ uri: appUrl }} 
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        {/* शानदार लोडिंग स्पिनर */}
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={iconColor || '#3B82F6'} />
            <Text style={styles.loadingText}>Opening {appName}...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: { height: 98, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#111827', borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  backButton: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flex: 1, marginLeft: 8 },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  headerSubtitle: { color: '#9CA3AF', fontSize: 11, marginTop: 1 },
  body: { flex: 1, backgroundColor: '#000000' },
  loaderContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F19', zIndex: 999 },
  loadingText: { color: '#94A3B8', marginTop: 12, fontSize: 14, fontWeight: '500' },
});