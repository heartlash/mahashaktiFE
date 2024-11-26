import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import FlockShedScreen from '@/components/flock/FlockShedScreen'
import { SafeAreaView } from 'react-native-safe-area-context'


const flockShedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlockShedScreen />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default flockShedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});