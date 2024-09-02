import { StyleSheet } from 'react-native'
import React from 'react'
import OperationalExpensesScreen from '@/components/operationalExpenses/OperationalExpensesScreen'


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