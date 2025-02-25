import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import SaleTypeScreen from '@/components/sale/SaleTypeScreen'
import { SafeAreaView } from 'react-native-safe-area-context'


const saleTypeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SaleTypeScreen />
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default saleTypeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});