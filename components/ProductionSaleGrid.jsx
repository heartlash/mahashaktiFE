import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import React from 'react'


const ProductionSaleGrid = () => {
  return (
    <View className="flex flex-row pb-2" style={{height: '25%' }}>
      
            <View className="basis-1/2">
            <TouchableOpacity 
            className="bg-secondary rounded-2xl flex-1 mx-1"
            activeOpacity={0.7}
            >
                <View className="flex-none h-full items-center">

                  <Text className = "text-center font-bold text-white text-2xl pt-7">Production</Text>
                  <Text>Today</Text>
                  <Text>22000</Text>
                  <Text>89%</Text>
                </View>
            </TouchableOpacity>
            </View>

            <View className="basis-1/2">
            <TouchableOpacity 
            className="bg-secondary rounded-2xl flex-1 mx-1"
            activeOpacity={0.7}
            >
                <View className="flex-none h-full items-center">

                  <Text className = "text-center font-bold text-white text-2xl pt-7">Sale</Text>
                  <Text>Today</Text>
                  <Text>2000</Text>
                  <Text>20</Text>
                </View>
            </TouchableOpacity>
            </View>
         
    </View>

  )
}

export default ProductionSaleGrid