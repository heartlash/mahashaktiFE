import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialExpensesScreen } from '@/components/money/MaterialExpensesScreen'

const materialExpenses = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <MaterialExpensesScreen />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default materialExpenses

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 70
  },
});