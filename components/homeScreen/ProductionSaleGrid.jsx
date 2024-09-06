import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getProductionHomeData } from '@/lib/production';
import { getSaleHomeData } from '@/lib/sale';
import { router } from 'expo-router';


const ProductionSaleGrid = ({ refreshTrigger }) => {

  const [productionDate, setProductionDate] = useState(null);
  const [productionCount, setProductionCount] = useState(null);
  const [productionPercentage, setProductionPercentage] = useState(null);


  const [saleDate, setSaleDate] = useState(null);
  const [saleCount, setSaleCount] = useState(null);
  const [averageSaleRate, setAverageSaleRate] = useState(null);

  const [loadingProduction, setLoadingProduction] = useState(true);
  const [loadingSale, setLoadingSale] = useState(true);


  useEffect(() => {
    const fetchProductionHomeData = async () => {

      const result = await getProductionHomeData();

      if (result.errorMessage == null) {
        setProductionDate(result.data.productionDate)
        setProductionCount(result.data.productionCount)
        setProductionPercentage(result.data.productionPercentage)
        setLoadingProduction(false);
      } else {
        setProductionDate(null)
        setProductionCount(null)
        setProductionPercentage(null)
        setLoadingProduction(true);
      }

    }

    fetchProductionHomeData();

    const fetchSaleHomeData = async () => {

      const result = await getSaleHomeData();

      if (result.errorMessage == null) {
        setSaleDate(result.data.saleDate)
        setSaleCount(result.data.saleCount)
        setAverageSaleRate(result.data.averageSaleRate)
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
    <View className="flex flex-row pb-2 px-2" style={{ height: '25%' }}>
      <View className="basis-1/2 pr-1">
        <TouchableOpacity
          className="bg-amber-200 rounded-3xl flex-1"
          activeOpacity={0.7}
          onPress={() => router.push('/production')}
        >
          <ImageBackground
          source={require('../../assets/images/yellow.jpeg')} 
          resizeMode="cover" 
          className="flex-1 rounded-3xl"
          imageStyle={{ borderRadius: 20 }} 
        >
          <View className="flex-none h-full items-center">
            <Text className="text-center font-pmedium text-black text-xl pt-7">PROD</Text>
            {loadingProduction ? (
              <ActivityIndicator size="small" color="#0000ff" className="pt-5" />
            ) : (
              <View>
                <Text className="text-center font-pregular text-black text-lg pt-2">{productionDate}</Text>
                <Text className="text-center font-bold text-lime-950 border border-gray-600 text-xl pt-2">{productionCount}</Text>
                <Text className="text-center font-pregular text-lime-950 text-lg pt-2">{productionPercentage}%</Text>
              </View>
            )}
          </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View className="basis-1/2 pl-1">
        <TouchableOpacity
          className="bg-amber-200 rounded-3xl flex-1"
          activeOpacity={0.7}
          onPress={() => router.push('/sale')}
        >
           <ImageBackground
          source={require('../../assets/images/yellow.jpeg')} 
          resizeMode="cover" 
          className="flex-1 rounded-3xl"
          imageStyle={{ borderRadius: 20 }} 
        >
          <View className="flex-none h-full items-center">
            <Text className="text-center font-pmedium text-black text-xl pt-7">SALE</Text>
            {loadingSale ? (
              <ActivityIndicator size="small" color="#0000ff" className="pt-5" />
            ) : (
              <View>
                <Text className="text-center font-pregular text-black text-lg pt-2">{saleDate}</Text>
                <Text className="text-center font-bold text-lime-950 text-xl pt-2">{saleCount}</Text>
                <Text className="text-center font-pregular text-lime-950 text-lg pt-2">@ ₹{averageSaleRate}</Text>

              </View>
            )}
          </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );

}

export default ProductionSaleGrid