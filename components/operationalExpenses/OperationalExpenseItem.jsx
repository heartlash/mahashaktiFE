import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { updateOperationalExpenses, deleteOperationalExpenses } from '@/lib/operationalExpense';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import RNPickerSelect from 'react-native-picker-select';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const OperationalExpenseItem = ({ item, isExpanded, operationalExpenseItems, onPress, editItem, setEditItem, onRefreshOnChange }) => {

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
        const result = await updateOperationalExpenses(updatedItem);
        if (result.data != null) {
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
                        const result = await deleteOperationalExpenses(item.id);
                        if (result != null) {
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
                {new Date(item.expenseDate).toDateString()}
            </Text>

            {/* First Row */}
            <View className="flex-row justify-between mb-3">
                <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                    <Text className="text-gray-700 font-semibold">Item: </Text>
                    {editItem === item ? (
                        <View className="border border-gray-300 px-3 py-2 rounded-lg bg-white">
                            <RNPickerSelect
                                onValueChange={(value) => handleEditChange('itemId', value)}
                                items={operationalExpenseItems}
                                placeholder={{
                                    label: item.itemName && operationalExpenseItems.find(v => v.label === item.itemName)
                                        ? item.itemName
                                        : 'Select Expense Item...',
                                    value: item.itemName,
                                }} className="text-gray-700"
                            />
                        </View>
                    ) : (
                        <Text className="text-gray-700">{item.itemName}</Text>)}
                </View>
                <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                    <Text className="text-gray-700 font-semibold">Amount:</Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 "
                            value={edited.amount.toString()}
                            onChangeText={(text) => handleEditChange('amount', text)}
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text className="text-gray-700 ml-2">{item.amount}</Text>
                    )}
                </View>
            </View>

            {isExpanded && (
                <View>
                    <View className="flex-row justify-between mb-3">
                        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                            <Text className="text-gray-700 font-semibold">Created By:</Text>
                            {editItem === item ? (
                                <TextInput
                                    className="border border-gray-300 p-2 rounded-md text-gray-700 ml-2 bg-gray-200"
                                    value={item.createdBy}
                                    editable={false}
                                />
                            ) : (
                                <Text className="text-gray-700 ml-2">{item.createdBy}</Text>
                            )}
                        </View>
                        <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
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
                    </View>



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
                    </View></View>)}

        </TouchableOpacity>

    );
};

export default OperationalExpenseItem;
