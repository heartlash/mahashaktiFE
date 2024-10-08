import { StyleSheet } from 'react-native'
import React from 'react'
import OperationalExpensesScreen from '@/components/operationalExpenses/OperationalExpensesScreen'
import { SafeAreaView } from 'react-native-safe-area-context'


const operationalExpensesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <OperationalExpensesScreen/>
    </SafeAreaView>
  )
}

export default operationalExpensesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});