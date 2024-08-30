import { SafeAreaView, Text } from 'react-native'
import React from 'react'
import { MaterialExpensesChart } from '@/components/money/MaterialExpensesChart'

const materialExpenses = () => {
  return (
    <SafeAreaView>
      <MaterialExpensesChart/>
    </SafeAreaView>
  )
}

export default materialExpenses