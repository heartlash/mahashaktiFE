import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PriceRecommendation from '@/components/priceRecommendation/PriceRecommendation'

const priceRecommendation = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PriceRecommendation />
    </SafeAreaView>
  )
}

export default priceRecommendation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});