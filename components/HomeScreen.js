import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Platform
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- डमी डेटा (Dummy Data) ---
const categories = [
  { id: '1', title: 'Nature', icon: 'leaf', lib: MaterialCommunityIcons, color: '#4CAF50', uri: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '2', title: 'Abstract', icon: 'shape-triangle-plus', lib: MaterialCommunityIcons, color: '#9C27B0', uri: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '3', title: 'Technology', icon: 'monitor', lib: Feather, color: '#2196F3', uri: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '4', title: 'Animals', icon: 'paw', lib: FontAwesome5, color: '#FF9800', uri: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '5', title: 'Travel', icon: 'airplane', lib: Ionicons, color: '#03A9F4', uri: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '6', title: 'Architecture', icon: 'city-variant-outline', lib: MaterialCommunityIcons, color: '#673AB7', uri: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

const popularSearches = [
  { id: '1', title: 'Mountains', uri: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '2', title: 'City Lights', uri: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '3', title: 'Space', uri: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '4', title: 'Minimal', uri: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

// --- मुख्य HomeScreen कंपोनेंट ---
export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const showFeatureAlert = (featureName) => {
    Alert.alert(
      "🚀 Coming Soon",
      `"${featureName}" फीचर पर काम चल रहा है! यह ऐप के आगामी संस्करण में उपलब्ध होगा।`,
      [{ text: "ठीक है", style: "default" }]
    );
  };

  // --- कैटेगरीज पर क्लिक करने पर ImageDisplay पेज पर भेजना ---
  const renderCategory = (item) => {
    const IconLib = item.lib;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.categoryItem}
        onPress={() => {
          navigation.navigate('ImageDisplay', {
            photo: {
              title: item.title,
              src: { original: item.uri }
            }
          });
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
          <IconLib name={item.icon} size={28} color={item.color} />
        </View>
        <Text style={styles.categoryText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 1. Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuIcon} onPress={() => showFeatureAlert("मेनु")} >
            <Feather name="menu" size={24} color="#212121" />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>Image<Text style={styles.headerTitleBold}>Search</Text></Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => showFeatureAlert("नोटिफिकेशन फाइल")}>
              <Feather name="bell" size={22} color="#212121" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => showFeatureAlert("3D प्रोफाइल मेनू")}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>Search anything, discover everything</Text>

        {/* 3. Search Bar Section */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
            <TextInput
              placeholder="Search images, wallpapers, categories..."
              placeholderTextColor="#9E9E9E"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if(searchQuery) {
                  navigation.navigate('ImageDisplay', {
                    photo: { title: searchQuery, src: { original: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' } }
                  });
                }
              }}
            />
          </View>
          <TouchableOpacity style={styles.aiButton} onPress={() => showFeatureAlert("AI Search")}>
            <MaterialCommunityIcons name="star-four-points" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* 4. Explore Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <TouchableOpacity onPress={() => Alert.alert("View All", "Loading all categories...")}>
            <Text style={styles.viewAll}>View All <Ionicons name="chevron-forward" size={12} /></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map(renderCategory)}
        </View>

        {/* 5. Featured Card Section */}
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => {
            navigation.navigate('ImageDisplay', {
              photo: {
                title: 'Featured Wallpaper',
                src: { original: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
              }
            });
          }}
        >
          <View style={styles.featuredTextContent}>
             <View style={styles.featuredBadge}>
                <Ionicons name="star-outline" size={12} color="#7B1FA2" />
                <Text style={styles.featuredBadgeText}> Featured</Text>
             </View>
            <Text style={styles.featuredTitle}>Discover High Quality Images</Text>
            <Text style={styles.featuredDesc}>Millions of stunning images at your fingertips.</Text>
            <View style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore Now</Text>
                <Ionicons name="chevron-forward" size={16} color="#FFF" style={{marginLeft: 5}}/>
            </View>
          </View>
          <View style={styles.featuredImageContainer}>
            <Image
              source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/abstract-gradient-cube-on-pedestal-10660194-8583656.png' }}
              style={styles.featuredImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* 6. Popular Searches Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}><MaterialCommunityIcons name="fire" size={18} color="#FF5722" /> Popular Searches</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularList}
        >
          {popularSearches.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.popularItem}
              onPress={() => {
                navigation.navigate('ImageDisplay', {
                  photo: {
                    title: item.title,
                    src: { original: item.uri }
                  }
                });
              }}
            >
              <ImageBackground
                source={{ uri: item.uri }}
                style={styles.popularImage}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.popularSearchIconBg}>
                   <Ionicons name="search" size={16} color="#FFF" />
                </View>
              </ImageBackground>
              <Text style={styles.popularText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={{height: 30}} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 5 },
  menuIcon: { padding: 5 },
  titleWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: '#212121', fontWeight: '400' },
  headerTitleBold: { fontWeight: '700', color: '#3F51B5' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8, marginRight: 5 },
  profileButton: { marginLeft: 5, padding: 2, borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 22 },
  profileImage: { width: 38, height: 38, borderRadius: 19 },
  subtitle: { fontSize: 14, color: '#757575', textAlign: 'center', marginTop: 5, marginBottom: 15 },
  searchWrapper: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 25 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, height: 55, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  searchIcon: { paddingHorizontal: 15 },
  searchInput: { flex: 1, fontSize: 14, color: '#212121' },
  aiButton: { backgroundColor: '#673AB7', width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#212121', flexDirection: 'row', alignItems: 'center' },
  viewAll: { fontSize: 13, color: '#673AB7', fontWeight: '600' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, marginBottom: 25 },
  categoryItem: { width: (width - 30) / 4, alignItems: 'center', marginBottom: 15 },
  iconContainer: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 11, color: '#424242', fontWeight: '600', textAlign: 'center' },
  featuredCard: { backgroundColor: '#E3F2FD', borderRadius: 20, flexDirection: 'row', padding: 20, marginHorizontal: 20, marginBottom: 30, height: 180 },
  featuredTextContent: { flex: 1, justifyContent: 'space-around' },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginBottom: 5 },
  featuredBadgeText: { color: '#7B1FA2', fontSize: 10, fontWeight: '700' },
  featuredTitle: { fontSize: 18, fontWeight: '800', color: '#1A237E', lineHeight: 24 },
  featuredDesc: { fontSize: 12, color: '#303F9F', marginTop: 5, marginBottom: 10 },
  exploreButton: { backgroundColor: '#673AB7', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  exploreButtonText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  featuredImageContainer: { width: '40%', justifyContent: 'center', alignItems: 'center' },
  featuredImage: { width: '150%', height: '150%', marginTop: -20, marginRight: -40 },
  popularList: { paddingLeft: 20, paddingRight: 10 },
  popularItem: { marginRight: 15, width: width * 0.35 },
  popularImage: { height: 140, width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 8 },
  popularSearchIconBg: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 6, borderRadius: 20 },
  popularText: { fontSize: 13, fontWeight: '600', color: '#424242', marginTop: 6, textAlign: 'center' }
});