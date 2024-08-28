import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Alert } from 'react-native';
import { updateMaterialConsumptionData, deleteMaterialConsumptionData } from '@/lib/materialConsumption';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MaterialConsumptionHistoryItem = ({ item, isExpanded, onRefreshOnChange, onPress, editItem, setEditItem }) => {

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
                        const result = await deleteMaterialConsumptionData(item.id);
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

    return (
        <TouchableOpacity
            className="bg-white p-4 mx-2 rounded-lg shadow-lg mb-4 border border-gray-200"
            onPress={onPress}
        >
            <Text className="text-xl font-bold text-gray-800 mb-4">
                {new Date(item.consumptionDate).toDateString()}
            </Text>

            {/* First Row */}
            <View className="flex-row justify-between mb-3">
                <View className={`flex-1 pr-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
                    <Text className="text-gray-700 font-semibold">Material: </Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                            value={edited.materialName.toString()}
                            onChangeText={(text) => handleEditChange('material', text)}
                            keyboardType="numeric"
                            editable={false}
                        />
                    ) : (
                        <Text className="text-gray-700">{item.materialName}</Text>
                    )}
                </View>
                <View className={`flex-1 pl-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
                    <Text className="text-gray-700 font-semibold">Quantity: </Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                            value={edited.quantity.toString()}
                            onChangeText={(text) => handleEditChange('quantity', text)}
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text className="text-gray-700">{item.quantity} {item.unitSymbol}</Text>
                    )}
                </View>

            </View>


            {isExpanded && (
                <View>
                    {/* Second Row */}
                    <View className="flex-row justify-between mb-2">

                        <View className={`flex-1 pr-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
                            <Text className="text-gray-700 font-semibold">Created By:</Text>
                            {editItem === item ? (
                                <TextInput
                                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-gray-200"
                                    value={item.createdBy}
                                    editable={false}
                                />
                            ) : (
                                <Text className="text-gray-700 ml-2">{item.createdBy}</Text>
                            )}
                        </View>
                        <View className={`flex-1 pl-4 ${editItem === item ? '' : 'flex-row items-center'}`}>
                            <Text className="text-gray-700 font-semibold">Updated By:</Text>
                            {editItem === item ? (
                                <TextInput
                                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-gray-200"
                                    value={item.updatedBy
                                    }
                                    editable={false}
                                />
                            ) : (
                                <Text className="text-gray-700 ml-2">{item.updatedBy}</Text>
                            )}
                        </View>
                    </View>


                    {/* Edit and Delete Buttons */}
                    <View className="flex-row justify-between">
                        {editItem === item ? (
                            <View className="flex-1 flex-row justify-between">
                                <MaterialIcons name="cancel" size={30} color="black" onPress={() => setEditItem(null)} />
                                <Entypo name="save" size={30} color="black" onPress={handleSavePress} />

                            </View>
                        ) : (
                            <View className="flex-1 flex-row justify-between">
                                <TrashIcon size={24} color="#FF0000" onPress={handleDeletePress} />
                                <PencilSquareIcon size={24} color="#4A90E2" onPress={() => handleEditPress(item)} />
                            </View>
                        )}

                        {loading && (
                            <Modal transparent={true}>
                                <View className="flex-1 justify-center items-center">
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
