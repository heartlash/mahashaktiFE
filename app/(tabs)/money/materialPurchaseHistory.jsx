import { StyleSheet } from 'react-native'
import React from 'react'
import MaterialPurchaseHistory from '@/components/materialPurchase/MaterialPurchaseHistory'
import { SafeAreaView } from 'react-native-safe-area-context'


const materialPurchaseHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MaterialPurchaseHistory/>
    </SafeAreaView>
  )
}

export default materialPurchaseHistory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});