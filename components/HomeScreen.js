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
    const newLocal = "crown";
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
      <Ionicons name="notifications-outline" size={21} color="#0a0a0a" />
    </TouchableOpacity>

    {/* Pro Subscription Icon Added Here */}
    <TouchableOpacity style={[styles.iconBtn, { marginRight: 8 }]} onPress={() => this.showNextVersionAlert("Go Pro Subscription")}>
      <Ionicons name="star" size={21} color="#e7892b" />
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
    { name: 'Nature', icon: 'flower-tulip-outline', color: '#E8F5E9', iconColor: '#34C759', query: 'Nature landscape' },
    { name: 'Abstract', icon: 'shape-outline', color: '#F3E5F5', iconColor: '#AF52DE', query: 'Abstract art' },
    { name: 'Technology', icon: 'chip', color: '#E3F2FD', iconColor: '#007AFF', query: 'Technology futuristic' },
    { name: 'Animals', icon: 'cat', color: '#FFF3E0', iconColor: '#FF9500', query: 'Cute animals' },
    { name: 'Travel', icon: 'earth', color: '#E0F7FA', iconColor: '#5AC8FA', query: 'Travel destinations' },
    { name: 'Architecture', icon: 'city-variant-outline', color: '#EDE7F6', iconColor: '#5856D6', query: 'Modern architecture' }
  ].map((cat, index) => (
    <TouchableOpacity 
      key={index} 
      style={styles.categoryCard}
      onPress={() => this.handleCategoryClick(cat.query)}
    >
      <View style={[styles.categoryIconBox, { backgroundColor: cat.color }]}>
        <MaterialCommunityIcons name={cat.icon} size={24} color={cat.iconColor} />
      </View>
      <Text style={styles.categoryName}>{cat.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>






<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolkitRow}>
  {[
    { title: 'Video Clips', desc: 'Pro stock footage', icon: 'video-box' },
    { title: 'Background Music', desc: 'Royalty-free tracks', icon: 'music-note-outline' },
    { title: 'Stickers & Gifs', desc: 'Animated elements', icon: 'sticker-emoji' },
    { title: 'Emoji Studio', desc: 'Trending expressions', icon: 'emoticon-happy-outline' },
    { title: 'AI Video FX', desc: 'Cinematic visual effects', icon: 'auto-fix' },
    { title: 'Sound FX', desc: 'Dynamic audio effects', icon: 'waveform' },
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













{/* 5. Pro Learning & Tutorials Banner (Clickable Card) 666 */}
<TouchableOpacity 
  style={styles.proBannerContainer}
  onPress={() => this.showNextVersionAlert("Navigate to Video Tutorials Page")}
  activeOpacity={0.9}
>
  {/* Left Side: Text & Subtitle */}
  <View style={styles.proBannerContent}>
    <View style={styles.proBadge}>
      <Ionicons name="play-circle" size={12} color="#FF9500" />
      <Text style={styles.proBadgeText}> Masterclass</Text>
    </View>
    <Text style={styles.proBannerTitle}>Learn Video Editing & Creator Tips</Text>
    <Text style={styles.proBannerSubtitle}>Watch step-by-step tutorials from top editors.</Text>
    
    <View style={styles.watchNowBtn}>
      <Text style={styles.watchNowText}>Start Watching</Text>
      <Ionicons name="arrow-forward" size={13} color="#FFF" style={{ marginLeft: 4 }} />
    </View>
  </View>

  {/* Right Side: Professional Poster / Graphic Illustration */}
  <View style={styles.proBannerGraphicBox}>
    <View style={styles.playIconButton}>
      <Ionicons name="play" size={28} color="#007AFF" />
    </View>
  </View>
</TouchableOpacity>
























<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolkitRow}>
  {[
    { title: 'Pro Timeline', desc: 'Multi-layer tracks', icon: 'filmstrip' },
    { title: 'Thumbnail Studio', desc: 'Design covers', icon: 'view-dashboard-outline' },
    { title: 'AI Magic Lab', desc: 'Smart tools', icon: 'star-shooting-outline' },
    { title: 'FX Color Grading', desc: 'Cinematic filters', icon: 'palette-swatch-outline' },
    { title: 'Audio Beat Sync', desc: 'Rhythm cuts', icon: 'waveform' },
    { title: 'Kinetic Text', desc: 'Animated captions', icon: 'format-text' },
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




















proBannerContainer: {
  flexDirection: 'row',
  backgroundColor: '#1b1b33', // प्रीमियम डार्क या आप अपना थीम कलर रख सकते हैं
  borderRadius: 20,
  padding: 18,
  marginHorizontal: 16,
  marginVertical: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 5,
},
proBannerContent: {
  flex: 1,
  paddingRight: 10,
},
proBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 149, 0, 0.15)',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  alignSelf: 'flex-start',
  marginBottom: 8,
},
proBadgeText: {
  fontSize: 10,
  fontWeight: '700',
  color: '#FF9500',
},
proBannerTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#FFFFFF',
  marginBottom: 4,
},
proBannerSubtitle: {
  fontSize: 12,
  color: '#A0A0AB',
  marginBottom: 12,
  lineHeight: 16,
},
watchNowBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#007AFF',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  alignSelf: 'flex-start',
},
watchNowText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#FFFFFF',
},
proBannerGraphicBox: {
  width: 90,
  height: 90,
  backgroundColor: 'rgba(0, 122, 255, 0.15)',
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'rgba(0, 122, 255, 0.3)',
},
playIconButton: {
  width: 48,
  height: 48,
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},

























});