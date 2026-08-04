import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default class NotificationListenerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotificationPopup: false,
      notificationTitle: 'महत्वपूर्ण अपडेट',
      notificationBody: 'यहाँ आपका नोटिफिकेशन मैसेज दिखाई देगा...',
      
      // नया 3D स्लाइड और फेड एनिमेशन
      popupSlideAnim: new Animated.Value(300),
      popupOpacityAnim: new Animated.Value(0)
    };
    
    this.notificationListener = null;
    this.responseListener = null;
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      const title = notification.request.content.title || 'विशेष सूचना';
      const body = notification.request.content.body || 'नया संदेश प्राप्त हुआ है।';
      this.triggerAnimatedPopup(title, body);
    });

    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const title = response.notification.request.content.title || 'विशेष सूचना';
      const body = response.notification.request.content.body || 'नया संदेश प्राप्त हुआ है।';
      this.triggerAnimatedPopup(title, body);
    });
  }

  componentWillUnmount() {
    if (this.notificationListener) this.notificationListener.remove();
    if (this.responseListener) this.responseListener.remove();
  }

  registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;
    }
  };

  // नया बॉटम-शीट / कार्ड 3D पॉप-अप एनिमेशन
  triggerAnimatedPopup = (title, body) => {
    this.setState({
      notificationTitle: title,
      notificationBody: body,
      showNotificationPopup: true
    });

    this.state.popupSlideAnim.setValue(250);
    this.state.popupOpacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(this.state.popupSlideAnim, {
        toValue: 0,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.popupOpacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();
  };

  closeAnimatedPopup = () => {
    Animated.timing(this.state.popupOpacityAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ showNotificationPopup: false });
    });
  };

  render() {
    const { showNotificationPopup, notificationTitle, notificationBody, popupSlideAnim, popupOpacityAnim } = this.state;

    return (
      <View style={styles.mainWrapper}>
        <StatusBar barStyle="light-content" backgroundColor="#030712" />
        
        <SafeAreaView style={{ flex: 1 }}>
          
          {/* प्रीमियम कस्टम हेडर (यहाँ तीर वाले आइकॉन पर क्लिक करने से होम पेज पर जाएगा) */}
          <View style={styles.topHeader}>
            <TouchableOpacity 
              style={styles.backButton} 
              activeOpacity={0.7}
              onPress={() => {
                // यदि आप React Navigation का उपयोग कर रहे हैं:
                if (this.props.navigation && this.props.navigation.navigate) {
                  this.props.navigation.navigate('Home');
                } else {
                  console.log('Home navigation triggered');
                }
              }}
            >
              <Feather name="arrow-left" size={22} color="#F9FAFB" />
            </TouchableOpacity>
            <Text style={styles.topHeaderTitle}>Notifications</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            
            {/* Today सेक्शन हेडिंग */}
            <Text style={styles.sectionHeading}>Today</Text>

            {/* Timeline Wrapper */}
            <View style={styles.timelineContainer}>
              <View style={styles.verticalLine} />

              {/* कार्ड 1: Order Delivered */}
              <View style={styles.notificationRow}>
                <View style={[styles.timelineDot, { backgroundColor: '#A855F7' }]} />
                <TouchableOpacity 
                  style={styles.notifCard} 
                  activeOpacity={0.8}
                  onPress={() => this.triggerAnimatedPopup('Order Delivered', 'Your order #ORD12345 has been delivered successfully.')}
                >
                  <View style={[styles.cardIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                    <MaterialCommunityIcons name="shopping-outline" size={22} color="#C084FC" />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle}>Order Delivered</Text>
                      <Text style={styles.cardTime}>2m ago</Text>
                    </View>
                    <Text style={styles.cardDesc}>Your order #ORD12345 has been delivered successfully.</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* कार्ड 2: Payment Successful */}
              <View style={styles.notificationRow}>
                <View style={[styles.timelineDot, { backgroundColor: '#22C55E' }]} />
                <TouchableOpacity 
                  style={styles.notifCard} 
                  activeOpacity={0.8}
                  onPress={() => this.triggerAnimatedPopup('Payment Successful', 'Your payment of ₹1,299 was successful. Thank you!')}
                >
                  <View style={[styles.cardIconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <Feather name="check-circle" size={20} color="#4ADE80" />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle}>Payment Successful</Text>
                      <Text style={styles.cardTime}>15m ago</Text>
                    </View>
                    <Text style={styles.cardDesc}>Your payment of ₹1,299 was successful. Thank you!</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* कार्ड 3: New Message */}
              <View style={styles.notificationRow}>
                <View style={[styles.timelineDot, { backgroundColor: '#38BDF8' }]} />
                <TouchableOpacity 
                  style={styles.notifCard} 
                  activeOpacity={0.8}
                  onPress={() => this.triggerAnimatedPopup('New Message', 'You have received a new message from John Doe.')}
                >
                  <View style={[styles.cardIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                    <Feather name="message-square" size={20} color="#38BDF8" />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle}>New Message</Text>
                      <Text style={styles.cardTime}>1h ago</Text>
                    </View>
                    <Text style={styles.cardDesc}>You have received a new message from John Doe.</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>

            {/* Yesterday & Older सेक्शन */}
            <Text style={[styles.sectionHeading, { marginTop: 25 }]}>Yesterday & Older</Text>

            <View style={styles.timelineContainer}>
              <View style={[styles.verticalLine, { height: '80%' }]} />

              {/* कार्ड 4: Price Alert */}
              <View style={styles.notificationRow}>
                <View style={[styles.timelineDot, { backgroundColor: '#FB923C' }]} />
                <TouchableOpacity 
                  style={styles.notifCard} 
                  activeOpacity={0.8}
                  onPress={() => this.triggerAnimatedPopup('Price Alert', 'The price of "Wireless Headphones" has dropped by 20%.')}
                >
                  <View style={[styles.cardIconBox, { backgroundColor: 'rgba(251, 146, 60, 0.15)' }]}>
                    <Feather name="bell" size={20} color="#FB923C" />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle}>Price Alert</Text>
                      <Text style={styles.cardTime}>Yesterday, 9:30 PM</Text>
                    </View>
                    <Text style={styles.cardDesc}>The price of "Wireless Headphones" has dropped by 20%.</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* कार्ड 5: Special Offer */}
              <View style={styles.notificationRow}>
                <View style={[styles.timelineDot, { backgroundColor: '#EC4899' }]} />
                <TouchableOpacity 
                  style={styles.notifCard} 
                  activeOpacity={0.8}
                  onPress={() => this.triggerAnimatedPopup('Special Offer', 'Get flat 30% off on all products. Limited time offer!')}
                >
                  <View style={[styles.cardIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                    <Feather name="gift" size={20} color="#F472B6" />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle}>Special Offer</Text>
                      <Text style={styles.cardTime}>Yesterday, 6:15 PM</Text>
                    </View>
                    <Text style={styles.cardDesc}>Get flat 30% off on all products. Limited time offer!</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>

            {/* फुटर मैसेज */}
            <View style={styles.footerCatchUp}>
              <View style={styles.dotRow}>
                <View style={[styles.miniDot, { backgroundColor: '#A855F7' }]} />
                <View style={[styles.miniDot, { backgroundColor: '#22C55E' }]} />
                <View style={[styles.miniDot, { backgroundColor: '#38BDF8' }]} />
              </View>
              <Text style={styles.catchUpTitle}>You’re all caught up!</Text>
              <Text style={styles.catchUpSub}>We’ll notify you when something new arrives.</Text>
            </View>

          </ScrollView>
        </SafeAreaView>

        {/* ================= 3D प्रीमियम पॉप-अप डिज़ाइन ================= */}
        <Modal
          visible={showNotificationPopup}
          transparent={true}
          animationType="none"
          onRequestClose={this.closeAnimatedPopup}
        >
          <View style={styles.modalOverlay}>
            
            <Animated.View 
              style={[
                styles.newPopupCard, 
                { 
                  opacity: popupOpacityAnim,
                  transform: [{ translateY: popupSlideAnim }] 
                }
              ]}
            >
              {/* डेकोरेटिव टॉप ग्रैब बार */}
              <View style={styles.grabBar} />

              {/* हेडर रो: आइकॉन और क्लोज बटन */}
              <View style={styles.popupTopRow}>
                <View style={styles.popupBadgeIcon}>
                  <MaterialCommunityIcons name="bell-badge-outline" size={24} color="#38BDF8" />
                </View>
                
                <TouchableOpacity 
                  style={styles.closeIconButton}
                  onPress={this.closeAnimatedPopup}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* नोटिफिकेशन टाइटल */}
              <Text style={styles.newPopupTitle}>{notificationTitle}</Text>

              {/* मैसेज बॉडी कार्ड */}
              <View style={styles.newMessageContainer}>
                <Text style={styles.newPopupBody}>{notificationBody}</Text>
              </View>

              {/* शानदार ओके / डन बटन */}
              <TouchableOpacity 
                style={styles.newAwesomeButton}
                onPress={this.closeAnimatedPopup}
                activeOpacity={0.85}
              >
                <Text style={styles.newAwesomeButtonText}>ठीक है (Got it)</Text>
                <Ionicons name="checkmark-circle-outline" size={18} color="#030712" style={{ marginLeft: 8 }} />
              </TouchableOpacity>

              {/* बॉटम ब्रांडिंग */}
              <View style={styles.newBrandTag}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.newBrandText}>Prabhavati Agency Live Alert</Text>
              </View>

            </Animated.View>

          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#030712' },
  
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 35, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  topHeaderTitle: { color: '#F9FAFB', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },

  container: { padding: 20, paddingBottom: 40 },
  
  sectionHeading: { color: '#9CA3AF', fontSize: 14, fontWeight: '700', marginBottom: 14, marginLeft: 24, letterSpacing: 0.5 },

  timelineContainer: { position: 'relative', paddingLeft: 18 },
  verticalLine: { position: 'absolute', left: 23, top: 10, bottom: 10, width: 2, backgroundColor: 'rgba(255, 255, 255, 0.08)' },

  notificationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, position: 'relative' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, position: 'absolute', left: -1, zIndex: 2, borderWidth: 2, borderColor: '#030712' },

  notifCard: { flex: 1, marginLeft: 16, backgroundColor: '#0B0F19', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  cardIconBox: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardContent: { flex: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '700' },
  cardTime: { color: '#6B7280', fontSize: 11, fontWeight: '500' },
  cardDesc: { color: '#9CA3AF', fontSize: 13, lineHeight: 18 },

  footerCatchUp: { alignItems: 'center', marginTop: 30, paddingVertical: 10 },
  dotRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  miniDot: { width: 6, height: 6, borderRadius: 3 },
  catchUpTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  catchUpSub: { color: '#6B7280', fontSize: 12 },

  // ================= 3D पॉप-अप डिज़ाइन स्टाइल्स =================
  modalOverlay: { flex: 1, backgroundColor: 'rgba(3, 7, 18, 0.88)', justifyContent: 'flex-end', alignItems: 'center' },
  
  newPopupCard: { width: '100%', backgroundColor: '#0B0F19', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 36, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 25 },
  
  grabBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginBottom: 16 },

  popupTopRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  
  popupBadgeIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(56, 189, 248, 0.12)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)' },
  
  closeIconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  
  newPopupTitle: { color: '#F9FAFB', fontSize: 22, fontWeight: '900', textAlign: 'left', width: '100%', marginBottom: 12, letterSpacing: 0.5 },
  
  newMessageContainer: { backgroundColor: '#111827', borderRadius: 18, padding: 18, width: '100%', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' },
  newPopupBody: { color: '#D1D5DB', fontSize: 15, lineHeight: 24, textAlign: 'left' },

  newAwesomeButton: { backgroundColor: '#38BDF8', height: 52, borderRadius: 16, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  newAwesomeButtonText: { color: '#030712', fontSize: 16, fontWeight: '900' },

  newBrandTag: { flexDirection: 'row', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.06)', width: '100%', justifyContent: 'center' },
  greenPulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34D399', marginRight: 6 },
  newBrandText: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }
});