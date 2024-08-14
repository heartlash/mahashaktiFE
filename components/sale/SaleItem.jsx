import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { deleteSaleData, updateSaleData, groupSalesByDate } from '@/lib/sale';
import { getUserInfo } from '@/lib/auth';


const SaleItem = ({ item, isExpanded, onPress, editItem, setEditItem, setSaleData }) => {

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

    console.log("see edit item", item)
  };

  const handleSavePress = async () => {
    setLoading(true);
    const userInfo = await getUserInfo();
    const updatedItem = { ...edited, updatedBy: userInfo.name };
    const result = await updateSaleData(updatedItem);
    if (result) {
      setEditItem(null);
      Alert.alert("Success", "Data updated", [{ text: "OK" }]);
      setSaleData((prevData) =>
        prevData.map((data) => (data.id === updatedItem.id ? updatedItem : data))
      );
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
              setSaleData((prevData) =>
                prevData.filter((data) => data.id !== item.id)
              );
            } else {
              Alert.alert("Failure", "Data deletion failed", [{ text: "OK" }]);
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  
  return (

    <TouchableOpacity
      className="bg-white p-4 rounded-lg shadow-md mb-4"
      onPress={onPress}
    >

      {/* First Row */}
      <View className="flex-row justify-between mb-2">
        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Eggs Sold: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.soldCount.toString()}
              onChangeText={(text) => handleEditChange('soldCount', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.soldCount}</Text>
          )}
        </View>
        <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Rate: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.rate.toString()}
              onChangeText={(text) => handleEditChange('rate', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.rate}</Text>
          )}

        </View>
      </View>

      {/* Second Row */}
      <View className="flex-row justify-between mb-2">
        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Amount: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.amount.toString()}
              onChangeText={(text) => handleEditChange('amount', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.amount}</Text>
          )}
        </View>
        <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Paid: </Text>
          {editItem === item ? (
            <View className="border border-gray-300 p-2 rounded bg-white">
              <RNPickerSelect
                onValueChange={(value) => handleEditChange('paid', value)}
                items={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
                placeholder={{ label: item.paid, value: item.paid ? true : false }}
                className="text-gray-600" />
            </View>
          ) : (
            <Text className="text-gray-600">{item.paid}</Text>
          )}
        </View>
      </View>

      {/* Third Row */}
      <View className="flex-row justify-between mb-2">
        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Vendor: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.vendorName.toString()}
              onChangeText={(text) => handleEditChange('vendor', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.vendorName}</Text>
          )}
        </View>
        {isExpanded && (<View className="flex-1 pr-2 flex-row">
          <Text className="text-gray-600">Created By: </Text>
          <Text className="text-gray-600">{item.createdBy}</Text>
        </View>
        )}
      </View>

      {/* Conditionally render additional content */}
      {isExpanded && (
        <View>
          {/* Fourth Row */}
          <View className="flex-row justify-between mb-2">
            <View className="flex-1 pr-2 flex-row">
              <Text className="text-gray-600">Updated By: </Text>
              <Text className="text-gray-600">{item.updatedBy}</Text>
            </View>
          </View>

          {/* Edit and Delete Buttons */}
          <View className="flex-row justify-between mt-4">

            {editItem === item ? (
              <View className="flex-1 pr-2 flex-row">
                <Button title="Cancel" onPress={() => setEditItem(null)} />

                <Button title="Save" onPress={handleSavePress} />
              </View>
            ) : (
              <View className="flex-1 pr-2 flex-row">
                <Button title="Delete" color="red" onPress={handleDeletePress} />

                <Button title="Edit" onPress={() => handleEditPress(item)} />
              </View>

            )}

            {loading && (
              <Modal transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text>Loading...</Text>
                </View>
              </Modal>
            )}

          </View>
        </View>
      )}
    </TouchableOpacity>

  );
};

export default SaleItem;
