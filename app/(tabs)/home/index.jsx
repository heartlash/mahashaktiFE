import { ScrollView, RefreshControl } from 'react-native'
import React, {useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProductionSaleGrid from '@/components/homeScreen/ProductionSaleGrid';
import EggAndFlockGrid from '@/components/homeScreen/EggAndFlockGrid';
import WeatherGrid from '@/components/homeScreen/WeatherGrid';
import ActivityGrid from '@/components/homeScreen/ActivityGrid';
import MaterialStockCarousel from '@/components/homeScreen/MaterialStockCarousel';


const index = () => {

  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const onRefresh = useCallback(() => {
    console.log("on refresh is called on homepage: ", refreshTrigger)
    setRefreshing(true);
    setRefreshTrigger(prev => !prev); // Toggle the refresh trigger
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Adjust the timeout as needed
    console.log("on refresh is called on homepage after: ", refreshTrigger)
  }, []);

  return (
    <SafeAreaView>
      <ScrollView className="flex flex-col" contentContainerStyle={{height: '100%'}}
       refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <ProductionSaleGrid refreshTrigger={refreshTrigger}/>
        <ActivityGrid refreshTrigger={refreshTrigger}/>
        <EggAndFlockGrid refreshTrigger={refreshTrigger}/>
        <WeatherGrid refreshTrigger={refreshTrigger}/>
        <MaterialStockCarousel refreshTrigger={refreshTrigger}/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default index