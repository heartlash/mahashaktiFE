import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ActivityGrid = () => {

  return (

    <View className="flex-none pb-2" style={{height: '15%' }}>
      <TouchableOpacity 
      className="bg-gray-400 border border-cyan-200 rounded-3xl flex-1 mx-2"
      activeOpacity={0.7}
      style={{height: '15%' }}>
        <View className="flex-none h-full items-center">
          <Text className = "text-center font-pregular text-white text-xl pt-10">NOTIFICATION (PENDING)</Text>
        </View>

      </TouchableOpacity>
    </View>

  )
}

export default ActivityGrid