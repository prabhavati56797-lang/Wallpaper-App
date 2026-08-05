import React, { Component } from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, 
  ScrollView, TextInput, Modal, Animated, ActivityIndicator, Vibration 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default class BackgroundMusicScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedCategory: 'All',
      showModal: false,
      selectedMusic: null,
      sound: null,
      isPlaying: false,
      isDownloading: false,
      scaleAnim: new Animated.Value(0.4),
      opacityAnim: new Animated.Value(0),
      categories: ['All', 'Corporate', 'Lo-Fi', 'Cinematic', 'Electronic'],
      musicData: [
        { id: '1', title: 'Upbeat Corporate Electronic', category: 'Corporate', duration: '2:30', artist: 'Prabhavati Audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: '2', title: 'Ambient Chillout Lo-Fi', category: 'Lo-Fi', duration: '3:15', artist: 'Aura Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: '3', title: 'Inspirational Cinematic Piano', category: 'Cinematic', duration: '2:45', artist: 'Epic Sounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { id: '4', title: 'Future Bass Electronic vibe', category: 'Electronic', duration: '2:10', artist: 'Neon Pulse', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      ]
    };
  }

  // जब भी यूजर इस पेज से बाहर जाएगा, गाना 100% बंद हो जाएगा
  async componentوWillUnmount() {
    await this.stopAndUnloadAudio();
  }

  componentDidMount() {
    // React Navigation के listener का उपयोग करके पेज बदलने पर गाना बंद करना
    this.unsubscribeFocus = this.props.navigation?.addListener('blur', async () => {
      await this.stopAndUnloadAudio();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
    this.stopAndUnloadAudio();
  }

  // ऑडियो रोकने और मेमोरी खाली करने का मास्टर फंक्शन
  stopAndUnloadAudio = async () => {
    try {
      if (this.state.sound) {
        await this.state.sound.stopAsync();
        await this.state.sound.unloadAsync();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ sound: null, isPlaying: false, showModal: false, selectedMusic: null });
    }
  };

  // एक क्लिक पर प्ले और दोबारा क्लिक पर बंद होने वाला सटीक लॉजिक
  handleCardPress = async (item) => {
    Vibration.vibrate(25);
    try {
      const { sound, selectedMusic, isPlaying } = this.state;

      // स्थिति 1: अगर वही गाना पहले से चल रहा है, तो उसे बंद (Pause) कर दें
      if (sound && selectedMusic?.id === item.id) {
        if (isPlaying) {
          await sound.pauseAsync();
          this.setState({ isPlaying: false, showModal: false });
        } else {
          await sound.playAsync();
          this.setState({ isPlaying: true, showModal: true });
        }
        return;
      }

      // स्थिति 2: अगर कोई दूसरा पुराना गाना चल रहा है, तो उसे पूरी तरह बंद करके हटा दें
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // स्थिति 3: नया गाना लोड करें और प्ले करें
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: item.url }, 
        { shouldPlay: true }
      );

      this.setState({ 
        sound: newSound, 
        isPlaying: true, 
        showModal: true, 
        selectedMusic: item 
      });
      
      // स्मूथ पॉप-अप एनिमेशन
      this.state.scaleAnim.setValue(0.4);
      this.state.opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(this.state.scaleAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
        Animated.timing(this.state.opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true })
      ]).start();

    } catch (error) {
      alert('ऑडियो प्ले करने में समस्या आ रही है।');
    }
  };

  closeModal = async () => {
    Animated.timing(this.state.opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      this.setState({ showModal: false });
    });
  };

  // बैक बटन दबाने पर गाना बंद करके पीछे जाना
  handleBackPress = async () => {
    await this.stopAndUnloadAudio();
    this.props.navigation?.goBack();
  };

  downloadMusic = async (item) => {
    try {
      this.setState({ isDownloading: true });
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('गैलरी की अनुमति (Permission) आवश्यक है!');
        this.setState({ isDownloading: false });
        return;
      }
      const fileUri = FileSystem.documentDirectory + 'music_' + item.id + '.mp3';
      const downloadRes = await FileSystem.downloadAsync(item.url, fileUri);
      if (downloadRes.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
        Vibration.vibrate(50);
        alert('गाना सफलतापूर्वक गैलरी में सेव हो गया! 🎵');
      }
    } catch (error) {
      alert('डाउनलोड विफल रहा।');
    } finally {
      this.setState({ isDownloading: false });
    }
  };

  render() {
    const { searchQuery, selectedCategory, showModal, selectedMusic, isPlaying, isDownloading, scaleAnim, opacityAnim, categories, musicData } = this.state;
    
    const filtered = musicData.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="light-content" backgroundColor="#030712" />
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={this.handleBackPress}>
              <Feather name="arrow-left" size={22} color="#F9FAFB" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Background Music</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#6B7280" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Search Royalty-Free Tracks..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={(t) => this.setState({ searchQuery: t })}
            />
          </View>

          {/* Category Filter Pills */}
          <View style={{ height: 44, marginBottom: 10 }}>
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

          {/* Music List */}
          <ScrollView contentContainerStyle={styles.scroll}>
            {filtered.map((item) => {
              const isCurrentPlaying = selectedMusic?.id === item.id && isPlaying;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.musicCard, isCurrentPlaying && styles.activeMusicCard]} 
                  activeOpacity={0.85} 
                  onPress={() => this.handleCardPress(item)}
                >
                  <View style={styles.iconBox}>
                    <Ionicons name="musical-note" size={22} color="#38BDF8" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSub}>{item.artist} • {item.duration}</Text>
                  </View>
                  <View style={styles.dlIcon}>
                    <Ionicons name={isCurrentPlaying ? "pause-circle" : "play-circle"} size={30} color="#38BDF8" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>

        {/* Professional 3D Audio Player Modal */}
        <Modal visible={showModal} transparent={true} animationType="none" onRequestClose={this.closeModal}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.modalBox, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity style={styles.closeModalBtn} onPress={this.closeModal}>
                <Ionicons name="close" size={20} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.diskCircle}>
                <Ionicons name="musical-notes" size={42} color="#38BDF8" />
              </View>

              <Text style={styles.modalTitle}>{selectedMusic?.title}</Text>
              <Text style={styles.modalSub}>Artist: {selectedMusic?.artist} ({selectedMusic?.category})</Text>

              <TouchableOpacity style={styles.actionBtn} onPress={() => this.downloadMusic(selectedMusic)} disabled={isDownloading}>
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
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  headerTitle: { color: '#F9FAFB', fontSize: 18, fontWeight: '800' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', marginHorizontal: 20, marginBottom: 12, marginTop: 16, borderRadius: 14, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  input: { flex: 1, color: '#F9FAFB', fontSize: 14 },
  catChip: { paddingHorizontal: 16, height: 34, borderRadius: 10, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  catChipActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  catText: { color: '#9CA3AF', fontSize: 13, fontWeight: '700' },
  catTextActive: { color: '#030712', fontWeight: '900' },
  scroll: { padding: 20, paddingTop: 10 },
  musicCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B0F19', padding: 14, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  activeMusicCard: { borderColor: '#38BDF8', backgroundColor: '#0E1726' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(56, 189, 248, 0.15)', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  cardSub: { color: '#9CA3AF', fontSize: 12 },
  dlIcon: { justifyContent: 'center', alignItems: 'center', paddingLeft: 10 },
  overlay: { flex: 1, backgroundColor: 'rgba(3, 7, 18, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', maxWidth: 360, backgroundColor: '#0B0F19', borderRadius: 28, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.4)' },
  closeModalBtn: { position: 'absolute', top: 14, right: 14, zIndex: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  diskCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(56, 189, 248, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#38BDF8' },
  modalTitle: { color: '#F9FAFB', fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  modalSub: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginBottom: 20 },
  actionBtn: { backgroundColor: '#38BDF8', height: 48, borderRadius: 14, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#030712', fontSize: 15, fontWeight: '900' }
});