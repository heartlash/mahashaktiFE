import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import SaleScreen from '@/components/sale/SaleScreen'

const Sale = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <SaleScreen/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Sale