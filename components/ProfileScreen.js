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
  Animated
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // गैलरी से फोटो चुनने के लिए

const { width, height } = Dimensions.get('window');

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    // नेविगेशन या पैरामीटर से यूज़र का नाम और ईमेल प्राप्त करें, यदि न हो तो डिफ़ॉल्ट वैल्यू लें
    const routeParams = props.route && props.route.params ? props.route.params : {};
    
    this.state = {
      userName: routeParams.userName || 'PRABHAWATI USER',
      userEmail: routeParams.userEmail || 'user@prabhavatiagency.com',
      profileImage: routeParams.profileImage || null,
      isModalVisible: false, // 3D गैलरी पॉप-अप कंट्रोल करने के लिए
    };

    // 3D पॉप-अप और स्क्रीन एनिमेशन वैल्यूज
    this.modalScale = new Animated.Value(0);
    this.modalFade = new Animated.Value(0);
  }

  // गैलरी से फोटो चुनने का फंक्शन
  pickImageFromGallery = async () => {
    // परमिशन मांगें
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
      this.setState({ profileImage: result.assets[0].uri });
      this.closeImageModal();
    }
  };

  // 3D पॉप-अप खोलने का फंक्शन
  openImageModal = () => {
    this.setState({ isModalVisible: true });
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

  // 3D पॉप-अप बंद करने का फंक्शन
  closeImageModal = () => {
    Animated.parallel([
      Animated.timing(this.modalScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(this.modalFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      this.setState({ isModalVisible: false });
    });
  };

  handleFeatureAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: "बढ़िया, इंतज़ार रहेगा! 👍", style: "default" }]
    );
  };

  render() {
    const { userName, userEmail, profileImage, isModalVisible } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerBadgeContainer}>
            <Text style={styles.headerBadgeText}>⭐ Live User Profile</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Profile Card Banner */}
          <View style={styles.profileCard}>
            
            {/* यूजर का फोटो आइकॉन - क्लिक करने पर 3D पॉप-अप खुलेगा */}
            <TouchableOpacity activeOpacity={0.9} onPress={this.openImageModal} style={styles.avatarContainer}>
              <View style={styles.avatarGlowRing}>
                <View style={styles.avatarInner}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.uploadedAvatar} />
                  ) : (
                    <Ionicons name="person" size={38} color="#C084FC" />
                  )}
                </View>
              </View>
              <View style={styles.cameraEditBadge}>
                <Ionicons name="camera" size={12} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* लॉगिन किए गए यूजर का नाम और ईमेल डायनामिक रूप से दिखेगा */}
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
            
            <View style={styles.devTag}>
              <Ionicons name="sparkles" size={12} color="#C084FC" style={{ marginRight: 4 }} />
              <Text style={styles.devTagText}>Verified Active Member</Text>
            </View>

            <Text style={styles.profileBio}>
              आपके अकाउंट का सारा डेटा सुरक्षित रूप से सिंक कर दिया गया है। अपनी प्रोफाइल पिक्चर बदलने के लिए ऊपर फोटो पर टैप करें।
            </Text>
          </View>

          {/* Professional Development Status Box */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeaderRow}>
              <View style={styles.statusIconWrap}>
                <MaterialCommunityIcons name="code-progress-check" size={22} color="#34D399" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.statusTitle}>क्लाउड सिंक: एक्टिव 🚀</Text>
                <Text style={styles.statusSub}>डेटा पूरी तरह सुरक्षित है</Text>
              </View>
            </View>
            <Text style={styles.statusDesc}>
              आपका सेशन सफलतापूर्वक स्थापित हो चुका है। नीचे दिए गए एक्सक्लूसिव फीचर्स जल्द ही आपके ऐप में पूरी तरह लाइव हो जाएंगे।
            </Text>
            
            <View style={styles.progressBarBg}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Upcoming Features Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>आने वाले एक्सक्लूसिव फीचर्स</Text>
            <Text style={styles.sectionSubTitle}>प्री-व्यू</Text>
          </View>

          <TouchableOpacity 
            style={styles.featureItem} 
            activeOpacity={0.85}
            onPress={() => this.handleFeatureAlert("क्लाउड अकाउंट सिंक", "इसके ज़रिए आपका सारा डेटा और सेटिंग्स क्लाउड पर सुरक्षित रहेंगी।")}
          >
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="cloud-sync" size={20} color="#60A5FA" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.featureTitle}>क्लाउड अकाउंट सिंक</Text>
              <Text style={styles.featureDesc}>ऑटो-बैकअप और मल्टी-डिवाइस सपोर्ट</Text>
            </View>
            <View style={styles.soonPill}>
              <Text style={styles.soonPillText}>जल्द लाइव</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureItem} 
            activeOpacity={0.85}
            onPress={() => this.handleFeatureAlert("कस्टम थीम और लुक", "आप अपनी पसंद के अनुसार ऐप के कलर्स और डिजाइन बदल सकेंगे।")}
          >
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="color-palette" size={20} color="#FBBF24" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.featureTitle}>कस्टम थीम कस्टमाइजेशन</Text>
              <Text style={styles.featureDesc}>मॉडर्न डार्क और लाइट मोड सेटिंग्स</Text>
            </View>
            <View style={styles.soonPill}>
              <Text style={styles.soonPillText}>जल्द लाइव</Text>
            </View>
          </TouchableOpacity>

          {/* Agency Branding Footer */}
          <View style={styles.footerBranding}>
            <Text style={styles.footerBrandText}>Designed & Developed by Prabhavati Agency</Text>
            <Text style={styles.footerSubText}>Excellence in Every Line of Code</Text>
          </View>

        </ScrollView>

        {/* 3D Animated Image Picker Modal / Pop-up */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="none"
          onRequestClose={this.closeImageModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContentBox, { opacity: this.modalFade, transform: [{ scale: this.modalScale }] }]}>
              
              <View style={styles.modalHeaderIndicator} />
              
              <Text style={styles.modalTitle}>प्रोफाइल फोटो बदलें 📸</Text>
              <Text style={styles.modalSubtitle}>अपनी गैलरी से एक बेहतरीन तस्वीर चुनें जो आपके प्रोफाइल पर दिखेगी।</Text>

              <TouchableOpacity 
                style={styles.galleryButton} 
                activeOpacity={0.8}
                onPress={this.pickImageFromGallery}
              >
                <Ionicons name="images-outline" size={20} color="#030712" style={{ marginRight: 8 }} />
                <Text style={styles.galleryButtonText}>गैलरी से फोटो चुनें</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.closeModalButton} 
                activeOpacity={0.8}
                onPress={this.closeImageModal}
              >
                <Text style={styles.closeModalButtonText}>रद्द करें (Cancel)</Text>
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
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.25)',
    marginTop: 10,
    marginBottom: 16,
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
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    overflow: 'hidden',
  },
  avatarInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
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
  },
  profileEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8',
    marginTop: 4,
    marginBottom: 10,
    textAlign: 'center',
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
  statusCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#34D399',
  },
  statusSub: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 1,
    fontWeight: '600',
  },
  statusDesc: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 14,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionSubTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  featureItem: {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  featureDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  soonPill: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  soonPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
  },
  footerBranding: {
    alignItems: 'center',
    marginTop: 15,
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
  // 3D Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.8)',
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
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
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
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  galleryButton: {
    flexDirection: 'row',
    backgroundColor: '#38BDF8',
    width: '100%',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  galleryButtonText: {
    color: '#030712',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeModalButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeModalButtonText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '700',
  }
});