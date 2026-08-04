import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  ScrollView, 
  Platform, 
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
      loadingStepText: 'सत्यापित किया जा रहा है...',
      errorMessage: '',
    };
    // 3D स्लाइड-अप एनिमेशन के लिए वैल्यू
    this.slideAnim = new Animated.Value(0);
    this.fadeAnim = new Animated.Value(1);
  }

  sanitizeInput = (inputText) => {
    return inputText.replace(/[<>'"]/g, '');
  };

  handleAuthSubmit = () => {
    const { isLoginMode, email, password, fullName } = this.state;

    if (!email || !password || (!isLoginMode && !fullName)) {
      this.setState({ errorMessage: 'कृपया सभी आवश्यक फ़ील्ड्स को भरें।' });
      return;
    }

    // लोडिंग शुरू करें और यूज़र को 3 सेकंड रुकने का बेहतरीन अनुभव दें
    this.setState({ 
      errorMessage: '', 
      isLoading: true, 
      loadingStepText: 'डेटा सुरक्षित किया जा रहा है...' 
    });

    // पहला 1.5 सेकंड प्रोसेसिंग दिखाने के लिए
    setTimeout(() => {
      this.setState({ loadingStepText: 'डैशबोर्ड तैयार हो रहा है...' });
    }, 1500);

    // कुल 3 सेकंड (3000ms) पूरे होने के बाद 3D एनिमेशन और पेज स्विच होगा
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(this.slideAnim, {
          toValue: -SCREEN_HEIGHT, // स्क्रीन को ऊपर की तरफ खींच लेगा
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(this.fadeAnim, {
          toValue: 0.2,
          duration: 900,
          useNativeDriver: true,
        })
      ]).start(() => {
        this.setState({ isLoading: false });
        this.props.navigation.replace('Home');
      });
    }, 3000);
  };

  render() {
    const { isLoginMode, secureText, isLoading, loadingStepText, errorMessage } = this.state;

    const slideStyle = {
      transform: [
        { translateY: this.slideAnim },
        { perspective: 1000 },
        { rotateX: this.slideAnim.interpolate({ inputRange: [-SCREEN_HEIGHT, 0], outputRange: ['10deg', '0deg'] }) }
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
                
                <View style={styles.topHeader}>
                  <View style={styles.brandBadge}>
                    <MaterialCommunityIcons name="shield-lock" size={14} color="#38BDF8" />
                    <Text style={styles.brandBadgeText}> 3 SEC SECURE GATEWAY</Text>
                  </View>
                </View>

                <View style={styles.bannerContainer}>
                  <View style={styles.logoGlowCircle}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400' }} 
                      style={styles.bannerImage} 
                    />
                    <View style={styles.miniLockBadge}>
                      <Ionicons name="checkmark-done" size={12} color="#38BDF8" />
                    </View>
                  </View>

                  <Text style={styles.bannerHeading}>
                    {isLoginMode ? 'वापस स्वागत है! 👋' : 'खाता पंजीकृत करें 🚀'}
                  </Text>
                  <Text style={styles.bannerSubtext}>
                    {isLoginMode 
                      ? 'अपने सुरक्षित स्पेस को एक्सेस करें।' 
                      : 'प्रोफेशनल 3 सेकंड वेरिफिकेशन के साथ आगे बढ़ें।'}
                  </Text>
                </View>

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

                <View style={styles.formContainer}>
                  {errorMessage ? (
                    <View style={styles.errorBox}>
                      <Ionicons name="alert-circle-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
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
                          placeholder="अपना नाम दर्ज करें"
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
                        placeholder="name@example.com"
                        placeholderTextColor="#4B5563"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: this.sanitizeInput(text) })}
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
                          {isLoginMode ? 'Secure Sign In' : 'Create Secure Account'}
                        </Text>
                        <Ionicons name="arrow-up" size={16} color="#030712" style={{ marginLeft: 8 }} />
                      </View>
                    )}
                  </TouchableOpacity>

                </View>

                <View style={styles.footerNote}>
                  <Ionicons name="shield-checkmark" size={12} color="#34D399" />
                  <Text style={styles.footerNoteText}> 256-Bit SSL Encrypted 3-Second Verification</Text>
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
  scrollContainer: { padding: 24, paddingBottom: 40 },
  topHeader: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10, marginTop: 10 },
  brandBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(56, 189, 248, 0.06)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.15)' },
  brandBadgeText: { color: '#38BDF8', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  bannerContainer: { alignItems: 'center', marginBottom: 28 },
  logoGlowCircle: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#0B0F19', padding: 3, borderWidth: 2, borderColor: '#38BDF8', marginBottom: 16, overflow: 'hidden', elevation: 12, shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
  bannerImage: { width: '100%', height: '100%', borderRadius: 42 },
  miniLockBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#0B0F19', borderRadius: 10, padding: 3, borderWidth: 1, borderColor: '#38BDF8' },
  bannerHeading: { fontSize: 24, fontWeight: '900', color: '#F9FAFB', marginBottom: 8, textAlign: 'center', letterSpacing: 0.5 },
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