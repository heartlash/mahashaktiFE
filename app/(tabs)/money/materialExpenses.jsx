import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialExpensesChart } from '@/components/money/MaterialExpensesChart'

const materialExpenses = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MaterialExpensesChart/>
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