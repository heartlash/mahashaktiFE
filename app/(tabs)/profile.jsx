import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { logout } from '@/lib/auth'
import { router } from 'expo-router'

const Profile = () => {

  const onPress = async() => {
    await logout();
    router.push('/sign-in');
  }

  return (
    <View className="flex-1 items center justify-center bg-blue">
      <TouchableOpacity
                    onPress={() => onPress()}
                    className="bg-yellow-300 p-3 rounded-lg mx-10 my-3"
                >
                    <Text className="text-black font-semibold justify-center p-3">Logout</Text>
                </TouchableOpacity>
    </View>
  )
}

export default Profile