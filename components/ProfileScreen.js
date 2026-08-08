import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Modal,
  Image,
  Animated,
  TextInput
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    const routeParams = props.route && props.route.params ? props.route.params : {};
    
    this.state = {
      userName: routeParams.userName || 'PRABHAWATI USER',
      userEmail: routeParams.userEmail || 'user@example.com',
      profileImage: routeParams.profileImage || null,
      
      // पॉप-अप कंट्रोल्स
      isImageModalVisible: false,
      isEditProfileModalVisible: false,
      isLogoutModalVisible: false,
      isUpcomingModalVisible: false, // नए अपकमिंग फीचर पॉप-अप के लिए
      selectedFeatureTitle: '',

      // एडिट फॉर्म स्टेट
      tempName: routeParams.userName || 'PRABHAWATI USER',
    };

    // पॉप-अप एनिमेशन वैल्यूज
    this.modalScale = new Animated.Value(0);
    this.modalFade = new Animated.Value(0);

    // हमेशा चलने वाले (Looping) एनिमेशन की वैल्यूज
    this.pulseAnim = new Animated.Value(1);
    this.rotateAnim = new Animated.Value(0);
  }

  componentDidMount() {
    this.loadStoredData();
    this.startContinuousAnimation();
  }

  // AsyncStorage से डेटा लोड करना
  loadStoredData = async () => {
    try {
      const savedName = await AsyncStorage.getItem('USER_PROFILE_NAME');
      const savedEmail = await AsyncStorage.getItem('USER_LOGIN_EMAIL');
      const savedImage = await AsyncStorage.getItem('USER_PROFILE_IMAGE');
      
      this.setState({
        userName: savedName || this.state.userName,
        tempName: savedName || this.state.tempName,
        userEmail: savedEmail || this.state.userEmail,
        profileImage: savedImage || this.state.profileImage,
      });
    } catch (error) {
      console.log('Error loading data from storage:', error);
    }
  };

  // हमेशा चलने वाला (Continuous Looping) एनिमेशन
  startContinuousAnimation = () => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.pulseAnim, {
            toValue: 1.06,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(this.pulseAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(this.rotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // गैलरी से फोटो चुनने का फंक्शन
  pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("परमिशन आवश्यक", "गैलरी एक्सेस करने की अनुमति दें!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      
      this.setState({ profileImage: selectedUri });
      await AsyncStorage.setItem('USER_PROFILE_IMAGE', selectedUri);

      const routeParams = this.props.route && this.props.route.params ? this.props.route.params : {};
      if (routeParams.onProfileUpdate) {
        routeParams.onProfileUpdate(selectedUri);
      }

      this.closeImageModal();
      Alert.alert("सफलता", "प्रोफाइल फोटो सफलतापूर्वक अपडेट कर दी गई है! 📸");
    }
  };

  openImageModal = () => {
    this.setState({ isImageModalVisible: true });
    this.startModalAnimation();
  };
  closeImageModal = () => {
    this.setState({ isImageModalVisible: false });
  };

  openEditProfileModal = () => {
    this.setState({ 
      isEditProfileModalVisible: true,
      tempName: this.state.userName
    });
    this.startModalAnimation();
  };
  closeEditProfileModal = () => {
    this.setState({ isEditProfileModalVisible: false });
  };

  saveProfileDetails = async () => {
    if (!this.state.tempName.trim()) {
      Alert.alert("त्रुटि", "नाम खाली नहीं हो सकता!");
      return;
    }
    
    const newName = this.state.tempName;
    this.setState({
      userName: newName,
      isEditProfileModalVisible: false
    });

    try {
      await AsyncStorage.setItem('USER_PROFILE_NAME', newName);
    } catch (error) {
      console.log('Error saving name:', error);
    }

    Alert.alert("सफलता", "आपका नाम हमेशा के लिए सुरक्षित कर लिया गया है! ✨");
  };

  openLogoutModal = () => {
    this.setState({ isLogoutModalVisible: true });
    this.startModalAnimation();
  };
  closeLogoutModal = () => {
    this.setState({ isLogoutModalVisible: false });
  };

  handleLogout = () => {
    this.closeLogoutModal();
    if (this.props.navigation && this.props.navigation.replace) {
      this.props.navigation.replace('Auth');
    } else if (this.props.navigation && this.props.navigation.navigate) {
      this.props.navigation.navigate('Auth');
    }
  };

  // अपकमिंग फीचर्स के लिए क्लिक हैंडलर
  handleUpcomingFeature = (title) => {
    this.setState({ 
      selectedFeatureTitle: title,
      isUpcomingModalVisible: true 
    });
    this.startModalAnimation();
  };
  closeUpcomingModal = () => {
    this.setState({ isUpcomingModalVisible: false });
  };

  startModalAnimation = () => {
    this.modalScale.setValue(0);
    this.modalFade.setValue(0);
    Animated.parallel([
      Animated.spring(this.modalScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(this.modalFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  render() {
    const { 
      userName, 
      userEmail,
      profileImage, 
      isImageModalVisible, 
      isEditProfileModalVisible,
      isLogoutModalVisible,
      isUpcomingModalVisible,
      selectedFeatureTitle,
      tempName
    } = this.state;

    const spin = this.rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation && this.props.navigation.goBack ? this.props.navigation.goBack() : null}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerBadgeContainer}>
            <Text style={styles.headerBadgeText}>⭐ Enterprise Hub</Text>
          </View>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={this.openEditProfileModal}
          >
            <Feather name="edit-3" size={18} color="#38BDF8" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Profile Card Banner */}
          <View style={styles.profileCard}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.openImageModal} style={styles.avatarContainer}>
              <View style={styles.avatarGlowRing}>
                <View style={styles.avatarInner}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.uploadedAvatar} />
                  ) : (
                    <Ionicons name="person" size={40} color="#C084FC" />
                  )}
                </View>
              </View>
              <View style={styles.cameraEditBadge}>
                <Ionicons name="camera" size={12} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName}>{userName}</Text>
            
            <View style={styles.emailBox}>
              <Ionicons name="mail-outline" size={14} color="#38BDF8" style={{ marginRight: 6 }} />
              <Text style={styles.emailBoxText}>{userEmail}</Text>
            </View>

            <View style={styles.devTag}>
              <Ionicons name="shield-checkmark" size={13} color="#C084FC" style={{ marginRight: 5 }} />
              <Text style={styles.devTagText}>Verified Enterprise Partner</Text>
            </View>

            <Text style={styles.profileBio}>
              आपका क्लाउड डेटा पूरी तरह सुरक्षित है। अपनी एजेंसी प्रोफाइल और सेटिंग्स को आसानी से प्रबंधित करें।
            </Text>
          </View>

          {/* Real-Time Sync Animated Widget */}
          <View style={styles.animationSectionBox}>
            <Animated.View style={[styles.animOuterGlow, { transform: [{ scale: this.pulseAnim }] }]}>
              <View style={styles.animInnerCard}>
                <Animated.View style={{ transform: [{ rotate: spin }], marginBottom: 10 }}>
                  <MaterialCommunityIcons name="orbit" size={44} color="#38BDF8" />
                </Animated.View>
                <Text style={styles.animTitleText}>Prabhavati Cloud Sync Active</Text>
                <Text style={styles.animSubText}>सिस्टम पूरी तरह से सक्रिय, सुरक्षित और तेज गति से जुड़ा हुआ है।</Text>
              </View>
            </Animated.View>
          </View>

          {/* Modern Professional Quick Hub / Menu Options */}
          <View style={styles.menuSectionTitleContainer}>
            <Text style={styles.menuSectionTitleText}>प्रबंधन और टूल्स (Enterprise Tools)</Text>
          </View>

          <View style={styles.menuGridContainer}>
            <TouchableOpacity 
              style={styles.menuCard} 
              activeOpacity={0.8}
              onPress={() => this.handleUpcomingFeature('एजेंसी एनालिटिक्स (Agency Analytics)')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Ionicons name="stats-chart" size={20} color="#38BDF8" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuCardTitle}>एजेंसी एनालिटिक्स</Text>
                <Text style={styles.menuCardDesc}>परफॉरमेंस और ट्रैफिक रिपोर्ट</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard} 
              activeOpacity={0.8}
              onPress={() => this.handleUpcomingFeature('क्लाउड सिक्योरिटी (Cloud Security)')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Ionicons name="shield-lock" size={20} color="#C084FC" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuCardTitle}>क्लाउड सिक्योरिटी</Text>
                <Text style={styles.menuCardDesc}>पासकी और एडवांस प्रोटेक्शन</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard} 
              activeOpacity={0.8}
              onPress={() => this.handleUpcomingFeature('टीम सहयोग (Team Collaboration)')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                <Ionicons name="people" size={20} color="#34D399" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuCardTitle}>टीम सहयोग</Text>
                <Text style={styles.menuCardDesc}>सहयोगियों और पार्टनर्स को जोड़ें</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard} 
              activeOpacity={0.8}
              onPress={() => this.handleUpcomingFeature('एपिआई इंटीग्रेशन (API Integrations)')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                <Ionicons name="code-slash" size={20} color="#FBBF24" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuCardTitle}>एपिआई इंटीग्रेशन</Text>
                <Text style={styles.menuCardDesc}>कस्टम सॉफ्टवेयर और वेबहुक</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* लॉग आउट बटन */}
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={this.openLogoutModal}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>लॉग आउट (Log Out)</Text>
          </TouchableOpacity>

          {/* Agency Branding Footer */}
          <View style={styles.footerBranding}>
            <Text style={styles.footerBrandText}>Designed & Developed by Prabhavati Agency</Text>
            <Text style={styles.footerSubText}>Excellence in Every Line of Code • Enterprise Edition</Text>
          </View>

        </ScrollView>

        {/* 1. इमेज पिकर मॉडल */}
        <Modal
          transparent={true}
          visible={isImageModalVisible}
          animationType="none"
          onRequestClose={this.closeImageModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContentBox, { opacity: this.modalFade, transform: [{ scale: this.modalScale }] }]}>
              <View style={styles.modalHeaderIndicator} />
              <Text style={styles.modalTitle}>प्रोफाइल फोटो बदलें 📸</Text>
              <Text style={styles.modalSubtitle}>गैलरी से अपनी पसंदीदा तस्वीर चुनें।</Text>

              <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8} onPress={this.pickImageFromGallery}>
                <Ionicons name="images-outline" size={20} color="#030712" style={{ marginRight: 8 }} />
                <Text style={styles.primaryActionText}>गैलरी से फोटो चुनें</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeModalButton} activeOpacity={0.8} onPress={this.closeImageModal}>
                <Text style={styles.closeModalButtonText}>रद्द करें</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* 2. नाम एडिट करने का मॉडल */}
        <Modal
          transparent={true}
          visible={isEditProfileModalVisible}
          animationType="none"
          onRequestClose={this.closeEditProfileModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContentBox, { opacity: this.modalFade, transform: [{ scale: this.modalScale }] }]}>
              <View style={styles.modalHeaderIndicator} />
              <Text style={styles.modalTitle}>नाम बदलें ✏️</Text>
              <Text style={styles.modalSubtitle}>अपना नया नाम हमेशा के लिए दर्ज करें।</Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>पूरा नाम (Name)</Text>
                <TextInput
                  style={styles.textInputStyle}
                  value={tempName}
                  onChangeText={(text) => this.setState({ tempName: text })}
                  placeholder="अपना नाम दर्ज करें"
                  placeholderTextColor="#6B7280"
                />
              </View>

              <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8} onPress={this.saveProfileDetails}>
                <Text style={styles.primaryActionText}>हमेशा के लिए सेव करें</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeModalButton} activeOpacity={0.8} onPress={this.closeEditProfileModal}>
                <Text style={styles.closeModalButtonText}>रद्द करें</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* 3. अपकमिंग फीचर्स मॉडल (अगले वर्जन के लिए शानदार मैसेज) */}
        <Modal
          transparent={true}
          visible={isUpcomingModalVisible}
          animationType="none"
          onRequestClose={this.closeUpcomingModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContentBox, { opacity: this.modalFade, transform: [{ scale: this.modalScale }] }]}>
              <View style={styles.modalHeaderIndicator} />
              <View style={styles.upcomingIconCircle}>
                <Ionicons name="sparkles" size={28} color="#C084FC" />
              </View>
              <Text style={styles.modalTitle}>जल्द आ रहा है! 🚀</Text>
              <Text style={styles.modalHighlightText}>{selectedFeatureTitle}</Text>
              <Text style={styles.modalSubtitleLarge}>
                हमारी डेवलेपमेंट टीम इस प्रीमियम फीचर पर तेजी से काम कर रही है। यह सुविधा आपको ऐप के **अगले नए वर्जन** में देखने को मिलेगी।
              </Text>
              <Text style={styles.modalApologyText}>
                असुविधा के लिए हमें खेद है, और आपके धैर्य व सहयोग के लिए बहुत-बहुत धन्यवाद! 🙏
              </Text>

              <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8} onPress={this.closeUpcomingModal}>
                <Text style={styles.primaryActionText}>ठीक है, समझ गया</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>




      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 35 : 5,
    paddingBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeContainer: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C084FC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.25)',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarGlowRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    overflow: 'hidden',
  },
  avatarInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#38BDF8',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0B0F19',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  emailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  emailBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8',
  },
  devTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.35)',
  },
  devTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C084FC',
  },
  profileBio: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  // एनिमेशन सेक्शन स्टाइल्स
  animationSectionBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  animOuterGlow: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  animInnerCard: {
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  animSubText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // मेन्यू ग्रिड स्टाइल्स
  menuSectionTitleContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuSectionTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  menuGridContainer: {
    marginBottom: 20,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextContent: {
    flex: 1,
  },
  menuCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuCardDesc: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
  footerBranding: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerBrandText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerSubText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContentBox: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  modalHeaderIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#4B5563',
    borderRadius: 2,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '950',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalHighlightText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitleLarge: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  modalApologyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  upcomingIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    marginBottom: 12,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  textInputStyle: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryActionButton: {
    flexDirection: 'row',
    backgroundColor: '#38BDF8',
    width: '100%',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  primaryActionText: {
    color: '#030712',
    fontSize: 15,
    fontWeight: '900',
  },
  closeModalButton: {
    width: '100%',
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  closeModalButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutConfirmButton: {
    backgroundColor: '#EF4444',
    width: '100%',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});