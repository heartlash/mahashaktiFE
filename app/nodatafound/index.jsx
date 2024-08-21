import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const NoDataFound = ({ message = "No data found hehe" }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-gray-500 text-lg mb-4">{message}</Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-blue-500 p-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoDataFound;
