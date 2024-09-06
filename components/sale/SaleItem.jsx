import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { deleteSaleData, updateSaleData } from '@/lib/sale';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { pickerSelectStyles } from '@/styles/GlobalStyles';


const SaleItem = ({ item, isExpanded, onPress, editItem, setEditItem, vendorData, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

  const [edited, setEdited] = useState(item);

  const handleEditChange = (field, value) => {

    setEdited((prevItem) => {
      const updatedItem = {
        ...prevItem,
        [field]: value,
      };

      // Check if the field is either 'soldCount' or 'rate' and update the 'amount' accordingly
      if (field === 'soldCount' || field === 'rate') {
        const soldCount = field === 'soldCount' ? parseFloat(value) : parseFloat(updatedItem.soldCount);
        const rate = field === 'rate' ? parseFloat(value) : parseFloat(updatedItem.rate);

        // Calculate the amount only if both soldCount and rate are valid numbers
        if (!isNaN(soldCount) && !isNaN(rate)) {
          updatedItem.amount = (soldCount * rate).toFixed(2);
          edited.amount = updatedItem.amount
        } else {
          updatedItem.amount = ''; // Clear the amount if the inputs are invalid
          edited.amount = 0

        }
      }
      return updatedItem;
    });
  };

  const handleEditPress = (item) => {
    setEditItem(item);
  };

  const handleSavePress = async () => {
    setSubmitModalVisible(true);
    const userInfo = await getUserInfo();
    const updatedItem = { ...edited, updatedBy: userInfo.name };

    const result = await updateSaleData(updatedItem);
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
            const result = await deleteSaleData(item.id);
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
        entering={FadeInDown.duration(1000).springify()}>
        {/* First Row */}
        <View className="flex-row justify-between mb-4">
          <View className={`flex-1 pr-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Eggs Sold: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                value={edited.soldCount.toString()}
                onChangeText={(text) => handleEditChange('soldCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-700">{item.soldCount}</Text>
            )}
          </View>
          <View className={`flex-1 pl-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Rate: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                value={edited.rate.toString()}
                onChangeText={(text) => handleEditChange('rate', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-700">{item.rate}</Text>
            )}
          </View>
        </View>

        {/* Second Row */}
        <View className="flex-row justify-between mb-3">
          <View className={`flex-1 pr-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Amount: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                value={edited.amount.toString()}
                editable={false} // Make the field non-editable
              />
            ) : (
              <Text className="text-gray-700">{item.amount}</Text>
            )}
          </View>
          <View className={`flex-1 pl-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Paid: </Text>
            {editItem === item ? (
              <RNPickerSelect
                onValueChange={(value) => handleEditChange('paid', value)}
                items={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
                placeholder={{
                  label: item.paid,
                  value: item.paid,
                }}
                style={pickerSelectStyles}
              />
            ) : (
              <Text className="text-gray-700">{item.paid}</Text>
            )}
          </View>
        </View>

        {/* Third Row */}
        <View className="flex-row justify-between mb-3">
          <View className={`flex-1 pr-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
            <Text className="text-gray-700 font-semibold">Vendor: </Text>
            {editItem === item ? (
              <RNPickerSelect
                onValueChange={(value) => handleEditChange('paid', value)}
                items={vendorData}
                placeholder={{
                  label: item.vendorName && vendorData.find(v => v.label === item.vendorName)
                    ? item.vendorName
                    : 'Select Vendor...',
                  value: item.vendorName,
                }}
                style={pickerSelectStyles}
              />
            ) : (
              <Text className="text-gray-700">{item.vendorName}</Text>
            )}
          </View>
          {isExpanded && (
            <View className={`flex-1 pl-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
              <Text className="text-gray-700 font-semibold">Created By: </Text>
              {editItem === item ? (
                <TextInput
                  className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 bg-gray-200"
                  value={item.createdBy}
                  editable={false}
                />
              ) : (
                <Text  className="text-gray-600 flex-1" numberOfLines={1} ellipsizeMode="tail">{item.createdBy}</Text>
              )}
            </View>
          )}
        </View>

        {/* Conditionally render additional content */}
        {isExpanded && (
          <View>
            {/* Fourth Row */}
            <View>
              <View className={`flex-1 pr-4 w-1/2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                <Text className="text-gray-700 font-semibold">Updated By: </Text>
                {editItem === item ? (
                  <TextInput
                    className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 bg-gray-200"
                    value={item.updatedBy}
                    editable={false}
                  />
                ) : (
                  <Text className="text-gray-600 flex-1" numberOfLines={1} ellipsizeMode="tail">{item.updatedBy}</Text>

                )}
              </View>
            </View>

            {/* Edit and Delete Buttons */}
            <View className="flex-row justify-end mt-7 mb-5">
              {editItem === item ? (
                <View className="flex-1 flex-row justify-between">
                  <MaterialIcons name="cancel" size={30} color="black" onPress={() => { setEditItem(null) }} />
                  <Entypo name="save" size={30} color="black" onPress={handleSavePress} />
                </View>
              ) : (
                <View className="flex-1 flex-row justify-between">

                  <TrashIcon size={28} color="black" onPress={handleDeletePress} />

                  <TouchableOpacity onPress={() => handleEditPress(item)}>
                    <PencilSquareIcon size={28} color="black" />
                  </TouchableOpacity>

                </View>
              )}
            </View>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>


  );
};

export default SaleItem;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});
