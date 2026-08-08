import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

export default function DailyEssentialScreen({ route, navigation }) {
  const { appName, appUrl, iconColor } = route.params || { 
    appName: 'Browser', 
    appUrl: 'https://www.google.com', 
    iconColor: '#3B82F6' 
  };
  
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{appName}</Text>
      </View>
      <View style={styles.body}>
        <WebView 
          source={{ uri: appUrl }} 
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={iconColor} />
            <Text style={styles.loadingText}>Opening {appName}...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: { height: 99, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#111827' },
  backButton: { marginRight: 15 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  body: { flex: 1, backgroundColor: '#000' },
  loaderContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F19' },
  loadingText: { color: '#fff', marginTop: 10 }
});