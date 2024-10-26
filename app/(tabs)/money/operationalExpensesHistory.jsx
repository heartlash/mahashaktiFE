import { StyleSheet } from 'react-native'
import React from 'react'
import OperationalExpensesHistory from '@/components/operationalExpenses/OperationalExpensesHistory'
import { SafeAreaView } from 'react-native-safe-area-context'


const operationalExpensesHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <OperationalExpensesHistory/>
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