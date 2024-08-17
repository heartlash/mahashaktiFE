import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import MaterialStockScreen from '@/components/materialStock/MaterialStockScreen'

const MaterialStock = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MaterialStockScreen/>
      </View>
    </SafeAreaView>
  )
}

export default MaterialStock