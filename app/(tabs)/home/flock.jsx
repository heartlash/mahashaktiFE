import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FlockScreen from '@/components/flock/FlockScreen';

const Flock = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
        <FlockScreen/>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Flock

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 35
  },
});