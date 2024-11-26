import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import ProductionShedScreen from '@/components/production/ProductionShedScreen'
import { SafeAreaView } from 'react-native-safe-area-context'


const productionShedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ProductionShedScreen />
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default productionShedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 50
  },
});