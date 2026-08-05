import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

export default class InstagramScreen extends Component {
  state = { isLoading: true };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation?.goBack();
      return true;
    });
  }

  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation?.goBack()}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Instagram Reels</Text>
            <View style={{ width: 40 }} />
          </View>

          {this.state.isLoading && (
            <ActivityIndicator size="large" color="#E1306C" style={styles.loader} />
          )}

          <WebView 
            source={{ uri: 'https://www.instagram.com' }} 
            style={styles.webview} 
            onLoadEnd={() => this.setState({ isLoading: false })}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 35, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#161616', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  webview: { flex: 1, backgroundColor: '#000000' },
  loader: { position: 'absolute', top: '50%', left: 0, right: 0, zIndex: 10 }
});