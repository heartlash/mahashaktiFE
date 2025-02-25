import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import PaymentsHistory from '@/components/credit/PaymentsHistory'
import { SafeAreaView } from 'react-native-safe-area-context'


const paymentsHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <PaymentsHistory />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default paymentsHistory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 70
  },
});