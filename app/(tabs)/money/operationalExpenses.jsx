import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OperationalExpensesChart } from '@/components/money/OperationalExpensesChart'

const operationalExpenses = () => {
  return (
    <SafeAreaView styles={styles.container}>
        <OperationalExpensesChart/>
    </SafeAreaView>
  )
}

export default operationalExpenses

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});