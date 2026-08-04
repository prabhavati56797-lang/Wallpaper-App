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
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFeatureAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: "बढ़िया, इंतज़ार रहेगा! 👍", style: "default" }]
    );
  };

  render() {
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
            <Text style={styles.headerBadgeText}>⭐ Creator Profile</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Profile Card Banner */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarGlowRing}>
                <View style={styles.avatarInner}>
                  <Ionicons name="person" size={38} color="#C084FC" />
                </View>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.profileName}>PRABHAWATI-P</Text>
            <Text style={styles.profileRole}>Lead Agency & App Developer</Text>
            
            <View style={styles.devTag}>
              <Ionicons name="sparkles" size={12} color="#C084FC" style={{ marginRight: 4 }} />
              <Text style={styles.devTagText}>Prabhavati Agency Creator</Text>
            </View>

            <Text style={styles.profileBio}>
              हाई-एंड मोबाइल ऐप्स, कस्टम सॉफ्टवेयर, UI/UX डिज़ाइन और आधुनिक डिजिटल प्रोडक्ट्स तैयार करने में विशेषज्ञ।
            </Text>
          </View>

          {/* Professional Development Status Box (जैसा आपने कहा - 50% काम पूरा और 3-4 हफ्ते में लाइव) */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeaderRow}>
              <View style={styles.statusIconWrap}>
                <MaterialCommunityIcons name="code-progress-check" size={22} color="#34D399" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.statusTitle}>डेवलपमेंट प्रोग्रेस: 50% पूर्ण 🚀</Text>
                <Text style={styles.statusSub}>अगले 3 से 4 हफ्तों में लाइव</Text>
              </View>
            </View>
            <Text style={styles.statusDesc}>
              भाई, इस एडवांस्ड प्रोफाइल और क्लाउड सिंक मॉड्यूल पर काम बहुत तेजी से चल रहा है। आधे से ज्यादा कोडिंग पूरी हो चुकी है। अगले 3-4 हफ्तों में यह पूरी तरह शानदार फीचर्स के साथ आपके सामने लाइव होगा!
            </Text>
            
            {/* Progress Bar UI */}
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
            onPress={() => this.handleFeatureAlert("क्लाउड अकाउंट सिंक", "इसके ज़रिए आपका सारा डेटा और सेटिंग्स क्लाउड पर सुरक्षित रहेंगी। 3-4 हफ्तों में आ रहा है!")}
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

          <TouchableOpacity 
            style={styles.featureItem} 
            activeOpacity={0.85}
            onProgress={() => {}}
            onPress={() => this.handleFeatureAlert("प्राइवेसी और सिक्योरिटी लॉक", "बायोमेट्रिक फिंगरप्रिंट और पिन लॉक के साथ पूरी सुरक्षा।")}
          >
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="lock-closed" size={20} color="#34D399" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.featureTitle}>सिक्योरिटी और लॉक</Text>
              <Text style={styles.featureDesc}>पिन और बायोमेट्रिक सुरक्षा कवच</Text>
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
    paddingTop: Platform.OS === 'android' ? 35: 5,
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
  },
  avatarInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#3B82F6',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0B0F19',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  profileRole: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C084FC',
    marginTop: 2,
    marginBottom: 10,
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
    width: '50%', // 50% complete
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
});