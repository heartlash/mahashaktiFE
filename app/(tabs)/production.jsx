import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import ProductionScreen from '@/components/production/ProductionScreen'

const Production = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ProductionScreen/>
      </View>
    </SafeAreaView>
  )
}

export default Production