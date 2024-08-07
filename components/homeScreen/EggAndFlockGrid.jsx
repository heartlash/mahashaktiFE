import { View, Text, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getFlockCount } from '@/lib/flock';
import { getEggCount } from '@/lib/egg';

const EggAndFlockGrid = () => {

  const [flockCount, setFlockCount] = useState(null);
  const [eggCount, setEggCount] = useState(null);

  const [loadingEgg, setLoadingEgg] = useState(true);
  const [loadingFlock, setLoadingFlock] = useState(true);


  useEffect(() => {
    const fetchFlockCount = async() => {
    
      const count = await getFlockCount();
      console.log("see value returned: ", count)
      
      if(typeof count !=='undefined') {
        setFlockCount(count)
        setLoadingFlock(false);
      } else {
        setFlockCount(null)
        setLoadingFlock(true);
      }

    }

    fetchFlockCount();

    const fetchEggCount = async() => {
    
      const count = await getEggCount();
      console.log("see value returned: ", count)
      
      if(typeof count !=='undefined') {
        setEggCount(count)
        setLoadingEgg(false);
      } else {
        setEggCount(null)
        setLoadingEgg(true);
      }

    }

    fetchEggCount();



  }, []);


  return (
    <View className="flex flex-row pb-2" style={{height: '20%' }}>

      <View className="basis-1/2">
        <TouchableOpacity 
        className="bg-amber-300 rounded-2xl flex-1 mx-1"
        activeOpacity={0.7}>
          <View className="flex-none h-full items-center">
            <Text className = "text-center font-bold text-white text-2xl pt-5">Eggs In Stock</Text>
            {loadingEgg ? ( <ActivityIndicator size="small" color="#0000ff" className="pt-5"/>) : (
              <Text className = "text-center font-bold text-white text-2xl pt-5">{eggCount}</Text>
            )} 
            </View>
        </TouchableOpacity>
      </View>

      <View className="basis-1/2">
        <TouchableOpacity 
        className="bg-amber-300 rounded-2xl flex-1 mx-1"
        activeOpacity={0.7}>
          <View className="flex-none h-full items-center">
            <Text className = "text-center font-bold text-white text-2xl pt-5">Flocks</Text>
            {loadingFlock ? ( <ActivityIndicator size="small" color="#0000ff" className="pt-5"/>) : (
              <Text className = "text-center font-bold text-white text-2xl pt-5">{flockCount}</Text>
            )}             
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EggAndFlockGrid