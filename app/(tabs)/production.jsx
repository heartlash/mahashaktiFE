import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductionScreen from '@/components/production/ProductionScreen'

const Production = () => {
  return (
    <SafeAreaView style={styles.container}>
        <ProductionScreen/>
    </SafeAreaView>
  )
}

export default Production

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 35
  },
});