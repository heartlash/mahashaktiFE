import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import OperationalExpensesHistory from '@/components/operationalExpenses/OperationalExpensesHistory'
import { SafeAreaView } from 'react-native-safe-area-context'


const operationalExpensesHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <OperationalExpensesHistory />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default operationalExpensesHistory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});