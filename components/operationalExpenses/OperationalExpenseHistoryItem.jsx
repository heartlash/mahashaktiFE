import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { updateOperationalExpenses, deleteOperationalExpenses } from '@/lib/operationalExpense';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import RNPickerSelect from 'react-native-picker-select';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { pickerSelectStyles } from '@/styles/GlobalStyles';

const OperationalExpenseHistoryItem = ({ item, isExpanded, operationalExpenseItems, onPress, editItem, setEditItem, onRefreshOnChange,
    setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible
}) => {

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
        const result = await updateOperationalExpenses(updatedItem);
        setSubmitModalVisible(false)
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
                        const result = await deleteOperationalExpenses(item.id);
                        setSubmitModalVisible(false)
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
                <Text className="text-lg font-bold text-gray-800 mb-4">
                    {new Date(item.expenseDate).toDateString()}
                </Text>

                {/* First Row */}
                <View className="flex-row justify-between mb-3">
                    <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                        <Text className="text-gray-700 font-semibold">Item: </Text>
                        {editItem === item ? (
                            <RNPickerSelect
                                onValueChange={(value) => handleEditChange('itemId', value)}
                                items={operationalExpenseItems}
                                placeholder={{
                                    label: item.itemName && operationalExpenseItems.find(v => v.label === item.itemName)
                                        ? item.itemName
                                        : 'Select Expense Item...',
                                    value: item.itemName,
                                }}
                                style={pickerSelectStyles}
                            />
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
                            <Text className="text-gray-700 ml-2">₹{item.amount}</Text>
                        )}
                    </View>
                </View>

                {isExpanded && (
                    <View>
                        <View className="flex-row justify-between mb-3">
                            <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                                <Text className="text-gray-700 font-semibold">Remarks: </Text>
                                {editItem === item ? (
                                    <TextInput
                                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 "
                                        value={(edited.remarks || '').toString()}
                                        onChangeText={(text) => handleEditChange('remarks', text)}
                                    />
                                ) : (
                                    <Text className="text-gray-600 ml-2 flex-1" numberOfLines={1} ellipsizeMode="tail">{item.remarks}</Text>
                                )}
                            </View>
                            <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                                <Text className="text-gray-700 font-semibold">Created By:</Text>
                                {editItem === item ? (
                                    <TextInput
                                        className="border border-gray-300 p-2 rounded-md text-gray-700 bg-gray-200"
                                        value={item.createdBy}
                                        editable={false}
                                    />
                                ) : (
                                    <Text className="text-gray-600 ml-2 flex-1" numberOfLines={1} ellipsizeMode="tail">{item.createdBy}</Text>

                                )}
                            </View>
                        </View>
                        
                        <View className="flex-row justify-between mb-3">
                            <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row items-center'}`}>
                                <Text className="text-gray-700 font-semibold">Updated By:</Text>
                                {editItem === item ? (
                                    <TextInput
                                        className="border border-gray-300 p-2 rounded-md text-gray-700  bg-gray-200"
                                        value={item.updatedBy}
                                        editable={false}
                                    />
                                ) : (
                                    <Text className="text-gray-600 ml-2 flex-1" numberOfLines={1} ellipsizeMode="tail">{item.updatedBy}</Text>

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
                                    <TrashIcon size={24} color="black" onPress={handleDeletePress} />
                                    <TouchableOpacity onPress={() => handleEditPress(item)}>
                                        <PencilSquareIcon size={28} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View></View>)}
            </Animated.View>
        </TouchableOpacity>

    );
};

export default OperationalExpenseHistoryItem;
