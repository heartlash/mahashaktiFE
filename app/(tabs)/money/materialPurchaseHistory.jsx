import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import MaterialPurchaseHistory from '@/components/materialPurchase/MaterialPurchaseHistory'
import { SafeAreaView } from 'react-native-safe-area-context'


const materialPurchaseHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <MaterialPurchaseHistory />
      </KeyboardAvoidingView>
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