import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// सभी स्क्रीन इम्पोर्ट्स
import AuthScreen from "./components/AuthScreen"; 
import HomeScreen from "./components/HomeScreen";
import FullCatogeryScreen from "./components/FullScreen";
import ImageDisplay from "./components/ImageDisplay";
import NotificationsScreen from './components/Notifications';
import ProfileScreen from "./components/ProfileScreen";
import AiChatScreen from "./components/AiChatScreen"; 

// वीडियो और अन्य पेजों के इम्पोर्ट्स
import VideoClipsScreen from "./components/VideoClipsScreen";
import VideosScreen from "./components/VideosScreen"; // 👈 दूसरी वीडियो फाइल का इम्पोर्ट
import BackgroundMusicScreen from "./components/BackgroundMusicScreen";
import StickersGifsScreen from "./components/StickersGifsScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(false); 
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Home' : 'Auth'}
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'vertical',
          animationEnabled: false,
        }}
      >
        {/* 1. ऑथेंटिकेशन पेज */}
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ headerShown: false }}
        />

        {/* 2. होम स्क्रीन */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />

        {/* फुल कैटेगरी स्क्रीन */}
        <Stack.Screen 
          name="FullCatogery" 
          component={FullCatogeryScreen} 
          options={{ headerShown: false }}
        />

        {/* इमेज डिस्प्ले स्क्रीन */}
        <Stack.Screen 
          name="ImageDisplay" 
          component={ImageDisplay} 
          options={{ headerShown: false }}
        />

        {/* नोटिफिकेशन्स स्क्रीन */}
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen} 
          options={{ headerShown: false }}
        />

        {/* यूजर प्रोफाइल स्क्रीन */}
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }}
        />

        {/* इन-ऐप जेमिनी एआई चैट स्क्रीन */}
        <Stack.Screen 
          name="AiChat" 
          component={AiChatScreen} 
          options={{ headerShown: false }}
        />

        {/* 🎬 वीडियो क्लिप्स स्क्रीन (पहला नाम) */}
        <Stack.Screen 
          name="VideoClips" 
          component={VideoClipsScreen} 
          options={{ headerShown: false }}
        />

        {/* 🎬 वीडियो स्क्रीन (दूसरा नाम जो HomeScreen मांग रहा है) */}
        <Stack.Screen 
          name="VideosScreen" 
          component={VideosScreen} 
          options={{ headerShown: false }}
        />

        {/* 🎵 बैकग्राउंड म्यूजिक स्क्रीन */}
        <Stack.Screen 
          name="BackgroundMusic" 
          component={BackgroundMusicScreen} 
          options={{ headerShown: false }}
        />

        {/* 🎨 स्टिकर्स एंड जिफ्स स्क्रीन */}
        <Stack.Screen 
          name="StickersGifs" 
          component={StickersGifsScreen} 
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0F19',
  },
});