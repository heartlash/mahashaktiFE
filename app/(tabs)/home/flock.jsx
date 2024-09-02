import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FlockScreen from '@/components/flock/FlockScreen';

const Flock = () => {
  return (
    <SafeAreaView style={styles.container}>
        <FlockScreen/>
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