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
import VideosScreen from "./components/VideosScreen"; 
import BackgroundMusicScreen from "./components/BackgroundMusicScreen";
import StickersGifsScreen from "./components/StickersGifsScreen";

// पिछले 3 फीचर्स के इम्पोर्ट्स
import EmojiStudioScreen from "./components/EmojiStudioScreen";
import AIVideoFXScreen from "./components/AIVideoFXScreen";
import SoundFXScreen from "./components/SoundFXScreen";

// नए 6 वीडियो एडिटिंग फीचर्स के इम्पोर्ट्स
import ProTimelineScreen from "./components/ProTimelineScreen";
import ThumbnailStudioScreen from "./components/ThumbnailStudioScreen";
import AIMagicLabScreen from "./components/AIMagicLabScreen";
import FXColorGradingScreen from "./components/FXColorGradingScreen";
import AudioBeatSyncScreen from "./components/AudioBeatSyncScreen";
import KineticTextScreen from "./components/KineticTextScreen";

// 🌟 YouTube, Facebook और Instagram स्क्रीन्स के इम्पोर्ट्स
import YouTubeScreen from "./components/YouTubeScreen";
import FacebookScreen from "./components/FacebookScreen";
import InstagramScreen from "./components/InstagramScreen";

// 🌐 इन-ऐप ब्राउज़र स्क्रीन इम्पोर्ट
import InAppBrowserScreen from "./components/InAppBrowserScreen";

// 🔍 यूनिवर्सल सर्च और ब्राउज़र स्क्रीन इम्पोर्ट
import UniversalSearchScreen from "./components/UniversalSearchScreen";

// 🌍 ग्लोबल न्यूज़ और स्टोरीज स्क्रीन इम्पोर्ट
import GlobalNewsScreen from "./components/GlobalNewsScreen";

// 🌐 World Services & Apps Hub Screen इम्पोर्ट
import WorldHubScreen from "./components/WorldHubScreen";

// 🚀 क्लाउड डैशबोर्ड स्क्रीन इम्पोर्ट (जो आपने मेनू से खोलने के लिए बनाया है)
import CloudDashboardScreen from "./components/CloudDashboardScreen"; 

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

        {/* 🎬 वीडियो क्लिप्स स्क्रीन */}
        <Stack.Screen 
          name="VideoClips" 
          component={VideoClipsScreen} 
          options={{ headerShown: false }}
        />

        {/* 🎬 वीडियो स्क्रीन */}
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

        {/* पिछले 3 फीचर्स की स्क्रीन्स */}
        <Stack.Screen 
          name="EmojiStudio" 
          component={EmojiStudioScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="AIVideoFX" 
          component={AIVideoFXScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="SoundFX" 
          component={SoundFXScreen} 
          options={{ headerShown: false }}
        />

        {/* नए 6 वीडियो एडिटिंग फीचर्स की स्क्रीन्स */}
        <Stack.Screen 
          name="ProTimeline" 
          component={ProTimelineScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="ThumbnailStudio" 
          component={ThumbnailStudioScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="AIMagicLab" 
          component={AIMagicLabScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="FXColorGrading" 
          component={FXColorGradingScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="AudioBeatSync" 
          component={AudioBeatSyncScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="KineticText" 
          component={KineticTextScreen} 
          options={{ headerShown: false }}
        />

        {/* 🌟 YouTube, Facebook और Instagram की स्क्रीन्स */}
        <Stack.Screen 
          name="YouTube" 
          component={YouTubeScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Facebook" 
          component={FacebookScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Instagram" 
          component={InstagramScreen} 
          options={{ headerShown: false }}
        />

        {/* 🌐 In-App Browser Screen */}
        <Stack.Screen 
          name="InAppBrowserScreen" 
          component={InAppBrowserScreen} 
          options={{ headerShown: false }}
        />

        {/* 🔍 Universal Search & Browser Screen */}
        <Stack.Screen 
          name="UniversalSearchScreen" 
          component={UniversalSearchScreen} 
          options={{ headerShown: false }}
        />

        {/* 🌍 Global News & Stories Screen */}
        <Stack.Screen 
          name="GlobalNews" 
          component={GlobalNewsScreen} 
          options={{ headerShown: false }}
        />

        {/* 🌐 World Services & Apps Hub Screen */}
        <Stack.Screen 
          name="WorldHubScreen" 
          component={WorldHubScreen} 
          options={{ headerShown: false }}
        />

        {/* 🚀 Cloud Dashboard Screen (मेनू बटन से खुलने वाला पेज) */}
        <Stack.Screen 
          name="CloudDashboardScreen" 
          component={CloudDashboardScreen} 
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