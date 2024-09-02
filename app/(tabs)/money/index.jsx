import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

import MoneyScreen from '@/components/money/MoneyScreen'

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MoneyScreen/>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Your global background color
    paddingBottom: 30
  },
});