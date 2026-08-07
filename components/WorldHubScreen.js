import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, BackHandler
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  state = {
    searchQuery: '',                 
    categorySearchQuery: '',         
    selectedCategory: null,          
    selectedServiceUrl: '',          
    selectedServiceName: '',         
    navigationStack: ['home'],       

    // कुल 40 चुनिंदा कैटेगरीज
    categoriesData: [
      { id: '1', title: 'Websites & Web Platforms', icon: 'globe', color: '#2563eb', services: [{ name: 'Google', url: 'https://www.google.com', desc: 'World Search Engine' }, { name: 'Wikipedia', url: 'https://www.wikipedia.org', desc: 'Free Encyclopedia' }] },
      { id: '2', title: 'Mobile Apps', icon: 'mobile-alt', color: '#7c3aed', services: [{ name: 'Apkpure', url: 'https://apkpure.com', desc: 'App Alternatives' }, { name: 'Uptodown', url: 'https://en.uptodown.com', desc: 'Download Apps' }] },
      { id: '3', title: 'Desktop Software', icon: 'desktop', color: '#db2777', services: [{ name: 'FileHippo', url: 'https://filehippo.com', desc: 'Software Downloads' }, { name: 'Softpedia', url: 'https://www.softpedia.com', desc: 'Drivers & Tools' }] },
      { id: '4', title: 'AI & Artificial Intelligence', icon: 'brain', color: '#059669', services: [{ name: 'ChatGPT', url: 'https://chatgpt.com', desc: 'OpenAI Assistant' }, { name: 'Claude AI', url: 'https://claude.ai', desc: 'Anthropic AI' }] },
      { id: '5', title: 'Search Engines & Discovery', icon: 'search', color: '#3b82f6', services: [{ name: 'Google Search', url: 'https://www.google.com', desc: 'Global Search' }, { name: 'DuckDuckGo', url: 'https://duckduckgo.com', desc: 'Private Search' }] },
      { id: '6', title: 'Social Media & Communities', icon: 'users', color: '#ef4444', services: [{ name: 'Instagram', url: 'https://www.instagram.com', desc: 'Photos & Videos' }, { name: 'Twitter / X', url: 'https://twitter.com', desc: 'Microblogging' }] },
      { id: '7', title: 'Communication & Messaging', icon: 'comments', color: '#22c55e', services: [{ name: 'WhatsApp Web', url: 'https://web.whatsapp.com', desc: 'Instant Chat' }, { name: 'Zoom', url: 'https://zoom.us', desc: 'Video Meetings' }] },
      { id: '8', title: 'Video, Audio & Streaming', icon: 'film', color: '#10b981', services: [{ name: 'YouTube', url: 'https://m.youtube.com', desc: 'Videos' }, { name: 'Spotify', url: 'https://open.spotify.com', desc: 'Music' }] },
      { id: '9', title: 'News & Publishing', icon: 'newspaper', color: '#f59e0b', services: [{ name: 'BBC News', url: 'https://www.bbc.com/news', desc: 'Global News' }, { name: 'TechCrunch', url: 'https://techcrunch.com', desc: 'Tech News' }] },
      { id: '10', title: 'Gaming & Esports', icon: 'gamepad', color: '#facc15', services: [{ name: 'Twitch', url: 'https://www.twitch.tv', desc: 'Live Streams' }, { name: 'IGN', url: 'https://www.ign.com', desc: 'Gaming Portal' }] },
      { id: '11', title: 'E-Commerce & Online Shopping', icon: 'shopping-cart', color: '#6366f1', services: [{ name: 'Amazon', url: 'https://www.amazon.in', desc: 'Online Store' }, { name: 'Flipkart', url: 'https://www.flipkart.com', desc: 'Shopping' }] },
      { id: '12', title: 'Marketplaces & Classifieds', icon: 'store', color: '#ec4899', services: [{ name: 'OLX', url: 'https://www.olx.in', desc: 'Buy & Sell' }, { name: 'eBay', url: 'https://www.ebay.com', desc: 'Global Marketplace' }] },
      { id: '13', title: 'Banking & Financial Services', icon: 'wallet', color: '#14b8a6', services: [{ name: 'SBI', url: 'https://retail.onlinesbi.sbi', desc: 'Net Banking' }, { name: 'HDFC', url: 'https://www.hdfcbank.com', desc: 'Banking' }] },
      { id: '14', title: 'Payments & FinTech', icon: 'rupee-sign', color: '#8b5cf6', services: [{ name: 'PayPal', url: 'https://www.paypal.com', desc: 'Global Payments' }, { name: 'Razorpay', url: 'https://razorpay.com', desc: 'Fintech' }] },
      { id: '15', title: 'Business & Enterprise', icon: 'briefcase', color: '#dc2626', services: [{ name: 'LinkedIn', url: 'https://www.linkedin.com', desc: 'Professional Network' }, { name: 'Crunchbase', url: 'https://www.crunchbase.com', desc: 'Business Data' }] },
      { id: '16', title: 'Productivity & Collaboration', icon: 'tasks', color: '#06b6d4', services: [{ name: 'Notion', url: 'https://www.notion.so', desc: 'Notes & Workspace' }, { name: 'Trello', url: 'https://trello.com', desc: 'Project Management' }] },
      { id: '17', title: 'Education & E-Learning', icon: 'graduation-cap', color: '#3b82f6', services: [{ name: 'Udemy', url: 'https://www.udemy.com', desc: 'Online Courses' }, { name: 'Coursera', url: 'https://www.coursera.org', desc: 'Global Learning' }] },
      { id: '18', title: 'Healthcare & Medical', icon: 'heartbeat', color: '#f97316', services: [{ name: 'Tata 1mg', url: 'https://www.1mg.com', desc: 'Medicines' }, { name: 'Practo', url: 'https://www.practo.com', desc: 'Doctor Consult' }] },
      { id: '19', title: 'Government & Public Services', icon: 'landmark', color: '#eab308', services: [{ name: 'UIDAI', url: 'https://uidai.gov.in', desc: 'Aadhaar Portal' }, { name: 'DigiLocker', url: 'https://www.digilocker.gov.in', desc: 'Documents' }] },
      { id: '20', title: 'Travel & Transportation', icon: 'plane', color: '#10b981', services: [{ name: 'IRCTC', url: 'https://www.irctc.co.in', desc: 'Train Booking' }, { name: 'MakeMyTrip', url: 'https://www.makemytrip.com', desc: 'Travel' }] },
      { id: '21', title: 'Food & Delivery', icon: 'utensils', color: '#ef4444', services: [{ name: 'Zomato', url: 'https://www.zomato.com', desc: 'Food Delivery' }, { name: 'Swiggy', url: 'https://www.swiggy.com', desc: 'Food & Groceries' }] },
      { id: '22', title: 'Real Estate & Property', icon: 'building', color: '#6366f1', services: [{ name: '99acres', url: 'https://www.99acres.com', desc: 'Properties' }, { name: 'MagicBricks', url: 'https://www.magicbricks.com', desc: 'Real Estate' }] },
      { id: '23', title: 'Jobs, Careers & Freelancing', icon: 'user-tie', color: '#14b8a6', services: [{ name: 'Naukri', url: 'https://www.naukri.com', desc: 'Job Portal' }, { name: 'Upwork', url: 'https://www.upwork.com', desc: 'Freelance' }] },
      { id: '24', title: 'Marketing, Advertising & Sales', icon: 'bullhorn', color: '#f59e0b', services: [{ name: 'HubSpot', url: 'https://www.hubspot.com', desc: 'Marketing' }, { name: 'Mailchimp', url: 'https://mailchimp.com', desc: 'Email Campaigns' }] },
      { id: '25', title: 'Design, Creative & Media Tools', icon: 'paint-brush', color: '#ec4899', services: [{ name: 'Canva', url: 'https://www.canva.com', desc: 'Graphic Design' }, { name: 'Figma', url: 'https://www.figma.com', desc: 'UI/UX Design' }] },
      { id: '26', title: 'Cloud, Servers & Computing', icon: 'server', color: '#7c3aed', services: [{ name: 'AWS', url: 'https://aws.amazon.com', desc: 'Cloud Services' }, { name: 'Vercel', url: 'https://vercel.com', desc: 'Hosting' }] },
      { id: '27', title: 'Internet, Networks & Connectivity', icon: 'network-wired', color: '#38bdf8', services: [{ name: 'Speedtest', url: 'https://www.speedtest.net', desc: 'Internet Speed' }, { name: 'Cloudflare', url: 'https://www.cloudflare.com', desc: 'DNS & Security' }] },
      { id: '28', title: 'Cybersecurity, Privacy & Identity', icon: 'shield-alt', color: '#059669', services: [{ name: 'VirusTotal', url: 'https://www.virustotal.com', desc: 'Scan Files' }, { name: 'Proton', url: 'https://proton.me', desc: 'Encrypted Mail' }] },
      { id: '29', title: 'Developer Tools, APIs & Open Source', icon: 'laptop-code', color: '#475569', services: [{ name: 'GitHub', url: 'https://github.com', desc: 'Code Repositories' }, { name: 'StackOverflow', url: 'https://stackoverflow.com', desc: 'Dev Community' }] },
     
    
    
    
    
    
    
    
    
    
    ]
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  handleBackButton = () => {
    const { navigationStack } = this.state;
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      const lastScreen = newStack[newStack.length - 1];

      if (lastScreen === 'home') {
        this.setState({
          navigationStack: ['home'],
          selectedCategory: null,
          selectedServiceUrl: '',
          categorySearchQuery: '',
        });
      } else if (lastScreen === 'category') {
        this.setState({
          navigationStack: newStack,
          selectedServiceUrl: '',
          categorySearchQuery: '',
        });
      }
      return true;
    }
    return false;
  };

  goHome = () => {
    this.setState({
      selectedCategory: null,
      selectedServiceUrl: '',
      searchQuery: '',
      categorySearchQuery: '',
      navigationStack: ['home']
    });
  };

  openWebSearch = (query) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    this.setState({
      selectedServiceUrl: searchUrl,
      selectedServiceName: `Search: ${query}`,
      navigationStack: [...this.state.navigationStack, 'webview']
    });
  };

  render() {
    const { 
      searchQuery, 
      categorySearchQuery,
      categoriesData, 
      selectedCategory, 
      selectedServiceUrl, 
      selectedServiceName 
    } = this.state;

    // 1. WebView Screen
    if (selectedServiceUrl) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.browserHeader}>
            <TouchableOpacity onPress={() => this.handleBackButton()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{selectedServiceName}</Text>
            <TouchableOpacity onPress={this.goHome}>
              <Ionicons name="home" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
          <WebView source={{ uri: selectedServiceUrl }} style={{ flex: 1, backgroundColor: '#0f172a' }} />
        </SafeAreaView>
      );
    }

    // 2. Category Detail Screen
    if (selectedCategory) {
      const filteredServices = selectedCategory.services.filter(srv =>
        srv.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
        srv.desc.toLowerCase().includes(categorySearchQuery.toLowerCase())
      );

      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.browserHeader}>
            <TouchableOpacity onPress={() => this.handleBackButton()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{selectedCategory.title}</Text>
            <TouchableOpacity onPress={this.goHome}>
              <Ionicons name="home" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.categorySearchWrapper}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                placeholder={`Search inside ${selectedCategory.title}...`}
                placeholderTextColor="#64748b"
                style={styles.searchInput}
                value={categorySearchQuery}
                onChangeText={(text) => this.setState({ categorySearchQuery: text })}
              />
              {categorySearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => this.setState({ categorySearchQuery: '' })}>
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.listContainer}>
            <Text style={styles.subHeaderTitle}>Available Platforms & Tools</Text>
            
            {filteredServices.length > 0 ? (
              filteredServices.map((srv, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.serviceItemCard}
                  onPress={() => this.setState({ 
                    selectedServiceUrl: srv.url, 
                    selectedServiceName: srv.name,
                    navigationStack: [...this.state.navigationStack, 'webview']
                  })}
                >
                  <View style={[styles.serviceIconBox, { backgroundColor: selectedCategory.color + '20' }]}>
                    <FontAwesome5 name={selectedCategory.icon || 'link'} size={18} color={selectedCategory.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.serviceItemTitle}>{srv.name}</Text>
                    <Text style={styles.serviceItemDesc}>{srv.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#64748b" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultBox}>
                <Text style={styles.noResultText}>No matching platform found.</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    }

    // 3. Main Home Screen (Full ScrollView with 40 Categories)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* ग्लोबल सर्च बार */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                placeholder="Search any app, website or tool in the world..."
                placeholderTextColor="#64748b"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(text) => this.setState({ searchQuery: text })}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => this.setState({ searchQuery: '' })}>
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* यदि लिस्ट में न मिले तो Google डायरेक्ट सर्च */}
          {searchQuery.length > 0 && (
            <View style={{ paddingHorizontal: 16, marginBottom: 15 }}>
              <TouchableOpacity 
                style={styles.webSearchPromptCard}
                onPress={() => this.openWebSearch(searchQuery)}
              >
                <Ionicons name="globe-outline" size={20} color="#38bdf8" />
                <Text style={styles.webSearchPromptText}>Search "{searchQuery}" on Google / Web</Text>
                <Ionicons name="arrow-forward" size={16} color="#38bdf8" />
              </TouchableOpacity>
            </View>
          )}

          {/* बैनर कार्ड */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerCard}>
              <Text style={styles.bannerSubText}>ULTIMATE DIGITAL EXPLORER</Text>
              <Text style={styles.bannerTitle}>Explore All 40 Digital Categories</Text>
              <Text style={styles.bannerDesc}>Access official web platforms, apps, AI tools, and global services securely inside one app.</Text>
            </View>
          </View>

          {/* 40 कैटेगरीज की हेडिंग */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse All 40 Categories</Text>
          </View>

          {/* 40 कैटेगरीज ग्रिड (ScrollView के अंदर सुरक्षित) */}
          <View style={styles.gridContainer}>
            {categoriesData.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.categoryCard}
                onPress={() => {
                  this.setState({ 
                    selectedCategory: item,
                    categorySearchQuery: '',
                    navigationStack: [...this.state.navigationStack, 'category']
                  });
                }}
              >
                <View style={[styles.gridIconBox, { backgroundColor: item.color + '20' }]}>
                  <FontAwesome5 name={item.icon} size={16} color={item.color} />
                </View>
                <Text style={styles.categoryCardText} numberOfLines={2}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 35,
  },
  categorySearchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#f8fafc',
  },
  webSearchPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  webSearchPromptText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#38bdf8',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  bannerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerSubText: {
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: 1,
    fontWeight: '600',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  bannerDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  gridContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
    flex: 1,
  },
  browserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 35,
    backgroundColor: '#1e293b',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  subHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
  },
  listContainer: {
    padding: 16,
  },
  serviceItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  serviceItemDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  noResultBox: {
    padding: 20,
    alignItems: 'center',
  },
  noResultText: {
    color: '#94a3b8',
    fontSize: 13,
  }
});
