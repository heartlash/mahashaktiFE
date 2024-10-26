import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialExpensesScreen } from '@/components/money/MaterialExpensesScreen'

const materialExpenses = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MaterialExpensesScreen/>
    </SafeAreaView>
  )
}

export default materialExpenses

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});