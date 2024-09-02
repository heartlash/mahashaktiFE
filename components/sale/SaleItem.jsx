import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { deleteSaleData, updateSaleData, groupSalesByDate } from '@/lib/sale';
import { getUserInfo } from '@/lib/auth';
import { PencilIcon, PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';


const SaleItem = ({ item, isExpanded, onPress, editItem, setEditItem, vendorData, onRefreshOnChange }) => {

  const [edited, setEdited] = useState(item);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const userInfo = await getUserInfo();
    const updatedItem = { ...edited, updatedBy: userInfo.name };
    const result = await updateSaleData(updatedItem);
    if (result) {
      setEditItem(null);
      Alert.alert("Success", "Data updated", [{ text: "OK" }]);
      onRefreshOnChange();
    } else {
      Alert.alert("Failure", "Data updation failed", [{ text: "OK" }]);
    }
    setLoading(false);
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
            setLoading(true);
            const result = await deleteSaleData(item.id);
            if (result) {
              Alert.alert("Success", "Data deleted", [{ text: "OK" }]);
              onRefreshOnChange();
            } else {
              Alert.alert("Failure", "Data deletion failed", [{ text: "OK" }]);
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  if(loading) 
    return <AnimatedActivityIndicator/>

  return (

    <TouchableOpacity
      className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
      onPress={onPress}
    >
      {/* First Row */}
      <View className="flex-row justify-between mb-3">
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
          <Text className="text-gray-700 font-semibold">Rate Per Carton: </Text>
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
              onChangeText={(text) => handleEditChange('amount', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-700">{item.amount}</Text>
          )}
        </View>
        <View className={`flex-1 pl-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
          <Text className="text-gray-700 font-semibold">Paid: </Text>
          {editItem === item ? (
            <View className="border border-gray-300 px-3 py-2 rounded-lg bg-white">
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
                className="text-gray-700"
              />
            </View>
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
            <View className="border border-gray-300 px-3 py-2 rounded-lg bg-white">
              <RNPickerSelect
                onValueChange={(value) => handleEditChange('paid', value)}
                items={vendorData}
                placeholder={{
                  label: item.vendorName && vendorData.find(v => v.label === item.vendorName)
                    ? item.vendorName
                    : 'Select Vendor...',
                  value: item.vendorName,
                }} className="text-gray-700"
              />
            </View>
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
              <Text className="text-gray-700">{item.createdBy}</Text>
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
                <Text className="text-gray-700">{item.updatedBy}</Text>
              )}
            </View>
          </View>

          {/* Edit and Delete Buttons */}
          <View className="flex-row justify-end mt-4">
            {editItem === item ? (
              <View className="flex-1 flex-row justify-between">
                <MaterialIcons name="cancel" size={30} color="black" onPress={() => setEditItem(null)} />
                <Entypo name="save" size={30} color="black" onPress={handleSavePress} />

              </View>
            ) : (
              <View className="flex-1 flex-row justify-between">
                <TrashIcon size={24} color="black" onPress={handleDeletePress} />
                <PencilSquareIcon size={24} color="black" onPress={() => handleEditPress(item)} />
              </View>
            )}
          </View>         
        </View>
      )}
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
