import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Alert } from 'react-native';
import { updateMaterialConsumptionData, deleteMaterialConsumptionData } from '@/lib/materialConsumption';
import { getUserInfo } from '@/lib/auth';

const MaterialConsumptionHistoryItem = ({ item, isExpanded, onPress, editItem, setEditItem, setMaterialConsumptionHistoryData }) => {

    const [edited, setEdited] = useState(item);
    const [loading, setLoading] = useState(false);

    console.log("see item: ", item)

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
        const result = await updateMaterialConsumptionData(updatedItem);
        if (result) {
            setEditItem(null);
            Alert.alert("Success", "Data updated", [{ text: "OK" }]);
            setMaterialConsumptionHistoryData((prevData) =>
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
                        const result = await deleteMaterialConsumptionData(item.id);
                        if (result) {
                            Alert.alert("Success", "Data deleted", [{ text: "OK" }]);
                            setMaterialConsumptionHistoryData((prevData) =>
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
                {new Date(item.consumptionDate).toDateString()}
            </Text>

            {/* First Row */}
            <View className="flex-row justify-between mb-2">
                <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
                    <Text className="text-gray-600">Material: </Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 p-2 rounded text-gray-600"
                            value={edited.materialName.toString()}
                            onChangeText={(text) => handleEditChange('material', text)}
                            keyboardType="numeric"
                            editable={false}
                        />
                    ) : (
                        <Text className="text-gray-600">{item.materialName}</Text>
                    )}
                </View>
                <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
                    <Text className="text-gray-600">Quantity:</Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 p-2 rounded text-gray-600"
                            value={edited.quantity.toString()}
                            onChangeText={(text) => handleEditChange('quantity', text)}
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text className="text-gray-600">{item.quantity}</Text>
                    )}
                </View>
               
            </View>

    

            {/* Second Row */}
            <View className="flex-row justify-between mb-2">

                <View className="flex-1 pl-2">
                    <Text className="text-gray-600">Created By: </Text>
                    <Text className="text-gray-600">{item.createdBy}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <View className="flex-row mb-2">
                        <Text className="text-gray-600">Updated By: </Text>
                        <Text className="text-gray-600">{item.updatedBy}</Text>
                    </View>
                </View>
            </View>

            {isExpanded && (
                <View>
                    {/* Fourth Row */}




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

export default MaterialConsumptionHistoryItem;
