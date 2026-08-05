import React, { Component } from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, 
  ScrollView, TextInput, Modal, Animated, ActivityIndicator, Vibration, Image, Dimensions 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');

export default class StickersGifsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedCategory: 'All',
      showModal: false,
      selectedItem: null,
      isDownloading: false,
      scaleAnim: new Animated.Value(0.4),
      opacityAnim: new Animated.Value(0),
      categories: ['All', 'Animated', 'Stickers', 'Memes', 'Emojis', 'Trending'],
      itemsData: [
        { 
          id: '1', 
          title: '🔥 Trendy Fire FX Animation', 
          category: 'Animated', 
          type: 'GIF', 
          author: 'Prabhavati Studios', 
          url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' 
        },
        { 
          id: '2', 
          title: '😂 Laughing Emoji Pro Sticker', 
          category: 'Stickers', 
          type: 'PNG', 
          author: 'EmojiLab', 
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60' 
        },
        { 
          id: '3', 
          title: '🚀 Rocket to the Moon Meme', 
          category: 'Memes', 
          type: 'GIF', 
          author: 'CryptoMeme', 
          url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif' 
        },
        { 
          id: '4', 
          title: '✨ Magical Sparkles Motion', 
          category: 'Animated', 
          type: 'GIF', 
          author: 'VFX Motion', 
          url: 'https://media.giphy.com/media/l0HlRnAWXxn0MhOBK/giphy.gif' 
        },
        { 
          id: '5', 
          title: '😎 Cool Boss Cat Sticker', 
          category: 'Stickers', 
          type: 'PNG', 
          author: 'DesignPro', 
          url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=60' 
        },
        { 
          id: '6', 
          title: '🎉 Party Celebration Confetti', 
          category: 'Trending', 
          type: 'GIF', 
          author: 'Eventify', 
          url: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif' 
        }
      ]
    };
  }

  componentDidMount() {
    this.unsubscribeFocus = this.props.navigation?.addListener('blur', () => {
      this.setState({ showModal: false });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
  }

  handleCardPress = (item) => {
    Vibration.vibrate(25);
    this.setState({ 
      selectedItem: item, 
      showModal: true 
    });

    this.state.scaleAnim.setValue(0.4);
    this.state.opacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(this.state.scaleAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
      Animated.timing(this.state.opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
  };

  closeModal = () => {
    Animated.timing(this.state.opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      this.setState({ showModal: false, selectedItem: null });
    });
  };

  handleBackPress = () => {
    this.setState({ showModal: false });
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
      const fileUri = FileSystem.documentDirectory + 'item_' + item.id + '.gif';
      const downloadRes = await FileSystem.downloadAsync(item.url, fileUri);
      if (downloadRes.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
        Vibration.vibrate(50);
        alert('सफलतापूर्वक गैलरी में सेव हो गया! 🌟');
      }
    } catch (error) {
      alert('डाउनलोड विफल रहा।');
    } finally {
      this.setState({ isDownloading: false });
    }
  };

  render() {
    const { searchQuery, selectedCategory, showModal, selectedItem, isDownloading, scaleAnim, opacityAnim, categories, itemsData } = this.state;
    
    const filtered = itemsData.filter(i => {
      const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="light-content" backgroundColor="#030712" />
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={this.handleBackPress}>
              <Feather name="arrow-left" size={20} color="#F9FAFB" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Stickers & GIFs Pro</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#38BDF8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Search modern stickers & GIFs..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={(t) => this.setState({ searchQuery: t })}
            />
          </View>

          {/* Categories */}
          <View style={{ height: 42, marginBottom: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
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

          {/* Grid List */}
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.gridContainer}>
              {filtered.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.mediaCard} 
                  activeOpacity={0.9} 
                  onPress={() => this.handleCardPress(item)}
                >
                  <View style={styles.thumbnailBox}>
                    <Image source={{ uri: item.url }} style={styles.gridImage} resizeMode="cover" />
                    <View style={styles.badgeBox}>
                      <Text style={styles.badgeText}>{item.type}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardSub}>{item.category} • {item.author}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Preview Modal */}
        <Modal visible={showModal} transparent={true} animationType="none" onRequestClose={this.closeModal}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.modalBox, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity style={styles.closeModalBtn} onPress={this.closeModal}>
                <Ionicons name="close" size={20} color="#FFF" />
              </TouchableOpacity>

              {selectedItem && (
                <Image source={{ uri: selectedItem.url }} style={styles.modalImagePreview} resizeMode="contain" />
              )}

              <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
              <Text style={styles.modalSub}>Creator: {selectedItem?.author}</Text>

              <TouchableOpacity style={styles.actionBtn} onPress={() => this.downloadItem(selectedItem)} disabled={isDownloading}>
                {isDownloading ? <ActivityIndicator size="small" color="#030712" /> : (
                  <>
                    <Ionicons name="cloud-download" size={18} color="#030712" style={{ marginRight: 8 }} />
                    <Text style={styles.actionBtnText}>Download to Gallery</Text>
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
  wrapper: { flex: 1, backgroundColor: '#030712' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 35, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  headerTitle: { color: '#F9FAFB', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', marginHorizontal: 20, marginBottom: 12, marginTop: 14, borderRadius: 14, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.2)' },
  input: { flex: 1, color: '#F9FAFB', fontSize: 14 },
  catChip: { paddingHorizontal: 16, height: 34, borderRadius: 10, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  catChipActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4 },
  catText: { color: '#9CA3AF', fontSize: 12, fontWeight: '700' },
  catTextActive: { color: '#030712', fontWeight: '900' },
  scroll: { padding: 20, paddingTop: 4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  mediaCard: { width: (width - 50) / 2, backgroundColor: '#111827', borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  thumbnailBox: { width: '100%', height: 140, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' },
  gridImage: { width: '100%', height: '100%' },
  badgeBox: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(3, 7, 18, 0.75)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)' },
  badgeText: { color: '#38BDF8', fontSize: 10, fontWeight: '800' },
  cardFooter: { padding: 10, backgroundColor: '#0B0F19' },
  cardTitle: { color: '#F9FAFB', fontSize: 13, fontWeight: '800', marginBottom: 2 },
  cardSub: { color: '#9CA3AF', fontSize: 10 },
  overlay: { flex: 1, backgroundColor: 'rgba(3, 7, 18, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', maxWidth: 330, backgroundColor: '#0B0F19', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.4)', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  closeModalBtn: { position: 'absolute', top: 12, right: 12, zIndex: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  modalImagePreview: { width: '100%', height: 220, borderRadius: 14, backgroundColor: '#000', marginBottom: 14 },
  modalTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  modalSub: { color: '#9CA3AF', fontSize: 11, textAlign: 'center', marginBottom: 16 },
  actionBtn: { backgroundColor: '#38BDF8', height: 46, borderRadius: 14, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  actionBtnText: { color: '#030712', fontSize: 14, fontWeight: '900' }
});