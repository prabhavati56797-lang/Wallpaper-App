import React, { Component } from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, 
  ScrollView, TextInput, Modal, Animated, ActivityIndicator, Vibration, Dimensions, ImageBackground, BackHandler 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width } = Dimensions.get('window');

export default class GridCardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedCategory: 'All',
      showModal: false,
      selectedItem: null,
      isPlaying: false,
      isDownloading: false,
      fadeAnim: new Animated.Value(0),
      categories: ['All', 'Animations', 'Stickers', 'Memes', 'Effects'],
      itemsData: [
        { 
          id: '1', 
          title: 'Trendy Fire FX Animation', 
          type: 'GIF', 
          category: 'Effects',
          author: 'Prabhavati Studios', 
          thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-river-in-the-forest-41585-large.mp4' 
        },
        { 
          id: '2', 
          title: 'Laughing Emoji Pro Sticker', 
          type: 'PNG', 
          category: 'Stickers',
          author: 'EmojiLab', 
          thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31936-large.mp4' 
        },
        { 
          id: '3', 
          title: 'Rocket to the Moon Meme', 
          type: 'GIF', 
          category: 'Memes',
          author: 'CryptoMeme', 
          thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4' 
        },
        { 
          id: '4', 
          title: 'Magical Sparkles Motion', 
          type: 'GIF', 
          category: 'Animations',
          author: 'VFX Motion', 
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-traffic-crossing-a-roundabout-41617-large.mp4' 
        },
        { 
          id: '5', 
          title: 'Cool Boss Cat Sticker', 
          type: 'PNG', 
          category: 'Stickers',
          author: 'DesignPro', 
          thumbnail: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-palm-trees-against-a-blue-sky-1175-large.mp4' 
        },
        { 
          id: '6', 
          title: 'Party Celebration Confetti', 
          type: 'GIF', 
          category: 'Animations',
          author: 'Eventify', 
          thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-river-in-the-forest-41585-large.mp4' 
        }
      ]
    };
  }

  componentDidMount() {
    // हार्डवेयर बैक बटन ब्लॉक ताकि केवल तीर आइकॉन से ही बाहर जाया जा सके
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    this.unsubscribeFocus = this.props.navigation?.addListener('blur', () => {
      this.setState({ showModal: false, isPlaying: false });
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    });
  }

  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
    if (this.unsubscribeFocus) this.unsubscribeFocus();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  handleCardPress = (item) => {
    Vibration.vibrate(35);
    this.setState({ selectedItem: item, showModal: true, isPlaying: true });

    this.state.fadeAnim.setValue(0);
    Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  closeModal = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    this.setState({ showModal: false, selectedItem: null, isPlaying: false });
  };

  // सिर्फ यह तीर बटन ही स्क्रीन से बाहर ले जाएगा
  handleBackPress = () => {
    this.setState({ showModal: false, isPlaying: false });
    this.props.navigation?.goBack();
  };

  downloadItem = async (item) => {
    if (!item) return;
    try {
      this.setState({ isDownloading: true });
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('गैलरी की अनुमति (Permission) आवश्यक है!');
        this.setState({ isDownloading: false });
        return;
      }
      const fileUri = FileSystem.documentDirectory + 'media_' + item.id + '.mp4';
      const downloadRes = await FileSystem.downloadAsync(item.url, fileUri);
      if (downloadRes.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
        Vibration.vibrate(60);
        alert('फाइल सफलतापूर्वक गैलरी में सेव हो गई! 📥✨');
      }
    } catch (error) {
      alert('डाउनलोड विफल रहा।');
    } finally {
      this.setState({ isDownloading: false });
    }
  };

  render() {
    const { searchQuery, selectedCategory, showModal, selectedItem, isPlaying, isDownloading, fadeAnim, categories, itemsData } = this.state;
    
    const filtered = itemsData.filter(i => {
      const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <SafeAreaView style={{ flex: 1 }}>
          
          {/* टॉप हेडर जिसमें तीर (Back Arrow) आइकॉन है */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={this.handleBackPress}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Media Gallery</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* ब्लैक थीम सर्च बार */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Search GIFs, Stickers & Videos..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={(t) => this.setState({ searchQuery: t })}
            />
          </View>

          {/* कैटेगरी फ़िल्टर टैब्स */}
          <View style={{ height: 44, marginBottom: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {categories.map((cat, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                  onPress={() => this.setState({ selectedCategory: cat })}
                >
                  <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ग्रिड कार्ड्स लिस्ट (स्मूथ स्क्रॉलिंग) */}
          <ScrollView 
            contentContainerStyle={styles.scrollGrid} 
            showsVerticalScrollIndicator={false}
          >
            {filtered.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card} 
                activeOpacity={0.9} 
                onPress={() => this.handleCardPress(item)}
              >
                <ImageBackground source={{ uri: item.thumbnail }} style={styles.cardThumb} imageStyle={{ borderRadius: 16 }}>
                  
                  {/* GIF / PNG बैज (ऊपर दाएं कोने में) */}
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                  </View>

                </ImageBackground>

                {/* नीचे का टेक्स्ट और ऑथर विवरण */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardAuthor} numberOfLines={1}>{item.category} • {item.author}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>

        {/* वीडियो प्लेयर और डाउनलोड मॉडल */}
        <Modal visible={showModal} transparent={true} animationType="fade" onRequestClose={() => {}}>
          <View style={styles.modalBackdrop}>
            <Animated.View style={[styles.modalBox, { opacity: fadeAnim }]}>
              
              <TouchableOpacity style={styles.closeBtn} onPress={this.closeModal}>
                <Ionicons name="close" size={18} color="#FFF" />
              </TouchableOpacity>

              {/* रियल वीडियो प्लेयर */}
              {selectedItem && (
                <Video
                  source={{ uri: selectedItem.url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  shouldPlay={isPlaying}
                  isLooping
                  useNativeControls={true}
                  style={styles.videoPlayer}
                  onFullscreenUpdate={async ({ fullscreenUpdate }) => {
                    if (fullscreenUpdate === 1 || fullscreenUpdate === 3) {
                      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                    } else if (fullscreenUpdate === 0 || fullscreenUpdate === 2) {
                      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                    }
                  }}
                />
              )}

              <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
              <Text style={styles.modalSub}>Source: {selectedItem?.author}</Text>

              <TouchableOpacity style={styles.downloadBtn} onPress={() => this.downloadItem(selectedItem)} disabled={isDownloading}>
                {isDownloading ? <ActivityIndicator size="small" color="#000" /> : (
                  <>
                    <Ionicons name="cloud-download" size={18} color="#000" style={{ marginRight: 8 }} />
                    <Text style={styles.downloadText}>Download File</Text>
                  </>
                )}
              </TouchableOpacity>

            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 35, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#161616', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121212', marginHorizontal: 16, marginVertical: 10, borderRadius: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: '#222' },
  input: { flex: 1, color: '#FFF', fontSize: 13, fontWeight: '500' },

  catChip: { paddingHorizontal: 14, height: 34, borderRadius: 10, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#222' },
  catChipActive: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  catText: { color: '#888888', fontSize: 12, fontWeight: '700' },
  catTextActive: { color: '#000000', fontWeight: '900' },
  
  scrollGrid: { padding: 16, paddingTop: 6 },
  
  card: { backgroundColor: '#121212', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1F1F1F' },
  cardThumb: { width: '100%', height: 160, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 10 },
  
  typeBadge: { backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  typeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  
  cardInfo: { padding: 12, backgroundColor: '#121212' },
  cardTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 3 },
  cardAuthor: { color: '#888888', fontSize: 11, fontWeight: '500' },
  
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { width: '100%', maxWidth: 350, backgroundColor: '#121212', borderRadius: 20, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  closeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  
  videoPlayer: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#000', marginBottom: 12 },
  modalTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  modalSub: { color: '#888888', fontSize: 11, textAlign: 'center', marginBottom: 16 },
  
  downloadBtn: { backgroundColor: '#FFFFFF', height: 46, borderRadius: 12, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  downloadText: { color: '#000000', fontSize: 13, fontWeight: '800' }
});