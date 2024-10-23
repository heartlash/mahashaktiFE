import { View, Text, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getFlockCount } from '@/lib/flock';
import { getEggCount } from '@/lib/egg';
import { router } from 'expo-router';

const EggAndFlockGrid = ({ refreshTrigger }) => {

  const [flockCount, setFlockCount] = useState(null);
  const [eggCount, setEggCount] = useState(null);

  const [loadingEgg, setLoadingEgg] = useState(true);
  const [loadingFlock, setLoadingFlock] = useState(true);


  useEffect(() => {
    const fetchFlockCount = async () => {
      const result = await getFlockCount();

      if (result.errorMessage == null) {
        setFlockCount(result.data)
        setLoadingFlock(false);
      } else {
        setFlockCount(null)
        setLoadingFlock(true);
      }

    }

    fetchFlockCount();

    const fetchEggCount = async () => {
      const result = await getEggCount();

      if (result.errorMessage == null) {
        setEggCount(result.data)
        setLoadingEgg(false);
      } else {
        setEggCount(null)
        setLoadingEgg(true);
      }

    }

    fetchEggCount();



  }, [refreshTrigger]);


  return (
    <View className="flex flex-row pb-2 px-2" style={{ height: '20%' }}>

      <View className="basis-1/2 pr-1">
        <TouchableOpacity
          className="bg-amber-200 rounded-3xl flex-1"
          activeOpacity={0.7}>
          <ImageBackground
            source={require('../../assets/images/orange.jpeg')}
            //source={require('../../assets/images/Egg.jpg')}
            resizeMode="cover"
            className="flex-1 rounded-3xl"
            imageStyle={{ borderRadius: 20 }}
          >
            <View className="flex-none h-full items-center">
              <Text className="text-center font-pmedium text-black text-xl pt-7">EGG STOCK</Text>
              {loadingEgg ? (<ActivityIndicator size="small" color="#0000ff" className="pt-5" />) : (
                <Text className="text-center font-bold text-black text-xl pt-5">{eggCount}</Text>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View className="basis-1/2 pl-1">
        <TouchableOpacity
          className="bg-amber-200 rounded-3xl flex-1"
          activeOpacity={0.7}
          onPress={() => router.push('/home/flock')}>
          <ImageBackground
            source={require('../../assets/images/orange.jpeg')}
            //source={require('../../assets/images/Chicken Head.jpg')}
            resizeMode="cover"
            className="flex-1 rounded-3xl"
            imageStyle={{ borderRadius: 20 }}
          >
            <View className="flex-none h-full items-center">
              <Text className="text-center font-pmedium text-black text-xl pt-7">FLOCK</Text>
              {loadingFlock ? (<ActivityIndicator size="small" color="#0000ff" className="pt-5" />) : (
                <Text className="text-center font-bold text-black text-xl pt-5">{flockCount}</Text>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EggAndFlockGrid