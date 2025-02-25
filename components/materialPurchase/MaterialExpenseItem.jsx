import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import CreateMaterialPurchase from './CreateMaterialPurchase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { formatMoneyOrNumber } from '@/lib/util';



const MaterialExpenseItem = ({ item, isExpanded, onRefreshOnChange, onPress, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

  const navigation = useNavigation();

  const [createMaterialPurchase, setCreateMaterialPurchase] = useState(false)

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
          <Text className="text-lg font-semibold text-gray-800">₹{formatMoneyOrNumber(item.amountSpent)}</Text>

        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Purchase Rate</Text>
          <Text className="text-gray-700">{item.lastPurchaseRate === "NA" ? "NA" : `₹${item.lastPurchaseRate} per ${item.unit}`}</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Purchase Date</Text>
          <Text className="text-gray-700">{item.lastPurchaseDate}</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Purchase Quantity</Text>
          <Text className="text-gray-700">{item.lastPurchaseQuantity === "NA" ? "NA" : `${item.lastPurchaseQuantity} ${item.unit}`}</Text>
        </View>
      </Animated.View>
      {/* Conditionally render the CreateMaterialPurchase component only for the selected item */}
      {isExpanded && (
        <>

          <View className="flex-row justify-between mt-5 mb-2">

            <FontAwesome5
              name="list"
              size={17}
              color="black"
              onPress={() => navigation.navigate('materialPurchaseHistory', { id: item.id, name: item.name })} />
            <Ionicons
              name="add-circle"
              size={30}
              color="black"
              onPress={() => setCreateMaterialPurchase(true)}
            />
          </View>

          {createMaterialPurchase && (
            <View className="w-full px-4 mb-4">
              <CreateMaterialPurchase
                onClose={() => setCreateMaterialPurchase(false)}
                onRefreshOnChange={onRefreshOnChange}
                material={item}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}
              />
            </View>
          )}
        </>
      )}
    </TouchableOpacity>

  );

};

export default MaterialExpenseItem;
