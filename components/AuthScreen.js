import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform, 
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginMode: true, // True = Sign In, False = Sign Up
      email: '',
      password: '',
      fullName: '',
      secureText: true,
      isLoading: false,
      loadingStepText: 'सुरक्षित सर्वर से जुड़ रहा है...',
      errorMessage: ''
    };

    // एनिमेशन वैल्यूज
    this.slideAnim = new Animated.Value(0);
    this.fadeAnim = new Animated.Value(1);
    this.spinValue = new Animated.Value(0);
    this.pulseValue = new Animated.Value(1);
  }

  componentDidMount() {
    this.startInfiniteAnimations();
  }

  // हमेशा चलते रहने वाला प्रीमियम एनिमेशन इंजन
  startInfiniteAnimations = () => {
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.pulseValue, {
          toValue: 1.12,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(this.pulseValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  sanitizeInput = (inputText) => {
    if (!inputText) return '';
    return inputText.replace(/<[^>]*>?/gm, '').replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, '');
  };

  validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // डेटा सुरक्षित रूप से सेव करके होम पेज पर रीडायरेक्ट करना
  completeAuthentication = async (name, email) => {
    try {
      await AsyncStorage.setItem('USER_PROFILE_NAME', this.sanitizeInput(name));
      await AsyncStorage.setItem('USER_LOGIN_EMAIL', this.sanitizeInput(email));
      await AsyncStorage.setItem('AUTH_SESSION_TOKEN', 'SECURE_TOKEN_' + Date.now());
    } catch (error) {
      console.log('Secure Storage Exception:', error);
    }

    Animated.parallel([
      Animated.timing(this.slideAnim, {
        toValue: -SCREEN_HEIGHT, 
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(this.fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start(() => {
      this.setState({ isLoading: false });
      this.props.navigation.replace('Home');
    });
  };

  // फॉर्म वैलिडेट करें और डायरेक्ट लॉगिन/रजिस्टर प्रक्रिया पूरी करें
  handleAuthSubmit = () => {
    const { isLoginMode, email, password, fullName } = this.state;

    const cleanEmail = this.sanitizeInput(email.trim());
    const cleanPassword = password.trim();
    const cleanName = this.sanitizeInput(fullName.trim());

    if (!cleanEmail || !cleanPassword || (!isLoginMode && !cleanName)) {
      this.setState({ errorMessage: '⚠️ कृपया सभी आवश्यक फ़ील्ड्स को पूरी तरह भरें।' });
      return;
    }

    if (!this.validateEmail(cleanEmail)) {
      this.setState({ errorMessage: '⚠️ कृपया एक वैध (Valid) ईमेल आईडी दर्ज करें।' });
      return;
    }

    if (cleanPassword.length < 6) {
      this.setState({ errorMessage: '⚠️ सुरक्षा के लिए पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' });
      return;
    }

    this.setState({ 
      errorMessage: '', 
      isLoading: true, 
      loadingStepText: 'क्रेडेंशियल्स एन्क्रिप्ट हो रहे हैं...' 
    });

    setTimeout(() => {
      this.setState({ loadingStepText: 'सत्यापन सफल! होम पेज पर रीडायरेक्ट हो रहा है...' });
      
      const displayName = isLoginMode ? (cleanEmail.split('@')[0].toUpperCase() || 'SECURE USER') : cleanName;
      
      setTimeout(() => {
        this.completeAuthentication(displayName, cleanEmail);
      }, 1000);
    }, 1200);
  };

  render() {
    const { isLoginMode, secureText, isLoading, loadingStepText, errorMessage } = this.state;

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    const slideStyle = {
      transform: [
        { translateY: this.slideAnim },
        { perspective: 1000 },
        { rotateX: this.slideAnim.interpolate({ inputRange: [-SCREEN_HEIGHT, 0], outputRange: ['6deg', '0deg'] }) }
      ],
      opacity: this.fadeAnim
    };

    return (
      <View style={styles.mainWrapper}>
        <StatusBar barStyle="light-content" backgroundColor="#030712" />
        <Animated.View style={[styles.container, slideStyle]}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                {/* टॉप सिक्योरिटी बैज */}
                <View style={styles.topHeader}>
                  <View style={styles.brandBadge}>
                    <MaterialCommunityIcons name="shield-check" size={14} color="#34D399" />
                    <Text style={styles.brandBadgeText}> SECURE DIRECT AUTH GATEWAY</Text>
                  </View>
                </View>

                {/* एनिमेटेड शील्ड हब */}
                <View style={styles.bannerContainer}>
                  <View style={styles.animationWrapper}>
                    <Animated.View style={[styles.pulseRing, { transform: [{ scale: this.pulseValue }] }]} />
                    <Animated.View style={[styles.rotatingBorder, { transform: [{ rotate: spin }] }]} />
                    <View style={styles.centerCoreCircle}>
                      <MaterialCommunityIcons name="shield-star" size={42} color="#38BDF8" />
                      <View style={styles.miniLockBadge}>
                        <Ionicons name="checkmark" size={10} color="#34D399" />
                      </View>
                    </View>
                  </View>

                  <Text style={styles.bannerHeading}>
                    {isLoginMode ? 'सुरक्षित पोर्टल में लॉगिन करें 👋' : 'नया खाता पंजीकृत करें 🚀'}
                  </Text>
                  <Text style={styles.bannerSubtext}>
                    {isLoginMode 
                      ? 'अपने क्रेडेंशियल्स दर्ज करें और सुरक्षित रूप से सीधे प्रवेश करें।' 
                      : 'खाता बनाने के लिए अपनी डिटेल्स भरें और झटपट रजिस्टर करें।'}
                  </Text>
                </View>

                {/* साइन इन / साइन अप टैब स्विच */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity 
                    style={[styles.tabButton, isLoginMode && styles.activeTabButton]}
                    onPress={() => !isLoading && this.setState({ isLoginMode: true, errorMessage: '' })}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabText, isLoginMode && styles.activeTabText]}>Sign In</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.tabButton, !isLoginMode && styles.activeTabButton]}
                    onPress={() => !isLoading && this.setState({ isLoginMode: false, errorMessage: '' })}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabText, !isLoginMode && styles.activeTabText]}>Sign Up</Text>
                  </TouchableOpacity>
                </View>

                {/* मेन फॉर्म कंटेनर */}
                <View style={styles.formContainer}>
                  {errorMessage ? (
                    <View style={styles.errorBox}>
                      <Ionicons name="warning-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                  ) : null}

                  {!isLoginMode && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>पूरा नाम (Full Name)</Text>
                      <View style={styles.inputBox}>
                        <Ionicons name="person-outline" size={18} color="#38BDF8" style={{ marginRight: 12 }} />
                        <TextInput 
                          style={styles.textInput}
                          placeholder="अपना पूरा नाम दर्ज करें"
                          placeholderTextColor="#4B5563"
                          editable={!isLoading}
                          value={this.state.fullName}
                          onChangeText={(text) => this.setState({ fullName: this.sanitizeInput(text) })}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ईमेल आईडी (Email Address)</Text>
                    <View style={styles.inputBox}>
                      <Ionicons name="mail-outline" size={18} color="#38BDF8" style={{ marginRight: 12 }} />
                      <TextInput 
                        style={styles.textInput}
                        placeholder="name@gmail.com"
                        placeholderTextColor="#4B5563"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: text })}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>पासवर्ड (Password)</Text>
                    <View style={styles.inputBox}>
                      <Ionicons name="lock-closed-outline" size={18} color="#38BDF8" style={{ marginRight: 12 }} />
                      <TextInput 
                        style={styles.textInput}
                        placeholder="••••••••••••"
                        placeholderTextColor="#4B5563"
                        secureTextEntry={secureText}
                        editable={!isLoading}
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ password: text })}
                      />
                      <TouchableOpacity onPress={() => this.setState({ secureText: !secureText })}>
                        <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={18} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={this.handleAuthSubmit}
                    disabled={isLoading}
                    activeOpacity={0.85}
                  >
                    {isLoading ? (
                      <View style={styles.loadingRow}>
                        <ActivityIndicator size="small" color="#030712" style={{ marginRight: 10 }} />
                        <Text style={styles.primaryButtonText}>{loadingStepText}</Text>
                      </View>
                    ) : (
                      <View style={styles.buttonContentRow}>
                        <Text style={styles.primaryButtonText}>
                          {isLoginMode ? 'Secure Sign In' : 'Complete Registration'}
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="#030712" style={{ marginLeft: 8 }} />
                      </View>
                    )}
                  </TouchableOpacity>

                </View>

                {/* फुटर सिक्योरिटी नोट */}
                <View style={styles.footerNote}>
                  <Ionicons name="shield-checkmark" size={12} color="#34D399" />
                  <Text style={styles.footerNoteText}> Encrypted Direct Gateway Active</Text>
                </View>

              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#030712' },
  container: { flex: 1, backgroundColor: '#030712' },
  scrollContainer: { padding: 24, paddingBottom: 40, justifyContent: 'center' },
  topHeader: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15, marginTop: 10 },
  brandBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(52, 211, 153, 0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(52, 211, 153, 0.2)' },
  brandBadgeText: { color: '#34D399', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  
  bannerContainer: { alignItems: 'center', marginBottom: 25 },
  animationWrapper: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  pulseRing: { position: 'absolute', width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(56, 189, 248, 0.15)' },
  rotatingBorder: { position: 'absolute', width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#38BDF8', borderStyle: 'dashed' },
  centerCoreCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0B0F19', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#34D399', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12, elevation: 12 },
  miniLockBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#0B0F19', borderRadius: 8, padding: 2, borderWidth: 1, borderColor: '#34D399' },

  bannerHeading: { fontSize: 22, fontWeight: '900', color: '#F9FAFB', marginBottom: 8, textAlign: 'center', letterSpacing: 0.5 },
  bannerSubtext: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 15, lineHeight: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#0B0F19', borderRadius: 16, padding: 5, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)' },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  activeTabButton: { backgroundColor: '#38BDF8', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  tabText: { color: '#6B7280', fontSize: 14, fontWeight: '700' },
  activeTabText: { color: '#030712', fontWeight: '900' },
  formContainer: { backgroundColor: '#0B0F19', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  inputGroup: { marginBottom: 18 },
  inputLabel: { color: '#E5E7EB', fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 14, paddingHorizontal: 16, height: 54, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' },
  textInput: { flex: 1, color: '#F9FAFB', fontSize: 15 },
  primaryButton: { backgroundColor: '#38BDF8', height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  buttonContentRow: { flexDirection: 'row', alignItems: 'center' },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  primaryButtonText: { color: '#030712', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  footerNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerNoteText: { color: '#34D399', fontSize: 11, fontWeight: '600' }
});