import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Alert } from 'react-native';
import { deleteProductionData, updateProductionData } from '@/lib/production';
import { getUserInfo } from '@/lib/auth';

const ProductionItem = ({ item, isExpanded, onPress, editItem, setEditItem, setProductionData }) => {

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
    const result = await updateProductionData(updatedItem);
    if (result) {
      setEditItem(null);
      Alert.alert("Success", "Data updated", [{ text: "OK" }]);
      setProductionData((prevData) =>
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
            const result = await deleteProductionData(item.id);
            if (result) {
              Alert.alert("Success", "Data deleted", [{ text: "OK" }]);
              setProductionData((prevData) =>
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
      <Text className="text-lg font-bold mb-2">
        {new Date(item.productionDate).toDateString()}
      </Text>

      {/* First Row */}
      <View className="flex-row justify-between mb-2">
        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Produced: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.producedCount.toString()}
              onChangeText={(text) => handleEditChange('producedCount', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.producedCount}</Text>
          )}
        </View>
        <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Percentage: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value="To be calculated"
              editable={false}
            />
          ) : (
            <Text className="text-gray-600">{item.productionPercentage}</Text>
          )}

        </View>
      </View>

      {/* Second Row */}
      <View className="flex-row justify-between mb-2">
        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Broken:</Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.brokenCount.toString()}
              onChangeText={(text) => handleEditChange('brokenCount', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.brokenCount}</Text>
          )}
        </View>
        <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Reason: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.brokenReason}
              onChangeText={(text) => handleEditChange('brokenReason', text)}
            />
          ) : (
            <Text className="text-gray-600">{item.brokenReason}</Text>
          )}
        </View>
      </View>

      {/* Third Row */}
      <View className="flex-row justify-between mb-2">
        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Gift: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.giftCount.toString()}
              onChangeText={(text) => handleEditChange('giftCount', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.giftCount}</Text>
          )}
        </View>
        <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
          <Text className="text-gray-600">Self Use: </Text>
          {editItem === item ? (
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              value={edited.selfUseCount.toString()}
              onChangeText={(text) => handleEditChange('selfUseCount', text)}
              keyboardType="numeric"
            />
          ) : (
            <Text className="text-gray-600">{item.selfUseCount}</Text>
          )}
        </View>
      </View>

      {/* Conditionally render additional content */}
      {isExpanded && (
        <View>
          {/* Fourth Row */}
          <View className="flex-row justify-between mb-2">
            <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
              <Text className="text-gray-600">Saleable Eggs: </Text>
              {editItem === item ? (
                <TextInput
                  className="border border-gray-300 p-2 rounded text-gray-600"
                  value="To be calculated"
                  editable={false}
                />
              ) : (
                <Text className="text-gray-600">{item.saleableCount}</Text>
              )}
            </View>
            <View className="flex-1 pl-2">
              <Text className="text-gray-600">Created By: </Text>
              <Text className="text-gray-600">{item.createdBy}</Text>
            </View>
          </View>

          <View className="flex-row mb-2">
            <Text className="text-gray-600">Updated By: </Text>
            <Text className="text-gray-600">{item.updatedBy}</Text>
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

export default ProductionItem;