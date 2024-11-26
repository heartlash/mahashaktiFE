import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedCompositionScreen from '@/components/FeedComposition/FeedCompositionScreen';

const feedComposition = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FeedCompositionScreen />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default feedComposition

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 30
  },
});