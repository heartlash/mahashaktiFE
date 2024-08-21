import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import ProductionScreen from '@/components/production/ProductionScreen'

const Production = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <ProductionScreen/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Production