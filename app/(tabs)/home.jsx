import { Image, StyleSheet, Platform, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductionSaleGrid from '@/components/ProductionSaleGrid';
import StockFlockGrid from '@/components/StockFlockGrid';
import WeatherGrid from '@/components/WeatherGrid';
import ActivityGrid from '@/components/ActivityGrid';
import StockCarousel from '@/components/StockCarousel';

export default function HomeScreen() {

  const blockData = [{
    id: "1",
    name: 'Production',
    date: 'Today',
    count: '50%',
    percentage: 'Metric 1',
  },
  {
    id: "2",
    name: 'Sale',
    date: 'Today',
    count: '50%',
    percentage: 'Metric 1',
  }];

  const flockData = [{
    id: "1",
    name: 'Eggs In Stock',
    count: '1000',
  },
  {
    id: "2",
    name: 'Flock Count',
    count: '22000',
  }];


  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <ProductionSaleGrid items={blockData}/>
        <ActivityGrid/>
        <StockFlockGrid items={flockData}/>
        <WeatherGrid/>
        <StockCarousel/>
      </ScrollView>
  </SafeAreaView>
  );
}
