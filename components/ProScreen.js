import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default class ProScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlan: '12', // डिफ़ॉल्ट 12 महीने चुना हुआ
    };
  }

  handleSubscribe = () => {
    Alert.Formatter || Alert.alert(
      "🚀 प्रो वर्जन पर काम जारी है!",
      "हमारे पेमेंट गेटवे और प्रो फीचर्स पर अभी काम चल रहा है। तब तक आप कल तक सभी प्रीमियम फीचर्स और प्लान्स बिल्कुल फ्री में आनंद ले सकते हैं!",
      [{ text: "ठीक है, समझ गए" }]
    );
  };

  render() {
    const { selectedPlan } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Title & Banner Section */}
          <View style={styles.topBanner}>
            <View style={styles.crownContainer}>
              <Ionicons name="ribbon" size={32} color="#FBBF24" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <View style={styles.proRow}>
                <Text style={styles.proTitle}>Pro बनें</Text>
                <View style={styles.badgeBox}>
                  <Text style={styles.badgeText}>✨ कमिंग सून</Text>
                </View>
              </View>
              <Text style={styles.proSubTitle}>सभी प्रीमियम सुविधाओं का आनंद लें</Text>
            </View>
          </View>

          {/* Special Notice Card (जो आपने माँगा था - भरोसा और फ्री प्लान के लिए) */}
          <View style={styles.noticeCard}>
            <MaterialCommunityIcons name="shield-check" size={22} color="#34D399" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>कल तक सभी प्लान्स बिल्कुल फ्री!</Text>
              <Text style={styles.noticeText}>
                सिस्टम अपडेट और अपग्रेड का काम तेजी से चल रहा है। लोगों के भरोसे और बेहतर अनुभव के लिए, आप कल तक सभी प्रो फीचर्स और प्लान्स **बिलकुल मुफ्त** यूज़ कर सकते हैं।
              </Text>
            </View>
          </View>

          {/* Pro Plan Benefits */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsHeader}>✨ Pro Plan के फायदे</Text>
            
            <View style={styles.benefitRow}>
              <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(124, 58, 237, 0.2)' }]}>
                <Ionicons name="infinite" size={18} color="#A78BFA" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.benefitTitle}>अनलिमिटेड एक्सेस</Text>
                <Text style={styles.benefitDesc}>सभी प्रीमियम कंटेंट को अनलिमिटेड एक्सेस करें</Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Ionicons name="cloud-download-outline" size={18} color="#60A5FA" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.benefitTitle}>हाई क्वालिटी डाउनलोड</Text>
                <Text style={styles.benefitDesc}>हाई-रेोल्यूशन में बिना रुकावट डाउनलोड करें</Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="ban-outline" size={18} color="#34D399" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.benefitTitle}>कोई विज्ञापन नहीं</Text>
                <Text style={styles.benefitDesc}>बिना किसी विज्ञापन के स्मूथ एक्सपीरियंस</Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Ionicons name="headset-outline" size={18} color="#FBBF24" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.benefitTitle}>प्राथमिकता सपोर्ट</Text>
                <Text style={styles.benefitDesc}>24/7 हमारी टीम आपकी मदद के लिए तैयार</Text>
              </View>
            </View>
          </View>

          {/* Select Plan Heading */}
          <View style={styles.planHeaderRow}>
            <Text style={styles.sectionHeading}>अपना प्लान चुनें</Text>
            <View style={styles.freeTrialBadge}>
              <Text style={styles.freeTrialText}>कल तक सभी फ्री</Text>
            </View>
          </View>

          {/* Plan 1: 12 Months */}
          <TouchableOpacity 
            activeOpacity={0.9}
            style={[styles.planCard, selectedPlan === '12' && styles.selectedPlanCard]}
            onPress={() => this.setState({ selectedPlan: '12' })}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioOuter}>
                {selectedPlan === '12' && <View style={styles.radioInner} />}
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.planTitle}>12 महीने का प्लान</Text>
                <Text style={styles.planSub}>सबसे अच्छा मूल्य (Best Value)</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.tagBubble}>
                  <Text style={styles.tagBubbleText}>सबसे लोकप्रिय</Text>
                </View>
                <Text style={styles.planPrice}>₹499 <Text style={styles.planDuration}>/ वर्ष</Text></Text>
                <Text style={styles.planOldPrice}>₹999  <Text style={styles.saveText}>50% की बचत</Text></Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Plan 2: 3 Months */}
          <TouchableOpacity 
            activeOpacity={0.9}
            style={[styles.planCard, selectedPlan === '3' && styles.selectedPlanCard]}
            onPress={() => this.setState({ selectedPlan: '3' })}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioOuter}>
                {selectedPlan === '3' && <View style={styles.radioInner} />}
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.planTitle}>3 महीने का प्लान</Text>
                <Text style={styles.planSub}>बेहतरीन अनुभव</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPrice}>₹199 <Text style={styles.planDuration}>/ 3 माह</Text></Text>
                <Text style={styles.planOldPrice}>₹299  <Text style={styles.saveText}>33% की बचत</Text></Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Plan 3: 1 Month */}
          <TouchableOpacity 
            activeOpacity={0.9}
            style={[styles.planCard, selectedPlan === '1' && styles.selectedPlanCard]}
            onPress={() => this.setState({ selectedPlan: '1' })}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioOuter}>
                {selectedPlan === '1' && <View style={styles.radioInner} />}
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.planTitle}>1 महीने का प्लान</Text>
                <Text style={styles.planSub}>लचीला और आसान</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPrice}>₹79 <Text style={styles.planDuration}>/ माह</Text></Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Trust Badges Footer */}
          <View style={styles.trustBox}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={18} color="#60A5FA" />
              <Text style={styles.trustText}>सिक्योर पेमेंट</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="lock-closed" size={18} color="#FBBF24" />
              <Text style={styles.trustText}>सुरक्षित डेटा</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="checkmark-circle" size={18} color="#34D399" />
              <Text style={styles.trustText}>भरोसेमंद ऐप</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.proButton} activeOpacity={0.85} onPress={this.handleSubscribe}>
            <Ionicons name="ribbon" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.proButtonText}>प्रो प्लान शुरू करें (अभी फ्री)</Text>
          </TouchableOpacity>

          {/* Login / Member Link */}
          <TouchableOpacity style={styles.loginRow} onPress={() => Alert.alert("लॉगिन", "आप पहले से ही लॉग इन हैं।")}>
            <Text style={styles.loginGrayText}>पहले से सदस्य हैं? </Text>
            <Text style={styles.loginBlueText}>लॉगिन करें</Text>
          </TouchableOpacity>

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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 35 : 5,
    paddingBottom: 5,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  crownContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  badgeBox: {
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.5)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C084FC',
  },
  proSubTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  noticeCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34D399',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 18,
  },
  benefitsCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 24,
  },
  benefitsHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  benefitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  benefitDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  freeTrialBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.150)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  freeTrialText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FBBF24',
  },
  planCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectedPlanCard: {
    borderColor: '#7C3AED',
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C3AED',
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  planDuration: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  planOldPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
    textDecorationLine: 'none',
  },
  tagBubble: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  tagBubbleText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trustBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    borderRadius: 14,
    padding: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D1D5DB',
    marginLeft: 6,
  },
  proButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  proButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginGrayText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  loginBlueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#818CF8',
  },
});