import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import SaleScreen from '@/components/sale/SaleScreen'

const Sale = () => {
  return (
    <SafeAreaView style={styles.container}>
        <SaleScreen/>
    </SafeAreaView>
  )
}

export default Sale


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 35
  },
});