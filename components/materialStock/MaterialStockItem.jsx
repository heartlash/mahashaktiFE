import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MinusCircleIcon } from "react-native-heroicons/solid";
import CreateMaterialConsumption from './CreateMaterialConsumption'
import CreateMaterialPurchase from './CreateMaterialPurchase'
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';


const MaterialStockItem = ({ item, onRefreshOnChange, isExpanded, onPress, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

  const [showRecordConsumption, setShowRecordConsumption] = useState(false)
  const [showRecordPurchase, setShowRecordPurchase] = useState(false)
  const [showRecordButtons, setShowRecordButtons] = useState(true)

  const navigation = useNavigation();

  const handlePressOnRecordPurchase = () => {
    setShowRecordButtons(false)
    setShowRecordPurchase(true);
  }

  const handlePressOnRecordConsumption = (item) => {
    setShowRecordButtons(false)
    setShowRecordConsumption(true);
  }


  const handleOnCloseRecordPurchase = () => {
    setShowRecordButtons(true)
    setShowRecordPurchase(false);
  }

  const handleOnCloseRecordConsumption = () => {
    setShowRecordButtons(true)
    setShowRecordConsumption(false);
  }

  const stockStatus = parseInt(item.wouldLastFor) == 0 || parseInt(item.wouldLastFor) < 0
    ? 'Out of Stock'
    : parseFloat(item.minQuantity) >= parseFloat(item.quantity)
      ? 'Low Stock'
      : 'In Stock';

  const stockStatusColor = parseInt(item.wouldLastFor) == 0 || parseInt(item.wouldLastFor) < 0
    ? 'bg-red-600'
    : parseFloat(item.minQuantity) >= parseFloat(item.quantity)
      ? 'bg-orange-500'
      : 'bg-green-500';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
    >

      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
      >
        <View className="flex-row justify-between mb-3">
          <Text className="text-xl font-semibold text-gray-800">{item.material}</Text>
          <Text className="text-xl font-medium text-gray-800">{item.quantity} {item.unit}</Text>
        </View>
        <View className="flex-row justify-end mb-3">
          <View className={`${stockStatusColor} px-2 py-1 rounded-lg`}>
            <Text className="font-bold text-white">{stockStatus}</Text>
          </View>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Stock For</Text>
          <Text className="text-gray-700">{item.wouldLastFor} Days</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Minimum Safe Quantity</Text>
          <Text className="text-gray-700">{item.minQuantity.toFixed(2)} {item.unit}</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Purchase Date</Text>
          <Text className="text-gray-700">{item.lastPurchaseDate}</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Purchase Rate</Text>
          <Text className="text-gray-700">₹{item.lastPurchaseRate} per {item.unit}</Text>
        </View>

        {/* Conditionally render the CreateMaterialPurchase component only for the selected item */}
        {isExpanded && (
          <>
            {showRecordButtons && (
              <View>
                <View className="flex-row justify-between mt-5">
                  <MinusCircleIcon size={30} color="black" onPress={() => handlePressOnRecordConsumption()} />
                  <Ionicons name="add-circle" size={30} style={{ alignSelf: 'center' }} color="black" onPress={() => handlePressOnRecordPurchase()} />

                </View>
                <View className="flex-row justify-between my-4 mx-2">
                  <FontAwesome5 name="list" size={15} color="black" onPress={() => navigation.navigate('materialConsumptionHistory', { id: item.materialId })} />
                  <FontAwesome5 name="list" size={15} color="black" onPress={() => navigation.navigate('materialPurchaseHistory', { id: item.materialId })} />
                </View>
              </View>
            )}

            {showRecordConsumption && (
              <CreateMaterialConsumption materialId={item.materialId} materialUnit={item.unit} onClose={() => handleOnCloseRecordConsumption()} onRefreshOnChange={onRefreshOnChange}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible} />
            )}
            {showRecordPurchase && (
              <CreateMaterialPurchase materialId={item.materialId} materialUnit={item.unit} onClose={() => handleOnCloseRecordPurchase()} onRefreshOnChange={onRefreshOnChange}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible} />
            )}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>

  );
};

export default MaterialStockItem;
