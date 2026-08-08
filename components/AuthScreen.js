import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Text, StatusBar, Animated, Easing, SafeAreaView 
} from 'react-native';

export default function AuthScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // नेटफ्लिक्स स्टाइल ज़ूम और फेड एनीमेशन
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    // 5 सेकंड का टाइमर (पूरे 5 सेकंड रुकने के बाद होम पेज पर जाएगा)
    const timer = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Home'); // बिना किसी जर्क के होम पेज पर रीडायरेक्ट करेगा
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View 
        style={[
          styles.centerContainer, 
          { 
            opacity: opacityAnim, 
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        <Text style={styles.brandText}>PRABHAVATI</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#bbbb39',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(229, 9, 20, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  }
});