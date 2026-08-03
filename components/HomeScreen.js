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
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: '' };
  }

  // कैटेगरी और सर्च के लिए नेविगेशन (अगले पेज पर ले जाने के लिए)
  handleCategoryClick = (query) => {
    this.props.navigation.navigate('FullCatogery', { query: query });
  };

  handleSearchSubmit = () => {
    if (!this.state.searchText.trim()) {
      Alert.alert("Warning", "Please enter a search keyword.");
      return;
    }
    this.props.navigation.navigate('FullCatogery', { query: this.state.searchText });
  };

  // अनयूज्ड बटन्स और नए फीचर्स के लिए "Next Version" अलर्ट
  showNextVersionAlert = (featureName) => {
    Alert.alert("Coming Soon", `${featureName} will be available in the next version!`);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

        {/* 1. Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => this.showNextVersionAlert("Menu")}>
            <Ionicons name="menu-outline" size={24} color="#1C1C1E" />
          </TouchableOpacity>

          <Text style={styles.logoText}>Image<Text style={{ color: '#007AFF' }}>Search</Text></Text>

          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconBtn, { marginRight: 8 }]} onPress={() => this.showNextVersionAlert("Notifications")}>
              <Ionicons name="notifications-outline" size={21} color="#1C1C1E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showNextVersionAlert("Profile")}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' }} 
                style={styles.profileImg} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.subTitle}>Search anything, discover everything</Text>

          {/* 2. Search Bar & Lightweight AI Sparkle Button */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#8E8E93" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search images, wallpapers..."
                placeholderTextColor="#8E8E93"
                value={this.state.searchText}
                onChangeText={(text) => this.setState({ searchText: text })}
                onSubmitEditing={this.handleSearchSubmit}
              />
            </View>
            <TouchableOpacity style={styles.sparkleBtn} onPress={() => this.showNextVersionAlert("AI Gen/Sparkle feature")}>
              <MaterialCommunityIcons name="star-four-points" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* 3. Explore Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <TouchableOpacity onPress={() => this.handleCategoryClick("All Categories")}>
              <Text style={styles.viewAllText}>View All &gt;</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {[
              { name: 'Nature', icon: 'leaf-outline', color: '#E8F5E9', iconColor: '#34C759', query: 'Nature landscape' },
              { name: 'Abstract', icon: 'color-palette-outline', color: '#F3E5F5', iconColor: '#AF52DE', query: 'Abstract art' },
              { name: 'Technology', icon: 'laptop-outline', color: '#E3F2FD', iconColor: '#007AFF', query: 'Technology futuristic' },
              { name: 'Animals', icon: 'paw-outline', color: '#FFF3E0', iconColor: '#FF9500', query: 'Cute animals' },
              { name: 'Travel', icon: 'airplane-outline', color: '#E0F7FA', iconColor: '#5AC8FA', query: 'Travel destinations' },
              { name: 'Architecture', icon: 'business-outline', color: '#EDE7F6', iconColor: '#5856D6', query: 'Modern architecture' }
            ].map((cat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.categoryCard}
                onPress={() => this.handleCategoryClick(cat.query)}
              >
                <View style={[styles.categoryIconBox, { backgroundColor: cat.color }]}>
                  <Ionicons name={cat.icon} size={24} color={cat.iconColor} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 4. NEW: Professional Circular Scrollable V2 Feature Hub (Music, HD Videos, GIFs, etc.) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Version 2.0 Hub (Coming Soon)</Text>
            <Text style={styles.badgeV2}>NEW</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.circularRow}>
            {[
              { name: 'HD Videos', icon: 'videocam-outline', bg: '#E3F2FD', color: '#007AFF' },
              { name: 'Music Hub', icon: 'musical-notes-outline', bg: '#FCE4EC', color: '#E91E63' },
              { name: 'AI Generator', icon: 'color-wand-outline', bg: '#F3E5F5', color: '#9C27B0' },
              { name: '3D Avatars', icon: 'cube-outline', bg: '#E8F5E9', color: '#4CAF50' },
              { name: 'GIFs & Memes', icon: 'happy-outline', bg: '#FFFDE7', color: '#FBC02D' },
              { name: 'Stickers', icon: 'images-outline', bg: '#FFF3E0', color: '#FF9800' }
            ].map((item, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.circularCard}
                onPress={() => this.showNextVersionAlert(`${item.name} Feature`)}
                activeOpacity={0.8}
              >
                <View style={[styles.circularIconCircle, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={26} color={item.color} />
                </View>
                <Text style={styles.circularText} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 5. Featured Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerTextContent}>
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={10} color="#FF9500" />
                <Text style={styles.featuredBadgeText}> Featured</Text>
              </View>
              <Text style={styles.bannerTitle}>Discover High Quality Images</Text>
              <Text style={styles.bannerSubtitle}>Millions of stunning images at your fingertips.</Text>
              
              <TouchableOpacity 
                style={styles.exploreNowBtn}
                onPress={() => this.handleCategoryClick("High Quality HD")}
              >
                <Text style={styles.exploreNowText}>Explore Now</Text>
                <Ionicons name="chevron-forward" size={13} color="#FFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
            <View style={styles.bannerGraphic}>
              <Feather name="feather" size={60} color="rgba(0,122,255,0.12)" style={{ transform: [{ rotate: '-45deg' }] }} />
            </View>
          </View>

          {/* 6. Editor's Toolkit */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Editor's Toolkit</Text>
            <TouchableOpacity onPress={() => this.showNextVersionAlert("Editor's Toolkit View All")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolkitRow}>
            {[
              { title: 'Image Editor', desc: 'Enhance images', icon: 'wand' },
              { title: 'Crop Image', desc: 'Crop perfect size', icon: 'crop' },
              { title: 'Filters', desc: 'Amazing filters', icon: 'camera-iris' },
              { title: 'Draw & Paint', desc: 'Create art', icon: 'palette-outline' },
              { title: 'Compress', desc: 'Reduce size', icon: 'compress' },
            ].map((tool, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.toolkitCard}
                onPress={() => this.showNextVersionAlert(tool.title)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name={tool.icon} size={24} color="#007AFF" style={{ marginBottom: 8 }} />
                <Text style={styles.toolkitTitle}>{tool.title}</Text>
                <Text style={styles.toolkitDesc}>{tool.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 7. Trending Spotlight Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Spotlight</Text>
            <TouchableOpacity onPress={() => this.showNextVersionAlert("Trending Spotlight View All")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.trendingCard}
            onPress={() => this.showNextVersionAlert("Trending Spotlight Feature")}
            activeOpacity={0.9}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingBadge}>
                <Ionicons name="flame" size={11} color="#FF3B30" />
                <Text style={styles.trendingBadgeText}> Hot Today</Text>
              </View>
              <Text style={styles.trendingTitle}>4K Ultra HD Wallpapers</Text>
              <Text style={styles.trendingDesc}>Handpicked collections updated every single hour.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#8E8E93" />
          </TouchableOpacity>

          {/* 8. Go Premium Box */}
          <View style={styles.premiumBox}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <MaterialCommunityIcons name="crown-outline" size={17} color="#FFD700" style={{ marginRight: 5 }} />
                <Text style={styles.premiumTitle}>Go Premium</Text>
              </View>
              <Text style={styles.premiumDesc}>No ads, unlimited downloads & tools</Text>
            </View>
            <TouchableOpacity 
              style={styles.upgradeBtn}
              onPress={() => this.showNextVersionAlert("Go Premium Upgrade")}
            >
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 48,
    paddingBottom: 14, backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomWidth: 0.5, borderBottomColor: '#C6C6C8'
  },
  logoText: { fontSize: 19, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 4 },
  profileImg: { width: 30, height: 30, borderRadius: 15 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  subTitle: { fontSize: 13, color: '#8E8E93', marginTop: 14, marginBottom: 14, fontWeight: '400' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3E3E8',
    borderRadius: 12, paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#1C1C1E' },
  sparkleBtn: {
    width: 44, height: 44, backgroundColor: '#007AFF', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 3
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 },
  viewAllText: { fontSize: 12, color: '#007AFF', fontWeight: '500' },
  badgeV2: { fontSize: 9, fontWeight: '700', color: '#007AFF', backgroundColor: '#E3F2FD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  
  categoriesRow: { paddingBottom: 8 },
  categoryCard: { alignItems: 'center', marginRight: 15, width: 70 },
  categoryIconBox: { 
    width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1
  },
  categoryName: { fontSize: 11, color: '#3A3A3C', fontWeight: '500', textAlign: 'center' },

  // New Circular Scrollable V2 Styles
  circularRow: { paddingBottom: 10 },
  circularCard: { alignItems: 'center', marginRight: 16, width: 72 },
  circularIconCircle: {
    width: 62, height: 62, borderRadius: 31, justifyContent: 'center', alignItems: 'center', marginBottom: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)'
  },
  circularText: { fontSize: 11, color: '#3A3A3C', fontWeight: '600', textAlign: 'center' },

  bannerContainer: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, flexDirection: 'row',
    alignItems: 'center', marginTop: 12, marginBottom: 18, overflow: 'hidden', position: 'relative',
    borderWidth: 0.5, borderColor: '#E5E5EA',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  bannerTextContent: { flex: 1, zIndex: 2 },
  featuredBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', alignSelf: 'flex-start',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, marginBottom: 8,
  },
  featuredBadgeText: { fontSize: 9, color: '#B7791F', fontWeight: '700' },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 4, letterSpacing: -0.3 },
  bannerSubtitle: { fontSize: 11, color: '#8E8E93', marginBottom: 12 },
  exploreNowBtn: {
    flexDirection: 'row', backgroundColor: '#007AFF', paddingVertical: 7,
    paddingHorizontal: 13, borderRadius: 12, alignSelf: 'flex-start', alignItems: 'center',
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 2
  },
  exploreNowText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  bannerGraphic: { position: 'absolute', right: -5, bottom: -5 },
  toolkitRow: { paddingBottom: 8 },
  toolkitCard: {
    backgroundColor: '#FFFFFF', width: 105, padding: 12, borderRadius: 16,
    marginRight: 10, borderWidth: 0.5, borderColor: '#E5E5EA', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1
  },
  toolkitTitle: { fontSize: 11, fontWeight: '600', color: '#1C1C1E', marginBottom: 2, textAlign: 'center' },
  toolkitDesc: { fontSize: 9, color: '#8E8E93', textAlign: 'center' },
  trendingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, flexDirection: 'row',
    alignItems: 'center', marginTop: 4, marginBottom: 14,
    borderWidth: 0.5, borderColor: '#E5E5EA',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1
  },
  trendingContent: { flex: 1 },
  trendingBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', alignSelf: 'flex-start',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, marginBottom: 6,
  },
  trendingBadgeText: { fontSize: 9, color: '#C62828', fontWeight: '700' },
  trendingTitle: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 2, letterSpacing: -0.2 },
  trendingDesc: { fontSize: 11, color: '#8E8E93' },
  premiumBox: {
    backgroundColor: '#1C1C1E', borderRadius: 18, padding: 16, flexDirection: 'row',
    alignItems: 'center', marginTop: 4, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4
  },
  premiumTitle: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  premiumDesc: { fontSize: 10, color: '#8E8E93' },
  upgradeBtn: {
    backgroundColor: '#007AFF', paddingHorizontal: 13, paddingVertical: 7,
    borderRadius: 10, alignItems: 'center',
  },
  upgradeText: { fontSize: 11, fontWeight: '600', color: '#FFF' },
});