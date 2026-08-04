import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  TextInput, 
  Linking, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// नोट: अपने प्रोजेक्ट के हिसाब से firebase.js का सही पाथ दें
// import { db } from '../firebaseConfig'; 
// import { collection, getDocs } from 'firebase/firestore';

export default class YoutubeVideosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedCategory: 'All',
      isLoading: false, // फायरबेस डेटा लोड होने पर true रखें
      categories: ['All', 'Development', 'Design', 'Editing', 'AI Tools'],
      videos: [
        // यह डमी डेटा है। जब आप फायरबेस जोड़ेंगे, तो यहाँ डेटाबेस से डेटा आएगा।
        { id: '1', title: 'Complete Mobile App UI/UX Design Masterclass', category: 'Design', duration: '15:42', views: '45K views', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { id: '2', title: 'React Native Advanced Tutorial for Beginners', category: 'Development', duration: '22:10', views: '32K views', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { id: '3', title: 'Professional Video Editing Tips & Tricks', category: 'Editing', duration: '10:05', views: '18K views', thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ],
      filteredVideos: []
    };
  }

  componentDidMount() {
    this.setState({ filteredVideos: this.state.videos });
    // this.fetchVideosFromFirebase(); // जब फायरबेस कनेक्ट करना हो तो इसे अनकमेंट करें
  }

  /* 
  // फायरबेस से डेटा फेच करने का कोड (फ्यूचर यूज़ के लिए)
  fetchVideosFromFirebase = async () => {
    try {
      this.setState({ isLoading: true });
      const querySnapshot = await getDocs(collection(db, "videos"));
      let videoList = [];
      querySnapshot.forEach((doc) => {
        videoList.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ videos: videoList, filteredVideos: videoList, isLoading: false });
    } catch (error) {
      console.error("Error fetching videos: ", error);
      this.setState({ isLoading: false });
    }
  }
  */

  // सर्च और कैटेगरी फ़िल्टर करने का लॉजिक
  handleSearchAndFilter = (searchQuery, category) => {
    let filtered = this.state.videos;

    if (category !== 'All') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    this.setState({ filteredVideos: filtered });
  };

  onSearchChange = (text) => {
    this.setState({ searchQuery: text });
    this.handleSearchAndFilter(text, this.state.selectedCategory);
  };

  onSelectCategory = (category) => {
    this.setState({ selectedCategory: category });
    this.handleSearchAndFilter(this.state.searchQuery, category);
  };

  renderItem = ({ item }) => (
    <TouchableOpacity style={styles.videoCard} onPress={() => Linking.openURL(item.url)}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={22} color="#FFF" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.videoDetails}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoInfo}>Prabhavati Academy • {item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
        
        {/* हेडर */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="video-outline" size={16} color="#C084FC" style={{ marginRight: 6 }} />
            <Text style={styles.headerTitle}>Learning Hub</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* सर्च बार */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="ट्यूटोरियल सर्च करें..."
              placeholderTextColor="#9CA3AF"
              value={this.state.searchQuery}
              onChangeText={this.onSearchChange}
            />
            {this.state.searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => this.onSearchChange('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* कैटेगरी फ़िल्टर टैब्स */}
        <View style={styles.categoryContainer}>
          <FlatList
            horizontal
            data={this.state.categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => {
              const isSelected = this.state.selectedCategory === item;
              return (
                <TouchableOpacity 
                  style={[styles.categoryTab, isSelected && styles.selectedCategoryTab]}
                  onPress={() => this.onSelectCategory(item)}
                >
                  <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* वीडियो लिस्ट */}
        {this.state.isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#C084FC" />
            <Text style={styles.loaderText}>लोड हो रहा है...</Text>
          </View>
        ) : (
          <FlatList 
            data={this.state.filteredVideos} 
            renderItem={this.renderItem} 
            keyExtractor={item => item.id} 
            contentContainerStyle={styles.listContainer} 
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#4B5563" />
                <Text style={styles.emptyText}>कोई ट्यूटोरियल नहीं मिला!</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 35: 4, paddingBottom: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255, 255, 255, 0.08)', justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(124, 58, 237, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(124, 58, 237, 0.3)' },
  headerTitle: { fontSize: 13, fontWeight: '700', color: '#C084FC' },
  
  searchSection: { paddingHorizontal: 20, marginVertical: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14 },

  categoryContainer: { marginBottom: 10 },
  categoryTab: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#111827', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', height: 36, justifyContent: 'center', alignItems: 'center' },
  selectedCategoryTab: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  categoryText: { color: '#9CA3AF', fontSize: 12, fontWeight: '600' },
  selectedCategoryText: { color: '#FFFFFF' },

  listContainer: { padding: 20, paddingTop: 5 },
  videoCard: { backgroundColor: '#111827', borderRadius: 16, marginBottom: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' },
  thumbnailContainer: { width: '100%', height: 185, position: 'relative', backgroundColor: '#1F2937' },
  thumbnail: { width: '100%', height: '100%' },
  playOverlay: { position: 'absolute', top: '40%', left: '46%', width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(124, 58, 237, 0.9)', justifyContent: 'center', alignItems: 'center', transform: [{ translateX: -21 }, { translateY: -21 }] },
  durationBadge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  durationText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  categoryBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(124, 58, 237, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },

  videoDetails: { padding: 14 },
  videoTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 6, lineHeight: 20 },
  videoInfo: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: '#9CA3AF', fontSize: 13, marginTop: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#6B7280', fontSize: 14, marginTop: 10, fontWeight: '600' }
});