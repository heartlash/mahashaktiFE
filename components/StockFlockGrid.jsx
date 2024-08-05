import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import React from 'react'

const StockFlockGrid = ({items}) => {
  return (
    <View className="w-full" style={{height: '20%' }}>

      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={item=>item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between'
        }}
       
        className="mx-1"
        renderItem={({item}) => {
          return (
            <TouchableOpacity 
            className="bg-secondary rounded-2xl mb-3 flex-1 justify-center items-center mx-1"
            activeOpacity={0.7}

            >
            <View className="flex-1 justify-center items-center">
                <Text className = "pt-10 text-center font-bold text-white text-2xl">{item.name}</Text>
                <Text className = "pb-10">{item.count}</Text>
              </View>
            </TouchableOpacity>
          )

        }}
      />
    </View>


  )
}

export default StockFlockGrid