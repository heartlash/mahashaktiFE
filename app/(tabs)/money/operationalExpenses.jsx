import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OperationalExpensesScreen } from '@/components/money/OperationalExpenseScreen'

const operationalExpenses = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <OperationalExpensesScreen />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default operationalExpenses

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 70
  },
});