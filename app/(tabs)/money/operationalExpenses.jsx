import { SafeAreaView, Text } from 'react-native'
import React from 'react'
import { OperationalExpensesChart } from '@/components/money/OperationalExpensesChart'
const operationalExpenses = () => {
  return (
    <SafeAreaView>
        <OperationalExpensesChart/>
    </SafeAreaView>
  )
}

export default operationalExpenses