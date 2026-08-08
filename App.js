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

// अन्य पेजों के इम्पोर्ट्स
import VideosScreen from "./components/VideosScreen"; 

// 🌟 YouTube, Facebook और Instagram स्क्रीन्स के इम्पोर्ट्स
import YouTubeScreen from "./components/YouTubeScreen";
import FacebookScreen from "./components/FacebookScreen";
import InstagramScreen from "./components/InstagramScreen";

// 🌐 इन-ऐप ब्राउज़र स्क्रीन इम्पोर्ट
import InAppBrowserScreen from "./components/InAppBrowserScreen";

// 🍔 फूड और शॉपिंग के लिए नई स्क्रीन इम्पोर्ट
import FoodShoppingScreen from "./components/FoodShoppingScreen";

// 🌟 डेली एसेंशियल (20 ऐप्स) के लिए नई स्क्रीन इम्पोर्ट
import DailyEssentialScreen from "./components/DailyEssentialScreen";

// 🔍 यूनिवर्सल सर्च और ब्राउज़र स्क्रीन इम्पोर्ट
import UniversalSearchScreen from "./components/UniversalSearchScreen";

// 🌍 ग्लोबल न्यूज़ और स्टोरीज स्क्रीन इम्पोर्ट
import GlobalNewsScreen from "./components/GlobalNewsScreen";

// 🌐 World Services & Apps Hub Screen इम्पोर्ट
import WorldHubScreen from "./components/WorldHubScreen";

// 🚀 क्लाउड डैशबोर्ड स्क्रीन इम्पोर्ट
import CloudDashboardScreen from "./components/CloudDashboardScreen"; 

// 🌐 यूनिवर्सल ब्राउज़र स्क्रीन इम्पोर्ट (10 ऐप्स के लिए)
import UniversalBrowserScreen from "./components/UniversalBrowserScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animationEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                opacity: current.progress,
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width * 0.25, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {/* स्प्लैश स्क्रीन के रूप में AuthScreen */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />

        {/* होम स्क्रीन */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />

        {/* बाकी सभी स्क्रीन्स */}
        <Stack.Screen name="FullCatogery" component={FullCatogeryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ImageDisplay" component={ImageDisplay} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AiChat" component={AiChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VideosScreen" component={VideosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="YouTube" component={YouTubeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Facebook" component={FacebookScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Instagram" component={InstagramScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InAppBrowserScreen" component={InAppBrowserScreen} options={{ headerShown: false }} />
        
        {/* 🍔 फूड और शॉपिंग स्क्रीन */}
        <Stack.Screen name="FoodShoppingScreen" component={FoodShoppingScreen} options={{ headerShown: false }} />

        {/* 🌟 डेली एसेंशियल 20 ऐप्स वाली स्क्रीन */}
        <Stack.Screen name="DailyEssentialScreen" component={DailyEssentialScreen} options={{ headerShown: false }} />

        <Stack.Screen name="UniversalSearchScreen" component={UniversalSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GlobalNews" component={GlobalNewsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WorldHubScreen" component={WorldHubScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CloudDashboardScreen" component={CloudDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UniversalBrowserScreen" component={UniversalBrowserScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});