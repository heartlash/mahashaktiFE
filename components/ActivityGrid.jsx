import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ActivityGrid = () => {

  return (

    <View className="flex-none pb-2" style={{height: '15%' }}>
      <TouchableOpacity 
      className="bg-secondary rounded-2xl flex-1 mx-2"
      activeOpacity={0.7}
      style={{height: '15%' }}>
        <View className="flex-none h-full items-center">
          <Text className = "text-center font-bold text-white text-2xl pt-7">Activity</Text>
        </View>

      </TouchableOpacity>
    </View>

  )
}

export default ActivityGrid