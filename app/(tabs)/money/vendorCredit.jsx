import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VendorCreditScreen } from '@/components/money/VendorCreditScreen'

const vendorCredit = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <VendorCreditScreen/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default vendorCredit

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 70
  },
});