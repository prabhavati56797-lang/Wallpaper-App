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
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// नोटिफिकेशन बर्ताव सेट करें कि ऐप खुला होने पर कैसे दिखे
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default class NotificationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNotification: null,
      modalVisible: false,
      expoPushToken: '',
      notifications: [
        {
          id: '1',
          title: 'Order Delivered',
          message: 'Your order #ORD12345 has been delivered successfully.',
          fullDetails: 'Your package containing items from Order #ORD12345 was safely handed over to you. Thank you for shopping with us!',
          time: '2m ago',
          icon: 'bag-handle-outline',
          iconBg: '#EDE7F6',
          iconColor: '#7C3AED',
          dotColor: '#7C3AED'
        },
        {
          id: '2',
          title: 'Payment Successful',
          message: 'Your payment of ₹1,299 was successful. Thank you!',
          fullDetails: 'Your transaction ID TXN987654321 of amount ₹1,299 has been successfully processed via UPI.',
          time: '15m ago',
          icon: 'checkmark-circle-outline',
          iconBg: '#E8F5E9',
          iconColor: '#2E7D32',
          dotColor: '#2E7D32'
        },
        {
          id: '3',
          title: 'New Message',
          message: 'You have received a new message from John Doe.',
          fullDetails: 'John Doe sent you a direct message regarding your ongoing project collaboration.',
          time: '1h ago',
          icon: 'chatbubbles-outline',
          iconBg: '#E3F2FD',
          iconColor: '#1565C0',
          dotColor: '#1565C0'
        },
        {
          id: '4',
          title: 'Price Alert',
          message: 'The price of "Wireless Headphones" has dropped by 20%.',
          fullDetails: 'The item in your wishlist "Wireless Headphones" is now available at a special discounted price.',
          time: 'Yesterday, 9:30 PM',
          icon: 'notifications-outline',
          iconBg: '#FFF3E0',
          iconColor: '#EF6C00',
          dotColor: '#FB8C00',
          isYesterday: true
        },
        {
          id: '5',
          title: 'Special Offer',
          message: 'Get flat 30% off on all products. Limited time offer!',
          fullDetails: 'Use coupon code FESTIVE30 during checkout to get instant 30% off on your next purchase.',
          time: 'Yesterday, 6:15 PM',
          icon: 'gift-outline',
          iconBg: '#FCE4EC',
          iconColor: '#C2185B',
          dotColor: '#E91E63',
          isYesterday: true
        }
      ]
    };
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync().then(token => {
      if (token) {
        this.setState({ expoPushToken: token });
        console.log("Expo Push Token:", token);
      }
    });

    // जब ऐप खुला हो और नया नोटिफिकेशन आए
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content;
      const newNotif = {
        id: Date.now().toString(),
        title: data.title || 'New Notification',
        message: data.body || 'You have a new alert.',
        fullDetails: data.data?.fullDetails || data.body || 'No extra details available.',
        time: 'Just now',
        icon: 'notifications-outline',
        iconBg: '#EDE7F6',
        iconColor: '#7C3AED',
        dotColor: '#7C3AED',
        isYesterday: false
      };

      this.setState(prevState => ({
        notifications: [newNotif, ...prevState.notifications]
      }));
    });

    // जब यूजर नोटिफिकेशन पर क्लिक करे
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content;
      const clickedNotif = {
        id: 'clicked',
        title: data.title || 'Notification',
        message: data.body || '',
        fullDetails: data.data?.fullDetails || data.body || 'No details.',
        time: 'Just now',
        icon: 'notifications-outline',
        iconBg: '#EDE7F6',
        iconColor: '#7C3AED'
      };
      this.handleNotificationPress(clickedNotif);
    });
  }

  componentWillUnmount() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  // Push Token लेने का फंक्शन
  registerForPushNotificationsAsync = async () => {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  handleNotificationPress = (item) => {
    this.setState({
      selectedNotification: item,
      modalVisible: true
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedNotification: null
    });
  };

  render() {
    const todayItems = this.state.notifications.filter(item => !item.isYesterday);
    const yesterdayItems = this.state.notifications.filter(item => item.isYesterday);
    const { selectedNotification, modalVisible } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Today Section */}
          {todayItems.length > 0 && <Text style={styles.sectionLabel}>Today</Text>}
          
          {todayItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.8}
              onPress={() => this.handleNotificationPress(item)}
              style={styles.timelineRow}
            >
              <View style={styles.timelineIndicatorCol}>
                <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
                {index !== todayItems.length - 1 && <View style={styles.verticalLine} />}
              </View>

              <View style={styles.notificationCard}>
                <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={22} color={item.iconColor} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Yesterday Section */}
          {yesterdayItems.length > 0 && <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Yesterday & Older</Text>}

          {yesterdayItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.8}
              onPress={() => this.handleNotificationPress(item)}
              style={styles.timelineRow}
            >
              <View style={styles.timelineIndicatorCol}>
                <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
                {index !== yesterdayItems.length - 1 && <View style={styles.verticalLine} />}
              </View>

              <View style={styles.notificationCard}>
                <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={22} color={item.iconColor} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Footer */}
          <View style={styles.footerContainer}>
            <View style={styles.dotsRow}>
              <View style={[styles.footerDot, { backgroundColor: '#7C3AED' }]} />
              <View style={[styles.footerDot, { backgroundColor: '#7C3AED', opacity: 0.7 }]} />
              <View style={[styles.footerDot, { backgroundColor: '#7C3AED', opacity: 0.4 }]} />
            </View>
            <Text style={styles.footerTitle}>You’re all caught up!</Text>
            <Text style={styles.footerSubText}>We’ll notify you when something new arrives.</Text>
          </View>

        </ScrollView>

        {/* Detail Popup Modal (जिसमें पूरा मैसेज और डिबेट दिखेगा) */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedNotification && (
                <>
                  <View style={styles.modalHeaderRow}>
                    <View style={[styles.modalIconBox, { backgroundColor: selectedNotification.iconBg }]}>
                      <Ionicons name={selectedNotification.icon} size={24} color={selectedNotification.iconColor} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                      <Text style={styles.modalTime}>{selectedNotification.time}</Text>
                    </View>
                    <TouchableOpacity onPress={this.closeModal} style={styles.closeBtn}>
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.modalBodyLabel}>Message Summary:</Text>
                  <Text style={styles.modalMessageText}>{selectedNotification.message}</Text>

                  <Text style={[styles.modalBodyLabel, { marginTop: 14 }]}>Complete Details:</Text>
                  <Text style={styles.modalFullDetailsText}>{selectedNotification.fullDetails}</Text>

                  <TouchableOpacity style={styles.actionButton} onPress={this.closeModal}>
                    <Text style={styles.actionButtonText}>Got it, Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 35 : 10,
    paddingBottom: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 16,
    marginLeft: 22,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIndicatorCol: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 24,
    zIndex: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    position: 'absolute',
    top: 34,
    bottom: -16,
  },
  notificationCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  cardTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  cardMessage: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  modalBodyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalMessageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 20,
  },
  modalFullDetailsText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});