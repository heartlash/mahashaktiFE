import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

import MaterialStockScreen from '@/components/materialStock/MaterialStockScreen'

const Material = () => {
  return (
    <SafeAreaView style={styles.container}>
        <MaterialStockScreen/>
    </SafeAreaView>
  )
}

export default Material

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 30
  },
});