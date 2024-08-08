import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProductionSaleGrid from '@/components/homeScreen/ProductionSaleGrid';
import EggAndFlockGrid from '@/components/homeScreen/EggAndFlockGrid';
import WeatherGrid from '@/components/homeScreen/WeatherGrid';
import ActivityGrid from '@/components/homeScreen/ActivityGrid';
import MaterialStockCarousel from '@/components/homeScreen/MaterialStockCarousel';


const home = () => {
  return (
    <SafeAreaView>
      <ScrollView className="flex flex-col" contentContainerStyle={{height: '100%'}}>
        <ProductionSaleGrid/>
        <ActivityGrid/>
        <EggAndFlockGrid/>
        <WeatherGrid/>
        <MaterialStockCarousel/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default home