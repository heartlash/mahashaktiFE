import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import EggScreen from '@/components/egg/EggScreen';

const Egg = () => {
  return (
    <SafeAreaView style={styles.container}>
      <EggScreen />
    </SafeAreaView>
  )
}

export default Egg

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 35
  },
});