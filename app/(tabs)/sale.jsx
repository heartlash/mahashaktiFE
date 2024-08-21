import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import SaleScreen from '@/components/sale/SaleScreen'

const Sale = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SaleScreen/>
      </View>
    </SafeAreaView>
  )
}

export default Sale