import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getFormattedDate, calculateWeeksPassed } from '@/lib/util';

const ShedItem = ({ item, isFlock, isProduction }) => {

  const router = useRouter();

  const onPress = () => {

    var pathname;

    if (isFlock)
      pathname = '/home/flockShedScreen'
    if (isProduction)
      pathname = '/production/productionShedScreen'

    if (item.active) {
      router.push({
        pathname,
        params: {
          shedId: item.id,
          shedName: item.name
        }
      })
    }
  }

  const shedStatus = item.active === true ? 'Active' : 'In Active'
  const shedkStatusColor = item.active === true ? 'bg-green-500' : 'bg-blue-500';  // Color for "In Stock"

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
    >
      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
      >
        <View className="flex-row justify-between mb-3">
          <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
          <View className="flex-row items-center ml-2">
            {item.baby === true && (
              <View className="bg-red-400 px-2 py-1 rounded-lg mr-1">
                <Text className="font-bold text-white">Baby</Text>
              </View>
            )}
            <View className={`${shedkStatusColor} px-2 py-1 rounded-lg`}>
              <Text className="font-bold text-white">{shedStatus}</Text>
            </View>
          </View>
        </View>

        {item.active === true && isFlock === true && (
          <>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-700 font-semibold">Timeline</Text>
              <Text className="text-gray-700">{calculateWeeksPassed(item.genesisDate)} Weeks</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-700 font-semibold">Genesis Date</Text>
              <Text className="text-gray-700">{getFormattedDate(item.genesisDate)}</Text>
            </View>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ShedItem;
