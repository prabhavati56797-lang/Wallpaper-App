import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');

export default class ImageDisplay extends Component {
  constructor(props) {
    super(props);
    const query = props.route?.params?.query || 'mountain';
    this.state = {
      searchText: query,
      activeTab: 'AI Images',
      isLoading: true,
      isConnected: true,
      images: []
    };
  }

  componentDidMount() {
    this.checkInternetAndLoadData('AI Images');
  }

  // इंटरनेट चेक करके कैटेगरी के हिसाब से डेटा लोड करने का फंक्शन
  checkInternetAndLoadData = (category) => {
    this.setState({ isLoading: true });
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setTimeout(() => {
          this.loadImagesByCategory(category);
          this.setState({ isConnected: true, isLoading: false });
        }, 500);
      } else {
        this.setState({ isConnected: false, isLoading: false });
        Alert.alert(
          "No Internet Connection",
          "Please turn on your internet connection to view and download images.",
          [{ text: "Retry", onPress: () => this.checkInternetAndLoadData(category) }]
        );
      }
    });
  };

  // अलग-अलग कैटेगरी के अनुसार अलग-अलग तस्वीरें लोड करने का डेटा (Long, Medium, Short ratios)
  loadImagesByCategory = (category) => {
    let fetchedImages = [];

    if (category === 'AI Images') {
      fetchedImages = [
        { id: 'ai-1', uri: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.7 }, // Long 19:9 ratio style
        { id: 'ai-2', uri: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.0 }, // Square / Medium ratio
        { id: 'ai-3', uri: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 0.75 }, // Short / Landscape ratio
        { id: 'ai-4', uri: 'https://images.pexels.com/features/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=600' || 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.6 },
      ];
    } else if (category === '3D Photos') {
      fetchedImages = [
        { id: '3d-1', uri: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.0 }, // Square
        { id: '3d-2', uri: 'https://images.pexels.com/photos/7887851/pexels-photo-7887851.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.8 }, // Long Portrait
        { id: '3d-3', uri: 'https://images.pexels.com/photos/7594467/pexels-photo-7594467.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 0.8 }, // Short Wide
        { id: '3d-4', uri: 'https://images.pexels.com/photos/7887854/pexels-photo-7887854.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.4 },
      ];
    } else if (category === 'Emoji') {
      fetchedImages = [
        { id: 'em-1', uri: 'https://images.pexels.com/photos/3761508/pexels-photo-3761508.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.0 }, // Square
        { id: 'em-2', uri: 'https://images.pexels.com/photos/3761515/pexels-photo-3761515.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.5 }, // Long Portrait
        { id: 'em-3', uri: 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 0.8 }, // Short Wide
      ];
    } else if (category === 'Music') {
      fetchedImages = [
        { id: 'm-1', uri: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.4 },
        { id: 'm-2', uri: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.0 },
      ];
    } else if (category === 'Videos') {
      fetchedImages = [
        { id: 'v-1', uri: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 1.7 },
        { id: 'v-2', uri: 'https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg?auto=compress&cs=tinysrgb&w=600', aspectRatio: 0.8 },
      ];
    }

    this.setState({ images: fetchedImages });
  };

  // कैटेगरी बदलने पर सीधे उसी पेज पर डेटा लोड करना
  handleTabChange = (tabName) => {
    this.setState({ activeTab: tabName });
    this.checkInternetAndLoadData(tabName);
  };

  // गैलरी में इमेज डाउनलोड करने का लॉजिक
  handleDownload = async (item) => {
    if (!this.state.isConnected) {
      Alert.alert("Network Error", "No internet connection. Cannot download image.");
      return;
    }

    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow storage permissions to save images to your gallery.");
        return;
      }

      Alert.alert("Downloading", "Saving image to your device gallery...");

      const filename = item.uri.split('/').pop().split('?')[0] + '.jpg';
      const fileUri = FileSystem.documentDirectory + filename;

      const downloadRes = await FileSystem.downloadAsync(item.uri, fileUri);
      
      if (downloadRes.status === 200) {
        const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
        await MediaLibrary.createAlbumAsync("WallpaperApp", asset, false);
        
        Alert.alert("Success", "Image successfully downloaded and saved to your Gallery!");
      } else {
        Alert.alert("Error", "Failed to download the image. Please try again.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong during download.");
    }
  };

  render() {
    const columnWidth = (width - 32) / 2;
    const leftColumn = [];
    const rightColumn = [];

    this.state.images.forEach((img, index) => {
      if (index % 2 === 0) {
        leftColumn.push(img);
      } else {
        rightColumn.push(img);
      }
    });

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {/* 1. Header with Search & Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#8E8E93" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={this.state.searchText}
              onChangeText={(text) => this.setState({ searchText: text })}
              placeholder="Search..."
              placeholderTextColor="#8E8E93"
              onSubmitEditing={() => this.checkInternetAndLoadData(this.state.activeTab)}
            />
            <TouchableOpacity onPress={() => this.setState({ searchText: '' })}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Super Smooth Horizontal Categories */}
        <View style={styles.tabContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.tabScroll}
          >
            {['AI Images', '3D Photos', 'Music', 'Videos', 'Emoji'].map((tab, idx) => (
              <TouchableOpacity 
                key={idx} 
                activeOpacity={0.7}
                style={[styles.tabItem, this.state.activeTab === tab && styles.activeTabItem]}
                onPress={() => this.handleTabChange(tab)}
              >
                <Text style={[styles.tabText, this.state.activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Main Content Area */}
        {this.state.isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading {this.state.activeTab}...</Text>
          </View>
        ) : !this.state.isConnected ? (
          <View style={styles.centerContainer}>
            <Ionicons name="cloud-offline-outline" size={60} color="#8E8E93" />
            <Text style={styles.errorTitle}>Connection Lost</Text>
            <Text style={styles.errorDesc}>Please check your internet and try again.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => this.checkInternetAndLoadData(this.state.activeTab)}>
              <Text style={styles.retryText}>Try Again</Text>
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
                  const cardHeight = columnWidth * item.aspectRatio;
                  return (
                    <View key={item.id} style={[styles.imageCard, { height: cardHeight }]}>
                      <Image source={{ uri: item.uri }} style={styles.uploadedImage} resizeMode="cover" />
                      <TouchableOpacity 
                        style={styles.downloadIconBtn} 
                        onPress={() => this.handleDownload(item)}
                      >
                        <Feather name="download" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {/* Right Column */}
              <View style={styles.column}>
                {rightColumn.map((item) => {
                  const cardHeight = columnWidth * item.aspectRatio;
                  return (
                    <View key={item.id} style={[styles.imageCard, { height: cardHeight }]}>
                      <Image source={{ uri: item.uri }} style={styles.uploadedImage} resizeMode="cover" />
                      <TouchableOpacity 
                        style={styles.downloadIconBtn} 
                        onPress={() => this.handleDownload(item)}
                      >
                        <Feather name="download" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 48,
    paddingBottom: 12, backgroundColor: '#000000',
  },
  backBtn: { marginRight: 10, padding: 2 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E',
    borderRadius: 22, paddingHorizontal: 14, height: 40,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#FFFFFF' },
  
  tabContainer: { backgroundColor: '#000000', borderBottomWidth: 0.5, borderBottomColor: '#2C2C2E' },
  tabScroll: { paddingHorizontal: 12, paddingVertical: 10 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 10, borderRadius: 20, backgroundColor: '#1C1C1E' },
  activeTabItem: { backgroundColor: '#3A3A3C' },
  tabText: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
  activeTabText: { color: '#FFFFFF', fontWeight: '700' },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { color: '#8E8E93', fontSize: 13, marginTop: 12 },
  errorTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 4 },
  errorDesc: { color: '#8E8E93', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  gridScroll: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: '48.5%' },
  imageCard: {
    width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 10,
    backgroundColor: '#1C1C1E', position: 'relative',
  },
  uploadedImage: { width: '100%', height: '100%' },
  downloadIconBtn: {
    position: 'absolute', bottom: 10, right: 10,
    width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)'
  }
});