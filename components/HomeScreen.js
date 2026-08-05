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
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default class HomeScreen extends Component {
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
 

constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      isMenuOpen: false,
      profileImage: null, // <--- यहाँ नया जोड़ा गया है
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
    if (!this.state.searchText.trim()) {
      Alert.alert("Warning", "Please enter a search keyword.");
      return;
    }
    this.props.navigation.navigate('FullCatogery', { query: this.state.searchText });
  };

  showNextVersionAlert = (featureName) => {
    Alert.alert("Coming Soon", `${featureName} will be available in the next version!`);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

        {/* 1. Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => this.setState({ isMenuOpen: true })}>
            <Ionicons name="menu-outline" size={24} color="#1C1C1E" />
          </TouchableOpacity>

          <Text style={styles.logoText}>Image<Text style={{ color: '#007AFF' }}>Search</Text></Text>





























<View style={styles.headerRight}>

  <TouchableOpacity 
  style={[styles.iconBtn, { marginRight: 8 }]} 
  onPress={() => this.props.navigation.navigate('Notifications')}
>
  <Ionicons name="notifications-outline" size={21} color="#0a0a0a" />
</TouchableOpacity>






















































{/*ravi kumar jiu */}
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

          {/* 2. Search Bar */}
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
























             {/* 9999999999. Search Bar */}
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

















































//444444444z

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolkitRow}>
  {[
    { title: 'Video Clips', desc: 'Pro stock footage', icon: 'video-box', route: 'VideoClips' },
    { title: 'Background Music', desc: 'Royalty-free tracks', icon: 'music-note-outline', route: 'BackgroundMusic' },
    { title: 'Stickers & Gifs', desc: 'Animated elements', icon: 'sticker-emoji', route: 'StickersGifs' },
    { title: 'Emoji Studio', desc: 'Trending expressions', icon: 'emoticon-happy-outline' },
    { title: 'AI Video FX', desc: 'Cinematic visual effects', icon: 'auto-fix' },
    { title: 'Sound FX', desc: 'Dynamic audio effects', icon: 'waveform' },
  ].map((tool, idx) => (
    <TouchableOpacity 
      key={idx} 
      style={styles.toolkitCard}
      onPress={() => {
        // यदि राउट मौजूद है तो उस पेज पर जाएं, वरना अलर्ट दिखाएं
        if (tool.route) {
          this.props.navigation.navigate(tool.route);
        } else {
          this.showNextVersionAlert(tool.title);
        }
      }}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name={tool.icon} size={24} color="#007AFF" style={{ marginBottom: 8 }} />
      <Text style={styles.toolkitTitle}>{tool.title}</Text>
      <Text style={styles.toolkitDesc}>{tool.desc}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>











          {/* 5. Pro Learning & Tutorials Banner */}
          <TouchableOpacity 
            style={styles.proBannerContainer}
            onPress={() => this.showNextVersionAlert("Navigate to Video Tutorials Page")}
            activeOpacity={0.9}
          >






<TouchableOpacity 
  style={styles.heroBannerCard} 
onPress={() => this.props.navigation.navigate('VideosScreen')}
  activeOpacity={0.95}



>
  {/* बैकग्राउंड इमेज या थंबनेल */}
  <Image 
    source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' }} 
    style={styles.heroBannerImage} 
  />
  
  {/* डार्क ग्रेडिएंट ओवरले ताकि टेक्स्ट और ज्यादा चमक कर दिखे */}
  <View style={styles.heroOverlay}>
    
    {/* ऊपर का छोटा प्रीमियम बैज */}
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

    {/* मुख्य टाइटल और विवरण */}
    <View style={styles.heroContentArea}>
      <Text style={styles.heroTitle}>Master Video Editing & App UI Design</Text>
      <Text style={styles.heroSubtitle}>प्रिंसिपल ट्यूटोरियल देखें और प्रो क्रिएटर बनें।</Text>
    </View>

    {/* नीचे का एक्शन बटन */}
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
</TouchableOpacity>/\


















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
                <Ionicons name="flame" size={11} color="#ce352d" />
                <Text style={styles.trendingBadgeText}> Hot Today</Text>
              </View>
              <Text style={styles.trendingTitle}>4K Ultra HD Wallpapers</Text>
              <Text style={styles.trendingDesc}>Handpicked collections updated every single hour.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#8E8E93" />
          </TouchableOpacity>









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

        {/* --- CUSTOM PROFESSIONAL SIDE DRAWER / MODAL MENU --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isMenuOpen}
          onRequestClose={() => this.setState({ isMenuOpen: false })}
        >
          <View style={styles.drawerOverlay}>
            <TouchableOpacity 
              style={styles.drawerBackdropDismiss} 
              activeOpacity={1}
              onPress={() => this.setState({ isMenuOpen: false })}
            />

            <View style={styles.drawerPanel}>
              
              {/* Professional Profile Section with Logo & Introduction */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerAvatarContainer}>
                  <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.drawerUserName}>PRABHAWATI-P</Text>
                <Text style={styles.drawerUserWelcome}>Lead Developer & Creator</Text>
                <Text style={styles.drawerUserBio}>
                  Specialized in building high-end applications, custom software, UI/UX design, and professional developer tools.
                </Text>
                <View style={styles.drawerDividerLine} />
              </View>

              {/* शानदार प्रोफेशनल ऑप्शंस और सेटिंग्स जोड़े गए */}
              <View style={styles.drawerMenuLinks}>
                






















<TouchableOpacity 
  style={styles.drawerCard}
  activeOpacity={0.8}
  onPress={() => {
    this.setState({ isMenuOpen: false });
    this.props.navigation.navigate('ProScreen'); // 👈 यहाँ से सीधे प्रो / पेमेंट वाला पेज खुल जाएगा
  }}
>
  <View style={styles.drawerCardIconBox}>
    <Ionicons name="diamond" size={20} color="#A78BFA" />
  </View>
  <View style={{ flex: 1, marginLeft: 12 }}>
    <Text style={styles.drawerCardTitle}>Go Premium</Text>
    <Text style={styles.drawerCardDesc}>Unlock all features & exclusive tools</Text>
  </View>
  <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
</TouchableOpacity>























                <TouchableOpacity 
                  style={styles.drawerCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    this.setState({ isMenuOpen: false });
                    this.showNextVersionAlert("Settings");
                  }}
                >
                  <View style={styles.drawerCardIconBox}>
                    <Ionicons name="settings" size={20} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.drawerCardTitle}>Settings</Text>
                    <Text style={styles.drawerCardDesc}>Customize your app experience</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    this.setState({ isMenuOpen: false });
                    this.showNextVersionAlert("Creator Analytics");
                  }}
                >
                  <View style={styles.drawerCardIconBox}>
                    <Ionicons name="stats-chart" size={20} color="#10B981" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.drawerCardTitle}>Analytics</Text>
                    <Text style={styles.drawerCardDesc}>Track performance & insights</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    this.setState({ isMenuOpen: false });
                    this.showNextVersionAlert("Developer Hub");
                  }}
                >
                  <View style={styles.drawerCardIconBox}>
                    <Ionicons name="code-slash" size={20} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.drawerCardTitle}>Developer Hub</Text>
                    <Text style={styles.drawerCardDesc}>API integrations & tools</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
                </TouchableOpacity>

              </View>

            </View>
          </View>
        </Modal>

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
  
  categoriesRow: { paddingBottom: 8 },
  categoryCard: { alignItems: 'center', marginRight: 15, width: 70 },
  categoryIconBox: { 
    width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1
  },
  categoryName: { fontSize: 11, color: '#3A3A3C', fontWeight: '500', textAlign: 'center' },

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

  proBannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#1b1b33',
    borderRadius: 20,
    padding: 18,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  proBannerContent: { flex: 1, paddingRight: 15 },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 149, 0, 0.15)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8,
  },
  proBadgeText: { fontSize: 10, fontWeight: '700', color: '#FF9500' },
  proBannerTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  proBannerSubtitle: { fontSize: 12, color: '#A0A0AB', marginBottom: 12, lineHeight: 16 },
  watchNowBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#007AFF',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    alignSelf: 'flex-start'
  },
  watchNowText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  proBannerGraphicBox: {
    width: 90, height: 90, backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  playIconButton: {
    width: 48, height: 48, backgroundColor: '#FFFFFF', borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },

  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
  },
  drawerBackdropDismiss: {
    flex: 1,
  },
  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.78,
    backgroundColor: '#0F0F1A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 24 : 54,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  drawerHeader: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  drawerAvatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  drawerUserName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  drawerUserWelcome: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 6,
  },
  drawerUserBio: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 16,
    marginBottom: 14,
  },
  drawerDividerLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  drawerMenuLinks: {
    marginTop: 5,
  },
  drawerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  drawerCardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  drawerCardDesc: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },













profileBtnContainer: {
  width: 35,
  height: 35,
  borderRadius: 21,
  backgroundColor: '#544174', // रिच पर्पल थीम
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#7C3AED',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  elevation: 6,
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.25)', // प्रीमियम फिनिशिंग बॉर्डर
  marginRight: 8,
},
profileInnerRing: {
  width: '100%',
  height: '100%',
  borderRadius: 21,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.1)', // हल्का डेप्थ इफ़ेक्ट
},





















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
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 25, 0.82)', // गहरा प्रीमियम शेड ताकि टेक्स्ट साफ़ दिखे
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

















profileInnerRing: {
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: '#4338CA',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden', // यह बहुत जरूरी है ताकि फोटो गोल आकार से बाहर न निकले
  borderWidth: 1.5,
  borderColor: '#E0E7FF',
},
headerProfileImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},
























});