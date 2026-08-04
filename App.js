import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from "./components/HomeScreen";
import FullCatogeryScreen from "./components/FullScreen";
import ImageDisplay from "./components/ImageDisplay";
import NotificationsScreen from './components/Notifications';
import ProScreen from "./components/ProScreen";
import ProfileScreen from "./components/ProfileScreen"; // 👈 प्रोफाइल स्क्रीन यहाँ इम्पोर्ट कर दी गई है

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'vertical',
          animationEnabled: false,
        }}
        mode={'card'}>

        {/* होम स्क्रीन */}
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

        {/* यूजर प्रोफाइल स्क्रीन (अब यह पूरी तरह जुड़ चुकी है) */}
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}