import { View, Text, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getProductionHomeData } from '@/lib/production';
import { getSaleHomeData } from '@/lib/sale';
import { router } from 'expo-router';


const ProductionSaleGrid = ({refreshTrigger}) => {

  const [productionDate, setProductionDate] = useState(null);
  const [productionCount, setProductionCount] = useState(null);
  const [productionPercentage, setProductionPercentage] = useState(null);


  const [saleDate, setSaleDate] = useState(null);
  const [saleCount, setSaleCount] = useState(null);

  const [loadingProduction, setLoadingProduction] = useState(true);
  const [loadingSale, setLoadingSale] = useState(true);


  useEffect(() => {
    const fetchProductionHomeData = async() => {
    
      const result = await getProductionHomeData();
      console.log("see refresh control now: ", refreshTrigger)
      
      if(typeof result !=='undefined') {
        setProductionDate(result.productionDate)
        setProductionCount(result.productionCount)
        setProductionPercentage(result.productionPercentage)
        setLoadingProduction(false);
      } else {
        setProductionDate(null)
        setProductionCount(null)
        setProductionPercentage(null)
        setLoadingProduction(true);
      }

    }

    fetchProductionHomeData();

    const fetchSaleHomeData = async() => {
    
      const result = await getSaleHomeData();
      console.log("see value returned: ", result)
      
      if(typeof result !=='undefined') {
        setSaleDate(result.saleDate)
        setSaleCount(result.saleCount)
        setLoadingSale(false);
      } else {
        setSaleDate(null)
        setSaleCount(null)
        setLoadingSale(true);
      }

    }

    fetchSaleHomeData();


  }, [refreshTrigger]);


  return (
    <View className="flex flex-row pb-2" style={{height: '25%' }}>
      
            <View className="basis-1/2">
            <TouchableOpacity 
            className="bg-amber-300 rounded-2xl flex-1 mx-1"
            activeOpacity={0.7}
            onPress={() => router.push('/production')}
            >
                <View className="flex-none h-full items-center">

                  <Text className = "text-center font-bold text-white text-2xl pt-7">Production</Text>
                  { loadingProduction ? ( <ActivityIndicator size="small" color="#0000ff" className="pt-5"/>) : (
                    <View>
                  <Text className="text-center font-bold text-white text-xl pt-2">{productionDate}</Text>
                  <Text className="text-center font-bold text-white text-xl pt-2">{productionCount}</Text>
                  <Text className="text-center font-bold text-white text-xl pt-2">{productionPercentage}%</Text>
                  </View>
                  )}
                </View>
            </TouchableOpacity>
            </View>

            <View className="basis-1/2">
            <TouchableOpacity 
            className="bg-amber-300 rounded-2xl flex-1 mx-1"
            activeOpacity={0.7}
            >
                <View className="flex-none h-full items-center">

                  <Text className = "text-center font-bold text-white text-2xl pt-7">Sale</Text>
                  {loadingSale ? (<ActivityIndicator size="small" color="#0000ff" className="pt-5"/>) : (
                    <View>
                      <Text className="text-center font-bold text-white text-xl pt-2">{saleDate}</Text>
                      <Text className="text-center font-bold text-white text-xl pt-2">{saleCount}</Text>
                    </View>
                  )}
                  
                </View>
            </TouchableOpacity>
            </View>
         
    </View>

  )
}

export default ProductionSaleGrid