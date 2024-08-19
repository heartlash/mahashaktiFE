import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import FlockScreen from '@/components/flock/FlockScreen'

const index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlockScreen/>
    </SafeAreaView>
  )
}

export default index