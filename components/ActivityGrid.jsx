import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ActivityGrid = () => {
  return (
  
    <TouchableOpacity 
    className="bg-secondary rounded-2xl mb-3 h-full flex-1 justify-center items-center mx-2"
    activeOpacity={0.7}
    style={{height: '15%' }}

>



  <Text>ActivityGrid</Text>


</TouchableOpacity>
  )
}

export default ActivityGrid