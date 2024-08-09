import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import LineChartScreen from '@/components/production/LineChartScreen'

const Production = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <LineChartScreen/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Production