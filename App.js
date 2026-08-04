import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// सभी स्क्रीन इम्पोर्ट्स
import AuthScreen from "./components/AuthScreen"; // 👈 सबसे पहले खुलने वाला सिक्योर ऑथेंटिकेशन पेज
import HomeScreen from "./components/HomeScreen";
import FullCatogeryScreen from "./components/FullScreen";
import ImageDisplay from "./components/ImageDisplay";
import NotificationsScreen from './components/Notifications';
import ProScreen from "./components/ProScreen";
import ProfileScreen from "./components/ProfileScreen";
import AiChatScreen from "./components/AiChatScreen"; 
import VideosScreen from "./components/VideosScreen"; 

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // चेक करता है कि यूज़र लॉग-ইন है या नहीं

  useEffect(() => {
    // यहाँ आप चाहें तो AsyncStore या SecureStore से चेक कर सकते हैं कि टोकन मौजूद है या नहीं
    setTimeout(() => {
      setIsLoading(false);
      // यदि यूज़र पहले से लॉग-इन है तो इसे true करें, अन्यथा false ताकि AuthScreen खुले
      setIsLoggedIn(false); 
    }, 1000);
  }, []);

  if (isLoading) {
    // जब तक ऐप सुरक्षा जाँच (Security Session Check) कर रहा है, लोडिंग स्पिनर दिखाएं
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Home' : 'Auth'} // 👈 यदि लॉग-इन है तो Home, वरना Auth खुलेगा
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'vertical',
          animationEnabled: false,
        }}
      >

        {/* 1. सबसे पहले खुलने वाला सिक्योर ऑथेंटिकेशन और साइन-इन/साइन-अप पेज */}
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

        {/* प्रो सब्सक्रिप्शन स्क्रीन */}
        <Stack.Screen 
          name="ProScreen" 
          component={ProScreen} 
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

        {/* वीडियो लर्निंग और ट्यूटोरियल स्क्रीन */}
        <Stack.Screen 
          name="VideosScreen" 
          component={VideosScreen} 
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