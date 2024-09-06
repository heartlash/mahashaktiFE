import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { logout } from '@/lib/auth'
import { router } from 'expo-router'
import { AntDesign } from "@expo/vector-icons";
import { getUserInfo } from '@/lib/auth';

const Profile = () => {

  const [name, setName] = useState('')

  const fetchUserInfo = async () => {
    const userInfo = await getUserInfo();
    setName(userInfo.name)
  }

  useEffect(() => {
    fetchUserInfo();

  }, [])

  const onPress = async () => {
    await logout();
    router.push('/login');
  }

  return (
    <View className="flex-1 items-center justify-center bg-blue">
      <Text className="font-bold mb-10">Hi, {name}</Text>
      <TouchableOpacity className="bg-orange-200 p-10 rounded-3xl" onPress={() => onPress()} >
        <AntDesign name="logout" size={30} color="green" />
      </TouchableOpacity>
    </View>
  )
}

export default Profile