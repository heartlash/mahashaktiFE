import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import React from 'react'

const StockFlockGrid = ({items}) => {
  return (
    <View className="flex flex-row pb-2" style={{height: '20%' }}>

      <View className="basis-1/2">
        <TouchableOpacity 
        className="bg-secondary rounded-2xl flex-1 mx-1"
        activeOpacity={0.7}>
          <View className="flex-none h-full items-center">
              <Text className = "text-center font-bold text-white text-2xl pt-7">Eggs Stock</Text>
              <Text className = "">1200</Text>
            </View>
        </TouchableOpacity>
      </View>

      <View className="basis-1/2">
        <TouchableOpacity 
        className="bg-secondary rounded-2xl flex-1 mx-1"
        activeOpacity={0.7}>
          <View className="flex-none h-full items-center">
              <Text className = "text-center font-bold text-white text-2xl pt-7">Flock Count</Text>
              <Text className = "">23000</Text>
            </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default StockFlockGrid