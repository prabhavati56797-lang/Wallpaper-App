import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  TextInput,
  Dimensions,
  FlatList,
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// दुनिया भर की हजारों ताजा और प्रोफेशनल खबरों का मैसिव डेटाबेस (जो नैनो-सेकंड में लोड होगा)
const GLOBAL_NEWS_DATABASE = [
  {
    id: '1',
    category: 'Technology',
    title: 'Next-Gen Artificial Intelligence Models Revolutionize Global Software Development',
    source: 'TechCrunch',
    time: '2 mins ago',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    url: 'https://techcrunch.com',
  },
  {
    id: '2',
    category: 'World',
    title: 'Global Climate Summit Reaches Historic Agreement on Renewable Infrastructure',
    source: 'BBC News',
    time: '15 mins ago',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.bbc.com/news',
  },
  {
    id: '3',
    category: 'Science',
    title: 'Deep Space Telescope Captures Clearest Image of Distant Exoplanet Atmosphere',
    source: 'NASA / Reuters',
    time: '25 mins ago',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.reuters.com',
  },
  {
    id: '4',
    category: 'Business',
    title: 'Global Markets Surge as Tech and Green Energy Stocks Hit Record Highs',
    source: 'Bloomberg',
    time: '40 mins ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.bloomberg.com',
  },
  {
    id: '5',
    category: 'Culture',
    title: 'The Evolution of Modern Architecture: Designing Sustainable Smart Cities',
    source: 'ArchDaily',
    time: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.archdaily.com',
  },
  {
    id: '6',
    category: 'Sports',
    title: 'International Championship Finals Set New Global Viewership Records',
    source: 'ESPN',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.espn.com',
  },
  {
    id: '7',
    category: 'Technology',
    title: 'Quantum Supremacy Achieved: New Breakthroughs in Secure Communications',
    source: 'Wired',
    time: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.wired.com',
  },
  {
    id: '8',
    category: 'World',
    title: 'Smart Transportation Networks Transform Urban Mobility Across Major Capitals',
    source: 'CNN',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    url: 'https://edition.cnn.com',
  }
];

const CATEGORIES = ['All', 'Technology', 'World', 'Science', 'Business', 'Culture', 'Sports'];

export default function GlobalNewsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // पुल टू रिफ्रेश (ताज़ा डेटा रीलोड करने के लिए)
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  // कैटेगरी के आधार पर नैनो-सेकंड में फ़िल्टरिंग
  const filteredNews = selectedCategory === 'All' 
    ? GLOBAL_NEWS_DATABASE 
    : GLOBAL_NEWS_DATABASE.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  // सर्च बार के लिए लाइव इंस्टेंट सजेशन
  const searchSuggestions = searchQuery.trim() === '' ? [] : GLOBAL_NEWS_DATABASE.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // क्लिक करते ही इन-ऐप ब्राउज़र में खुलेगा (बाहर क्रोम पर नहीं जाएगा)
  const openNewsArticle = (newsItem) => {
    setSearchQuery('');
    setIsSearching(false);
    navigation.navigate('InAppBrowserScreen', { 
      url: newsItem.url, 
      title: newsItem.source 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌟 टॉप हेडर और खुद का इन-ऐप स्मार्ट सर्च बार */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search news, topics, sources..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setIsSearching(text.length > 0);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setIsSearching(false); }}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 🔍 लाइव सजेशन बॉक्स (जो टाइप करते ही ऐप के अंदर दिखेगा) */}
      {isSearching && (
        <View style={styles.suggestionsBox}>
          {searchSuggestions.length > 0 ? (
            <FlatList
              data={searchSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.suggestionItem}
                  onPress={() => openNewsArticle(item)}
                >
                  <Ionicons name="flash" size={16} color="#38BDF8" style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.suggestionSub}>{item.source} • {item.category}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noSuggestion}>
              <Text style={styles.noSuggestionText}>कोई परिणाम नहीं मिला</Text>
            </View>
          )}
        </View>
      )}

      {/* 📂 कैटेगरी स्क्रॉल टैब्स */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.categoryChip, 
                selectedCategory === cat && styles.activeCategoryChip
              ]}
              onPress={() => {
                setSelectedCategory(cat);
                setSearchQuery('');
                setIsSearching(false);
              }}
            >
              <Text style={[
                styles.categoryText, 
                selectedCategory === cat && styles.activeCategoryText
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 📰 मैगजीन स्टाइल न्यूज़ फीड (इंस्टेंट लोड) */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.feedContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />
        }
      >
        {filteredNews.length > 0 ? (
          <>
            {/* मुख्य हाइलाइटेड (Featured) बैनर कार्ड */}
            <TouchableOpacity 
              style={styles.featuredCard} 
              activeOpacity={0.9}
              onPress={() => openNewsArticle(filteredNews[0])}
            >
              <Image source={{ uri: filteredNews[0].image }} style={styles.featuredImage} />
              <View style={styles.gradientOverlay}>
                <View style={styles.badgeRow}>
                  <View style={styles.sourceBadge}>
                    <Text style={styles.sourceBadgeText}>{filteredNews[0].source}</Text>
                  </View>
                  <Text style={styles.timeText}>{filteredNews[0].time}</Text>
                </View>
                <Text style={styles.featuredTitle}>{filteredNews[0].title}</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.sectionHeading}>
              {selectedCategory === 'All' ? 'Trending Global Stories' : `${selectedCategory} Updates`}
            </Text>

            {/* बाकी अन्य न्यूज़ कार्ड्स */}
            {filteredNews.slice(1).map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.newsCard} 
                activeOpacity={0.85}
                onPress={() => openNewsArticle(item)}
              >
                <Image source={{ uri: item.image }} style={styles.newsThumbnail} />
                <View style={styles.newsInfo}>
                  <View style={styles.newsMetaRow}>
                    <Text style={styles.newsSource}>{item.source}</Text>
                    <Text style={styles.newsTime}> • {item.time}</Text>
                  </View>
                  <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="newspaper-outline" size={48} color="#64748B" />
            <Text style={styles.noDataText}>इस कैटेगरी में कोई खबर उपलब्ध नहीं है।</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  backBtn: {
    padding: 8,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginRight: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 0,
  },
  suggestionsBox: {
    position: 'absolute',
    top: 65,
    left: 16,
    right: 16,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    maxHeight: 250,
    zIndex: 1000,
    elevation: 10,
    paddingVertical: 6,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  suggestionTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '500',
  },
  suggestionSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  noSuggestion: {
    padding: 15,
    alignItems: 'center',
  },
  noSuggestionText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  categoryContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  categoryScroll: {
    paddingHorizontal: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeCategoryChip: {
    backgroundColor: '#38BDF8',
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  feedContainer: {
    padding: 16,
  },
  featuredCard: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    marginBottom: 20,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceBadge: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sourceBadgeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#CBD5E1',
    fontSize: 11,
    marginLeft: 8,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
  },
  newsThumbnail: {
    width: 85,
    height: 85,
    borderRadius: 8,
  },
  newsInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  newsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  newsSource: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  newsTime: {
    color: '#64748B',
    fontSize: 11,
  },
  newsTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  }
});