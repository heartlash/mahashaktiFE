import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VendorScreen from '@/components/vendors/VendorScreen'


const Vendors = () => {
  return (
    <SafeAreaView style={styles.container}>
      <VendorScreen/>
    </SafeAreaView>
  )
}

export default Vendors

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});