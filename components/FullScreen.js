
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  FlatList,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

// Pexels API Key
const PEXELS_KEY = Constants.expoConfig?.extra?.PEXELS_API_KEY || Constants.manifest?.extra?.PEXELS_API_KEY;

// --- डमी डेटा ---
const DUMMY_NAIL_ART_PHOTOS = [
  { id: '1', uri: 'https://images.pexels.com/photos/7619953/pexels-photo-7619953.jpeg?auto=compress&cs=tinysrgb&w=800', largeUri: 'https://images.pexels.com/photos/7619953/pexels-photo-7619953.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { id: '2', uri: 'https://images.pexels.com/photos/7619955/pexels-photo-7619955.jpeg?auto=compress&cs=tinysrgb&w=800', largeUri: 'https://images.pexels.com/photos/7619955/pexels-photo-7619955.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { id: '3', uri: 'https://images.pexels.com/photos/7957072/pexels-photo-7957072.jpeg?auto=compress&cs=tinysrgb&w=800', largeUri: 'https://images.pexels.com/photos/7957072/pexels-photo-7957072.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { id: '4', uri: 'https://images.pexels.com/photos/10298947/pexels-photo-10298947.jpeg?auto=compress&cs=tinysrgb&w=800', largeUri: 'https://images.pexels.com/photos/10298947/pexels-photo-10298947.jpeg?auto=compress&cs=tinysrgb&w=1600' },
];

const DUMMY_MOUNTAINS_PHOTOS = [
    { id: '7', uri: 'https://images.pexels.com/photos/1666062/pexels-photo-1666062.jpeg?auto=compress&cs=tinysrgb&w=800', largeUri: 'https://images.pexels.com/photos/1666062/pexels-photo-1666062.jpeg?auto=compress&cs=tinysrgb&w=1600' },
    { id: '8', uri: 'https://images.pexels.com/photos/327136/pexels-photo-327136.jpeg?auto=compress&cs=tinysrgb&w=800', largeUri: 'https://images.pexels.com/photos/327136/pexels-photo-327136.jpeg?auto=compress&cs=tinysrgb&w=1600' },
];

export default class FullCatogeryScreen extends Component {
  constructor(props) {
    super(props);
    const passedQuery = this.props.route?.params?.query || "Spring nail art";
    
    this.state = {
      searchQuery: passedQuery,
      photoResults: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchImagesByKeyword(this.state.searchQuery);
  }

  fetchImagesByKeyword = async (keyword) => {
    this.setState({ isLoading: true, photoResults: [] });

    if (!PEXELS_KEY) {
        setTimeout(() => {
            let dummyData = [];
            if (keyword.toLowerCase().includes("nail")) { dummyData = DUMMY_NAIL_ART_PHOTOS; }
            else if (keyword.toLowerCase().includes("mountain")) { dummyData = DUMMY_MOUNTAINS_PHOTOS; }
            else { dummyData = [...DUMMY_NAIL_ART_PHOTOS, ...DUMMY_MOUNTAINS_PHOTOS]; }
            this.setState({ photoResults: dummyData, isLoading: false });
        }, 800);
        return;
    }

    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=20`, {
        headers: { Authorization: PEXELS_KEY },
      });
      const json = await response.json();
      
      if (json && json.photos) {
        const formattedPhotos = json.photos.map(photo => ({
          uri: photo.src.medium,
          largeUri: photo.src.large2x || photo.src.large,
          id: String(photo.id),
        }));
        this.setState({ photoResults: formattedPhotos, isLoading: false });
      } else {
        this.setState({ photoResults: [], isLoading: false });
      }
    } catch (error) {
      Alert.alert("Error", "Could not load images. Please try again.");
      this.setState({ isLoading: false });
    }
  };

  handleNewSearch = () => {
    if (!this.state.searchQuery.trim()) {
      Alert.alert("Warning", "Please enter a search keyword.");
      return;
    }
    this.fetchImagesByKeyword(this.state.searchQuery);
  };

  // यहाँ इमेज पर क्लिक होने पर 'ImageDisplay' पेज पर डेटा भेजा जा रहा है
  renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.imageCard} 
      onPress={() => this.props.navigation.navigate('ImageDisplay', { photo: item })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.uri }} style={styles.imageStyle} resizeMode="cover" />
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity 
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
          >
              <Ionicons name="arrow-back" size={22} color="#212121" />
          </TouchableOpacity>

          <View style={styles.searchBox}>
              <TextInput
                  style={styles.searchInput}
                  placeholder="Search photos..."
                  placeholderTextColor="#9E9E9E"
                  value={this.state.searchQuery}
                  onChangeText={(text) => this.setState({ searchQuery: text })}
                  onSubmitEditing={this.handleNewSearch}
              />
              <TouchableOpacity onPress={this.handleNewSearch} style={styles.searchIconBtn}>
                  <Ionicons name="search" size={18} color="#9E9E9E" />
              </TouchableOpacity>
          </View>
        </View>

        {/* Loading */}
        {this.state.isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#673AB7" />
            <Text style={styles.loadingText}>Searching amazing photos...</Text>
          </View>
        )}

        {/* Empty State */}
        {!this.state.isLoading && this.state.photoResults.length === 0 && (
            <View style={styles.emptyContainer}>
                <Ionicons name="images-outline" size={50} color="#BDBDBD" />
                <Text style={styles.emptyText}>No images found for "{this.state.searchQuery}".</Text>
            </View>
        )}

        {/* Grid List */}
        {!this.state.isLoading && this.state.photoResults.length > 0 && (
            <FlatList
                data={this.state.photoResults}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 45,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 42, height: 42,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#212121' },
  searchIconBtn: { padding: 5 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#757575', marginTop: 10, fontSize: 13 },
  listContainer: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 },
  imageCard: {
    flex: 1, margin: 6, height: 220,
    borderRadius: 14, backgroundColor: '#E0E0E0', overflow: 'hidden',
  },
  imageStyle: { width: '100%', height: '100%' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 15, color: '#424242', textAlign: 'center', marginTop: 15, fontWeight: '500' },
});