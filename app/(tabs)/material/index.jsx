import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import MaterialStockScreen from '@/components/materialStock/MaterialStockScreen'

const Material = () => {
  return (
    <SafeAreaView>
      <View>
        <MaterialStockScreen/>
      </View>
    </SafeAreaView>
  )
}

export default Material