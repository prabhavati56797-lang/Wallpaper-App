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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      isMenuOpen: false,
      profileImage: null,
    };
  }

  async componentDidMount() {
    await this.loadProfileImage();
    this.unsubscribeFocus = this.props.navigation.addListener('focus', async () => {
      await this.loadProfileImage();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
  }

  loadProfileImage = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const savedImage = await AsyncStorage.getItem('USER_PROFILE_IMAGE');
      if (savedImage) {
        this.setState({ profileImage: savedImage });
      }
    } catch (error) {
      console.log('Error loading profile image:', error);
    }
  };

  handleCategoryClick = (query) => {
    this.props.navigation.navigate('FullCatogery', { query: query });
  };

  handleSearchSubmit = () => {
    const query = this.state.searchText.trim();
    if (!query) {
      Alert.alert("Warning", "Please enter something to search or open.");
      return;
    }

    let targetUrl = '';
    const lowerQuery = query.toLowerCase();

    // स्मार्ट डिटेक्शन: अगर यूजर कोई प्लेटफॉर्म या वेबसाइट लिखता है, तो सीधे उसका इन-ऐप यूआरएल बना दें
    if (lowerQuery.includes('youtube')) {
      targetUrl = 'https://www.youtube.com';
    } else if (lowerQuery.includes('google')) {
      targetUrl = 'https://www.google.com';
    } else if (lowerQuery.includes('instagram')) {
      targetUrl = 'https://www.instagram.com';
    } else if (lowerQuery.includes('facebook')) {
      targetUrl = 'https://www.facebook.com';
    } else if (lowerQuery.includes('twitter') || lowerQuery.includes('x.com')) {
      targetUrl = 'https://twitter.com';
    } else if (lowerQuery.includes('github')) {
      targetUrl = 'https://github.com';
    } else if (lowerQuery.startsWith('http://') || lowerQuery.startsWith('https://') || lowerQuery.includes('.com') || lowerQuery.includes('.in') || lowerQuery.includes('.org')) {
      targetUrl = lowerQuery.startsWith('http') ? lowerQuery : `https://${lowerQuery}`;
    }

    if (targetUrl) {
      // अगर डायरेक्ट वेबसाइट/प्लेटफॉर्म है, तो सीधे इन-ऐप ब्राउज़र में खोलें
      this.props.navigation.navigate('UniversalSearchScreen', { initialUrl: targetUrl });
    } else {
      // सामान्य कीवर्ड होने पर ऐप के अंदर यूनिवर्सल सर्च/रिजल्ट स्क्रीन पर भेजें
      this.props.navigation.navigate('UniversalSearchScreen', { initialQuery: query });
    }
  };

  showNextVersionAlert = (featureName) => {
    Alert.alert("Coming Soon", `${featureName} will be available in the next version!`);
  };

  handleMenuPress = () => {
    if (this.props.navigation && this.props.navigation.navigate) {
      this.props.navigation.navigate('CloudDashboardScreen');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* 1. Top Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            activeOpacity={0.7}
            onPress={this.handleMenuPress}
          >
            <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.logoText}>Image<Text style={{ color: '#3B82F6' }}>Search</Text></Text>

          <TouchableOpacity 
            style={styles.singleIconBtn} 
            onPress={() => this.props.navigation.navigate('WorldHubScreen')}
          >
            <Ionicons name="globe-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.iconBtn, { marginRight: 8 }]} 
              onPress={() => this.props.navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={21} color="#E5E7EB" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileBtnContainer} 
              activeOpacity={0.85}
              onPress={() => this.props.navigation.navigate('ProfileScreen', {
                profileImage: this.state.profileImage,
                onProfileUpdate: async (newImageUri) => {
                  this.setState({ profileImage: newImageUri });
                  try {
                    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                    await AsyncStorage.setItem('USER_PROFILE_IMAGE', newImageUri);
                  } catch (e) {
                    console.log('Error saving:', e);
                  }
                }
              })}
            >
              <View style={styles.profileInnerRing}>
                {this.state.profileImage ? (
                  <Image source={{ uri: this.state.profileImage }} style={styles.headerProfileImage} />
                ) : (
                  <Ionicons name="person" size={20} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.subTitle}>Search anything, discover everything</Text>

          {/* 2. 3D Search Bar with Instant Clear (X) Button */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search YouTube, Google, websites..."
                placeholderTextColor="#6B7280"
                value={this.state.searchText}
                onChangeText={(text) => this.setState({ searchText: text })}
                onSubmitEditing={this.handleSearchSubmit}
              />
              {/* एक क्लिक में टेक्स्ट साफ़ करने वाला क्लोज़ बटन */}
              {this.state.searchText.length > 0 && (
                <TouchableOpacity onPress={() => this.setState({ searchText: '' })}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              style={styles.sparkleBtn} 
              onPress={() => this.props.navigation.navigate('AiChat')}
            >
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
              { name: 'Nature', icon: 'flower-tulip-outline', color: 'rgba(52, 199, 89, 0.15)', iconColor: '#34C759', query: 'Nature landscape' },
              { name: 'Abstract', icon: 'shape-outline', color: 'rgba(175, 82, 222, 0.15)', iconColor: '#AF52DE', query: 'Abstract art' },
              { name: 'Technology', icon: 'chip', color: 'rgba(0, 122, 255, 0.15)', iconColor: '#3B82F6', query: 'Technology futuristic' },
              { name: 'Animals', icon: 'cat', color: 'rgba(255, 149, 0, 0.15)', iconColor: '#FF9500', query: 'Cute animals' },
              { name: 'Travel', icon: 'earth', color: 'rgba(90, 200, 250, 0.15)', iconColor: '#5AC8FA', query: 'Travel destinations' },
              { name: 'Architecture', icon: 'city-variant-outline', color: 'rgba(88, 86, 214, 0.15)', iconColor: '#5856D6', query: 'Modern architecture' }
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

          {/* Toolkit Row 1 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolkitRow}>
            {[
              { title: 'Video Clips', desc: 'Pro stock footage', icon: 'video-box', route: 'VideoClips' },
              { title: 'Background Music', desc: 'Royalty-free tracks', icon: 'music-note-outline', route: 'BackgroundMusic' },
              { title: 'Stickers & Gifs', desc: 'Animated elements', icon: 'sticker-emoji', route: 'StickersGifs' },
              { title: 'Emoji Studio', desc: 'Trending expressions', icon: 'emoticon-happy-outline', route: 'EmojiStudio' },
              { title: 'AI Video FX', desc: 'Cinematic visual effects', icon: 'auto-fix', route: 'AIVideoFX' },
              { title: 'Sound FX', desc: 'Dynamic audio effects', icon: 'waveform', route: 'SoundFX' },
            ].map((tool, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.toolkitCard}
                onPress={() => {
                  if (tool.route) {
                    this.props.navigation.navigate(tool.route);
                  } else {
                    this.showNextVersionAlert(tool.title);
                  }
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name={tool.icon} size={24} color="#3B82F6" style={{ marginBottom: 8 }} />
                <Text style={styles.toolkitTitle}>{tool.title}</Text>
                <Text style={styles.toolkitDesc}>{tool.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Hero Banner Card */}
          <TouchableOpacity 
            style={styles.heroBannerCard} 
            onPress={() => this.props.navigation.navigate('VideosScreen')}
            activeOpacity={0.95}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' }} 
              style={styles.heroBannerImage} 
            />
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroBadge}>
                  <Ionicons name="sparkles" size={12} color="#FBBF24" />
                  <Text style={styles.heroBadgeText}> FEATURED MASTERCLASS</Text>
                </View>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>NEW</Text>
                </View>
              </View>

              <View style={styles.heroContentArea}>
                <Text style={styles.heroTitle}>Master Video Editing & App UI Design</Text>
                <Text style={styles.heroSubtitle}>प्रिंसिपल ट्यूटोरियल देखें और प्रो क्रिएटर बनें।</Text>
              </View>

              <View style={styles.heroBottomRow}>
                <View style={styles.watchButton}>
                  <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.watchButtonText}>Start Watching Now</Text>
                </View>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={14} color="#C084FC" />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Toolkit Row 2 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolkitRow}>
            {[
              { title: 'Pro Timeline', desc: 'Multi-layer tracks', icon: 'filmstrip', route: 'ProTimeline' },
              { title: 'Thumbnail Studio', desc: 'Design covers', icon: 'view-dashboard-outline', route: 'ThumbnailStudio' },
              { title: 'AI Magic Lab', desc: 'Smart tools', icon: 'star-shooting-outline', route: 'AIMagicLab' },
              { title: 'FX Color Grading', desc: 'Cinematic filters', icon: 'palette-swatch-outline', route: 'FXColorGrading' },
              { title: 'Audio Beat Sync', desc: 'Rhythm cuts', icon: 'waveform', route: 'AudioBeatSync' },
              { title: 'Kinetic Text', desc: 'Animated captions', icon: 'format-text', route: 'KineticText' },
            ].map((tool, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.toolkitCard}
                onPress={() => {
                  if (tool.route) {
                    this.props.navigation.navigate(tool.route);
                  } else {
                    this.showNextVersionAlert(tool.title);
                  }
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name={tool.icon} size={24} color="#3B82F6" style={{ marginBottom: 8 }} />
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

          {/* Trending Cards */}
          <TouchableOpacity 
            style={styles.trendingCard}
            onPress={() => this.props.navigation.navigate('UniversalSearchScreen')}
            activeOpacity={0.9}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingBadge}>
                <Ionicons name="search" size={11} color="#6366F1" />
                <Text style={styles.trendingBadgeText}> Smart Feature</Text>
              </View>
              <Text style={styles.trendingTitle}>Universal Web Search & Browser</Text>
              <Text style={styles.trendingDesc}>Search any website or Google query directly inside the app instantly.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.trendingCard}
            onPress={() => this.props.navigation.navigate('GlobalNews')}
            activeOpacity={0.9}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingBadge}>
                <Ionicons name="globe" size={11} color="#38BDF8" />
                <Text style={styles.trendingBadgeText}> World Pulse</Text>
              </View>
              <Text style={styles.trendingTitle}>Global News & Stories Hub</Text>
              <Text style={styles.trendingDesc}>Explore live world updates, top breaking stories, and global trends instantly.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.trendingCard}
            onPress={() => this.props.navigation.navigate('UniversalSearchScreen', { initialUrl: 'https://www.sofascore.com/' })}
            activeOpacity={0.9}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingBadge}>
                <Ionicons name="flame" size={11} color="#FF3B30" />
                <Text style={styles.trendingBadgeText}> Hot Today</Text>
              </View>
              <Text style={styles.trendingTitle}>Live Sports & Scores</Text>
              <Text style={styles.trendingDesc}>Track live matches, scores, and real-time sports action instantly.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.trendingCard}
            onPress={() => this.props.navigation.navigate('UniversalSearchScreen', { initialUrl: 'https://www.podchaser.com/' })}
            activeOpacity={0.9}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingBadge}>
                <Ionicons name="flame" size={11} color="#AF52DE" />
                <Text style={styles.trendingBadgeText}> Hot Today</Text>
              </View>
              <Text style={styles.trendingTitle}>Trending Podcasts Hub</Text>
              <Text style={styles.trendingDesc}>Explore top-trending podcasts and global audio shows live.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.trendingCard}
            onPress={() => this.props.navigation.navigate('UniversalSearchScreen', { initialUrl: 'https://companiesmarketcap.com/' })}
            activeOpacity={0.9}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingBadge}>
                <Ionicons name="flame" size={11} color="#34C759" />
                <Text style={styles.trendingBadgeText}> Hot Today</Text>
              </View>
              <Text style={styles.trendingTitle}>Live Company Valuation</Text>
              <Text style={styles.trendingDesc}>Watch real-time revenue and market values of top global giants.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.trendingCard}
            onPress={() => this.props.navigation.navigate('UniversalSearchScreen', { initialUrl: 'https://zoom.earth/' })}
            activeOpacity={0.9}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingBadge}>
                <Ionicons name="flame" size={11} color="#3B82F6" />
                <Text style={styles.trendingBadgeText}> Hot Today</Text>
              </View>
              <Text style={styles.trendingTitle}>Global Live Earth & Satellite</Text>
              <Text style={styles.trendingDesc}>View live satellite imagery, weather storms, and planet Earth.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0C10' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 48,
    paddingBottom: 14, backgroundColor: '#0F131E',
    borderBottomWidth: 0.5, borderBottomColor: '#1F2937'
  },
  logoText: { fontSize: 19, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  subTitle: { fontSize: 13, color: '#9CA3AF', marginTop: 14, marginBottom: 14, fontWeight: '400' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B26',
    borderRadius: 14, paddingHorizontal: 12, height: 48,
    borderWidth: 1, borderColor: '#222A3B',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4
  },
  searchInput: { flex: 1, fontSize: 13, color: '#FFFFFF' },
  sparkleBtn: {
    width: 48, height: 48, backgroundColor: '#3B82F6', borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  viewAllText: { fontSize: 12, color: '#60A5FA', fontWeight: '500' },
  
  categoriesRow: { paddingBottom: 8 },
  categoryCard: { alignItems: 'center', marginRight: 15, width: 70 },
  categoryIconBox: { 
    width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2
  },
  categoryName: { fontSize: 11, color: '#D1D5DB', fontWeight: '500', textAlign: 'center' },

  toolkitRow: { paddingBottom: 8, marginVertical: 6 },
  toolkitCard: {
    backgroundColor: '#161B26', width: 105, padding: 12, borderRadius: 16,
    marginRight: 10, borderWidth: 1, borderColor: '#222A3B', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3
  },
  toolkitTitle: { fontSize: 11, fontWeight: '600', color: '#FFFFFF', marginBottom: 2, textAlign: 'center' },
  toolkitDesc: { fontSize: 9, color: '#9CA3AF', textAlign: 'center' },
  
  trendingCard: {
    backgroundColor: '#161B26', borderRadius: 18, padding: 16, flexDirection: 'row',
    alignItems: 'center', marginTop: 4, marginBottom: 14,
    borderWidth: 1, borderColor: '#222A3B',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3
  },
  trendingContent: { flex: 1 },
  trendingBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.15)', alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6,
    borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  trendingBadgeText: { fontSize: 9, color: '#93C5FD', fontWeight: '700' },
  trendingTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 2, letterSpacing: -0.2 },
  trendingDesc: { fontSize: 11, color: '#9CA3AF' },

  heroBannerCard: {
    width: '100%',
    height: 150,
    borderRadius: 22,
    overflow: 'hidden',
    marginVertical: 14,
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: 'rgba(192, 132, 252, 0.3)',
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    padding: 18,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  heroBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 5,
  },
  liveText: {
    color: '#FCA5A5',
    fontSize: 9,
    fontWeight: '700',
  },
  heroContentArea: {
    marginVertical: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 22,
  },
  heroSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.4)',
  },

  profileBtnContainer: {
    width: 35,
    height: 35,
    borderRadius: 21,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  profileInnerRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerProfileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  singleIconBtn: {
    width: 33,
    height: 33,
    borderRadius: 19,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    left: 40
  },
});