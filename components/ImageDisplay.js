import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Modal
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

// Android पर LayoutAnimation इनेबल करने के लिए
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32 - 10) / 2;

export default class ImageDisplay extends Component {
  constructor(props) {
    super(props);
    const query = props.route?.params?.query || 'सभी';
    this.state = {
      searchText: query,
      activeTab: 'सभी',
      isLoading: true,
      isConnected: true,
      images: [],
      downloadingIds: {},
      isFilterModalVisible: false // कस्टम पॉपअप के लिए स्टेट
    };
  }

  componentDidMount() {
    this.checkInternetAndLoadData('सभी');
  }

  // इंटरनेट चेक करके डेटा लोड करने का फंक्शन
  checkInternetAndLoadData = (category) => {
    this.setState({ isLoading: true });
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setTimeout(() => {
          this.loadImagesByCategory(category);
          this.setState({ isConnected: true, isLoading: false });
        }, 400);
      } else {
        this.setState({ isConnected: false, isLoading: false });
      }
    });
  };

  // कैटेगरी के अनुसार इमेजेस और उनके सही आस्पेक्ट रेश्यो
  loadImagesByCategory = (category) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let fetchedImages = [];

    if (category === 'सभी') {  
      fetchedImages = [  
        { id: 'img-1', uri: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.6 },  
        { id: 'img-2', uri: 'https://images.pexels.com/photos/7887851/pexels-photo-7887851.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.8 },  
        { id: 'img-3', uri: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.3 },  
        { id: 'img-4', uri: 'https://images.pexels.com/photos/7594467/pexels-photo-7594467.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.4 },  
        { id: 'img-5', uri: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.5 },  
        { id: 'img-6', uri: 'https://images.pexels.com/photos/3761508/pexels-photo-3761508.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.0 },  
      ];  
    } else if (category === 'जीवन') {  
      fetchedImages = [  
        { id: 'life-1', uri: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.4 },  
        { id: 'life-2', uri: 'https://images.pexels.com/photos/7594467/pexels-photo-7594467.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.6 },  
      ];  
    } else if (category === 'पिता') {  
      fetchedImages = [  
        { id: 'dad-1', uri: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.5 },  
        { id: 'dad-2', uri: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.3 },  
      ];  
    } else if (category === 'प्रेरणा') {  
      fetchedImages = [  
        { id: 'mot-1', uri: 'https://images.pexels.com/photos/3761515/pexels-photo-3761515.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.2 },  
      ];  
    } else if (category === 'भक्ति') {  
      fetchedImages = [  
        { id: 'bhakti-1', uri: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.5 },  
      ];  
    } else if (category === 'दोस्ती') {  
      fetchedImages = [  
        { id: 'friend-1', uri: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.6 },  
      ];  
    }  

    this.setState({ images: fetchedImages });
  };

  handleTabChange = (tabName) => {
    this.setState({ activeTab: tabName });
    this.checkInternetAndLoadData(tabName);
  };

  // गैलरी में इमेज डाउनलोड करने का प्रोफेशनल लॉजिक
  handleDownload = async (item) => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Alert.alert("Network Error", "No internet connection. Cannot download image.");
      return;
    }

    this.setState(prevState => ({
      downloadingIds: { ...prevState.downloadingIds, [item.id]: true }
    }));

    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow storage permissions to save images to your gallery.");
        this.setState(prevState => ({
          downloadingIds: { ...prevState.downloadingIds, [item.id]: false }
        }));
        return;
      }

      const filename = `${item.id}_${Date.now()}.jpg`;
      const fileUri = FileSystem.documentDirectory + filename;

      const downloadRes = await FileSystem.downloadAsync(item.uri, fileUri);
      
      if (downloadRes.status === 200) {
        const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
        await MediaLibrary.createAlbumAsync("SuvicharApp", asset, false);
        Alert.alert("Success", "Image successfully downloaded and saved to your Gallery!");
      } else {
        Alert.alert("Error", "Failed to download the image. Please try again.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong during download.");
    } finally {
      this.setState(prevState => ({
        downloadingIds: { ...prevState.downloadingIds, [item.id]: false }
      }));
    }
  };

  render() {
    const leftColumn = [];
    const rightColumn = [];
    let leftHeight = 0;
    let rightHeight = 0;

    this.state.images.forEach((img) => {
      const cardHeight = COLUMN_WIDTH * img.aspectRatio;
      if (leftHeight <= rightHeight) {
        leftColumn.push(img);
        leftHeight += cardHeight + 10;
      } else {
        rightColumn.push(img);
        rightHeight += cardHeight + 10;
      }
    });

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* 1. Header with Search, Filter Icon & Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation?.goBack()}
          >
            <Ionicons name="chevron-back" size={26} color="#1C1C1E" />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#8E8E93" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={this.state.searchText}
              onChangeText={(text) => this.setState({ searchText: text })}
              placeholder="यहाँ खोजें..."
              placeholderTextColor="#8E8E93"
              onSubmitEditing={() => this.checkInternetAndLoadData(this.state.activeTab)}
            />
            {this.state.searchText ? (
              <TouchableOpacity onPress={() => this.setState({ searchText: '' })}>
                <Ionicons name="close-circle" size={18} color="#8E8E93" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filter/Options Icon to open custom attractive modal */}
          <TouchableOpacity 
            style={styles.filterBtn}
            onPress={() => this.setState({ isFilterModalVisible: true })}
          >
            <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 2. Horizontal Categories */}
        <View style={styles.tabContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScroll}
          >
            {[
              { name: 'सभी', icon: null },
              { name: 'जीवन', icon: 'leaf-outline', color: '#34C759' },
              { name: 'पिता', icon: 'person-outline', color: '#FF9500' },
              { name: 'प्रेरणा', icon: 'star-outline', color: '#FFCC00' },
              { name: 'भक्ति', icon: 'heart-outline', color: '#AF52DE' },
              { name: 'दोस्ती', icon: 'people-outline', color: '#007AFF' },
            ].map((tab, idx) => {
              const isActive = this.state.activeTab === tab.name;
              return (
                <TouchableOpacity 
                  key={idx} 
                  activeOpacity={0.7}
                  style={[styles.tabItem, isActive && styles.activeTabItem]}
                  onPress={() => this.handleTabChange(tab.name)}
                >
                  {tab.icon && (
                    <Ionicons 
                      name={tab.icon} 
                      size={14} 
                      color={isActive ? '#FFFFFF' : tab.color} 
                      style={{ marginRight: 5 }} 
                    />
                  )}
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. Main Content Area */}
        {this.state.isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>लोड हो रहा है...</Text>
          </View>
        ) : !this.state.isConnected ? (
          <View style={styles.centerContainer}>
            <Ionicons name="cloud-offline-outline" size={60} color="#8E8E93" />
            <Text style={styles.errorTitle}>इंटरनेट कनेक्शन नहीं है</Text>
            <Text style={styles.errorDesc}>कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => this.checkInternetAndLoadData(this.state.activeTab)}>
              <Text style={styles.retryText}>पुनः प्रयास करें</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.gridScroll}
          >
            <View style={styles.row}>
              {/* Left Column */}
              <View style={styles.column}>
                {leftColumn.map((item) => {
                  const cardHeight = COLUMN_WIDTH * item.aspectRatio;
                  const isDownloading = this.state.downloadingIds[item.id];
                  return (
                    <View key={item.id} style={[styles.imageCard, { height: cardHeight }]}>
                      <Image source={{ uri: item.uri }} style={styles.uploadedImage} contentFit="cover" transition={200} />
                      
                      <TouchableOpacity 
                        style={styles.downloadBottomBtn} 
                        onPress={() => this.handleDownload(item)}
                      >
                        {isDownloading ? (
                          <ActivityIndicator size="small" color="#1C1C1E" />
                        ) : (
                          <Feather name="download" size={14} color="#1C1C1E" />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {/* Right Column */}
              <View style={styles.column}>
                {rightColumn.map((item) => {
                  const cardHeight = COLUMN_WIDTH * item.aspectRatio;
                  const isDownloading = this.state.downloadingIds[item.id];
                  return (
                    <View key={item.id} style={[styles.imageCard, { height: cardHeight }]}>
                      <Image source={{ uri: item.uri }} style={styles.uploadedImage} contentFit="cover" transition={200} />
                      
                      <TouchableOpacity 
                        style={styles.downloadBottomBtn} 
                        onPress={() => this.handleDownload(item)}
                      >
                        {isDownloading ? (
                          <ActivityIndicator size="small" color="#1C1C1E" />
                        ) : (
                          <Feather name="download" size={14} color="#1C1C1E" />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}

        {/* --- CUSTOM ATTRACTIVE POPUP MODAL FOR COMING SOON VERSION --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isFilterModalVisible}
          onRequestClose={() => this.setState({ isFilterModalVisible: false })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Top Icon Badge */}
              <View style={styles.modalIconContainer}>
                <Ionicons name="sparkles" size={28} color="#6366F1" />
              </View>

              <Text style={styles.modalTitle}>नया अपडेट जल्द आ रहा है!</Text>
              <Text style={styles.modalDescription}>
                हम इस ऐप को और अधिक शक्तिशाली और बेहतरीन बना रहे हैं। फ़िल्टर और कस्टमाइज़ेशन के नए फीचर्स अगले वर्शन में उपलब्ध होंगे।
              </Text>

              <TouchableOpacity 
                style={styles.modalBtn}
                activeOpacity={0.8}
                onPress={() => this.setState({ isFilterModalVisible: false })}
              >
                <Text style={styles.modalBtnText}>ठीक है (Got It)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 48,
    paddingBottom: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  backBtn: { marginRight: 8, padding: 2 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F3F5',
    borderRadius: 24, paddingHorizontal: 14, height: 42,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1C1C1E' },
  filterBtn: {
    marginLeft: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366F1',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#6366F1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 3
  },

  tabContainer: { backgroundColor: '#FFFFFF', paddingBottom: 8 },
  tabScroll: { paddingHorizontal: 12, paddingVertical: 8 },
  tabItem: { 
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, 
    marginRight: 8, borderRadius: 20, backgroundColor: '#F1F3F5',
  },
  activeTabItem: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 13, color: '#495057', fontWeight: '500' },
  activeTabText: { color: '#FFFFFF', fontWeight: '700' },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { color: '#8E8E93', fontSize: 13, marginTop: 12 },
  errorTitle: { color: '#1C1C1E', fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 4 },
  errorDesc: { color: '#8E8E93', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#6366F1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  gridScroll: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: COLUMN_WIDTH },
  imageCard: {
    width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 10,
    backgroundColor: '#E9ECEF', position: 'relative',
  },
  uploadedImage: { width: '100%', height: '100%' },
  
  downloadBottomBtn: {
    position: 'absolute', bottom: 12, right: 12,
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 3, elevation: 4,
  },

  // --- CUSTOM POPUP MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: '#6366F1',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});