import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { deleteProductionData, updateProductionData } from '@/lib/production';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';


const ProductionItem = ({ item, isExpanded, onPress, editItem, setEditItem, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

  const [edited, setEdited] = useState(item);

  const handleEditChange = (field, value) => {
    setEdited((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const handleEditPress = () => {
    setEditItem(item);
  };

  const handleSavePress = async () => {
    setSubmitModalVisible(true);
    const userInfo = await getUserInfo();
    const updatedItem = { ...edited, updatedBy: userInfo.name };
    const result = await updateProductionData(updatedItem);

    setSubmitModalVisible(false);

    if (result.errorMessage == null) {
      setEditItem(null);
      setSuccessModalVisible(true)
      setTimeout(() => {
        onRefreshOnChange()
        setSuccessModalVisible(false);
      }, 2000);

    } else {
      setFailureModalVisible(true)
      setTimeout(() => {
        setFailureModalVisible(false);
      }, 2000);
    }
  };

  const handleDeletePress = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setSubmitModalVisible(true);
            const result = await deleteProductionData(item.id);
            setSubmitModalVisible(false);
            if (result.errorMessage == null) {
              setSuccessModalVisible(true)
              setTimeout(() => {
                onRefreshOnChange()
                setSuccessModalVisible(false);
              }, 2000);

            } else {
              setFailureModalVisible(true)
              setTimeout(() => {
                setFailureModalVisible(false);
              }, 2000);
            }
          },
        },
      ]
    );
  };


  return (
    <TouchableOpacity
      className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
      onPress={onPress}
    >
      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
      >
        <Text className="text-xl font-bold text-gray-800 mb-4">
          {new Date(item.productionDate).toDateString()}
        </Text>

        {/* First Row */}
        <View className="flex-row justify-between mb-3">
          <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Produced: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                value={edited.producedCount.toString()}
                onChangeText={(text) => handleEditChange('producedCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-700">{item.producedCount}</Text>
            )}
          </View>
          <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Percentage:</Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 bg-gray-200"
                value="To be calculated"
                editable={false}
              />
            ) : (
              <Text className="text-gray-700 ml-2">{item.productionPercentage}</Text>
            )}
          </View>
        </View>

        {/* Second Row */}
        <View className="flex-row justify-between mb-3">
          <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Broken:</Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded-md text-gray-700"
                value={edited.brokenCount.toString()}
                onChangeText={(text) => handleEditChange('brokenCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-700 ml-2">{item.brokenCount}</Text>
            )}
          </View>
          <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Reason:</Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded-md text-gray-700"
                value={edited.brokenReason}
                onChangeText={(text) => handleEditChange('brokenReason', text)}
              />
            ) : (
              <Text className="text-gray-700 ml-2">{item.brokenReason}</Text>
            )}
          </View>
        </View>

        {/* Third Row */}
        <View className="flex-row justify-between mb-3">
          <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Gift:</Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded-md text-gray-700"
                value={edited.giftCount.toString()}
                onChangeText={(text) => handleEditChange('giftCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-700 ml-2">{item.giftCount}</Text>
            )}
          </View>
          <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Self Use:</Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded-md text-gray-700"
                value={edited.selfUseCount.toString()}
                onChangeText={(text) => handleEditChange('selfUseCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-700 ml-2">{item.selfUseCount}</Text>
            )}
          </View>
        </View>

        {/* Fourth Row */}
        <View className="flex-row justify-between mb-3">
          <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Saleable Eggs:</Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded-md text-gray-700 bg-gray-200"
                value="To be calculated"
                editable={false}
              />
            ) : (
              <Text className="text-gray-700 ml-2">{item.saleableCount}</Text>
            )}
          </View>
          {isExpanded && (
            <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
              <Text className="text-gray-700 font-semibold">Created By:</Text>
              {editItem === item ? (
                <TextInput
                  className="border border-gray-300 p-2 rounded-md text-gray-700 bg-gray-200"
                  value={item.createdBy}
                  editable={false}
                />
              ) : (
                <Text className="text-gray-700 ml-2">{item.createdBy}</Text>
              )}
            </View>
          )}
        </View>

        {isExpanded && (
          <View>
            <View className={`flex-1 pr-2 mb-3 ${editItem === item ? ' w-1/2' : 'flex-row'}`}>

              <Text className="text-gray-700 font-semibold">Updated By:</Text>
              {editItem === item ? (
                <TextInput
                  className="border border-gray-300 p-2 rounded-md text-gray-700  bg-gray-200"
                  value={item.updatedBy}
                  editable={false}
                />
              ) : (
                <Text className="text-gray-700 ml-2">{item.updatedBy}</Text>
              )}
            </View>

            {/* Edit and Delete Buttons */}
            <View className="flex-row justify-between mt-7 mb-5">
              {editItem === item ? (
                <View className="flex-1 flex-row justify-between">
                  <MaterialIcons name="cancel" size={30} color="black" onPress={() => setEditItem(null)} />
                  <Entypo name="save" size={30} color="black" onPress={handleSavePress} />

                </View>
              ) : (
                <View className="flex-1 flex-row justify-between">
                  <TrashIcon size={28} color="black" onPress={handleDeletePress} />
                  <PencilSquareIcon size={28} color="black" onPress={() => handleEditPress(item)} />
                </View>
              )}
            </View>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>

  );
};

export default ProductionItem;
