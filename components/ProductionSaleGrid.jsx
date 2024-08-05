import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import React from 'react'

const ProductionSaleGrid = ({items}) => {
  return (
    <View className="w-full" style={{height: '25%' }}>
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={item=>item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between'
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      
        className="mx-1"
        renderItem={({item}) => {
          return (
            <TouchableOpacity 
            className="bg-secondary h-full rounded-2xl flex-1 justify-center items-center mx-1"
            activeOpacity={0.7}
            >
                <View className="flex-1 justify-center items-center">

                  <Text className = "text-center font-bold text-white text-2xl">{item.name}</Text>
                  <Text>{item.date}</Text>
                  <Text>{item.count}</Text>
                  <Text className = "pb-10">{item.percentage}</Text>
                </View>
            </TouchableOpacity>
          )

        }}
      />
    </View>

  )
}

export default ProductionSaleGrid