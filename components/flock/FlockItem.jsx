import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { updateFlockChange, deleteFlockChange } from '@/lib/flock';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { pickerSelectStyles } from '@/styles/GlobalStyles';



const FlockItem = ({ item, isExpanded, onPress, editItem, setEditItem, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

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
        var updatedItem = { ...edited, updatedBy: userInfo.name };
        updatedItem.count = Math.abs(updatedItem.count)
        const result = await updateFlockChange(updatedItem);
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
                        const result = await deleteFlockChange(item.id);
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
                <Text className="text-lg font-bold mb-2">
                    {new Date(item.date).toDateString()}
                </Text>
                {/* First Row */}
                <View className="flex-row justify-between mb-2">
                    <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
                        <Text className="text-gray-700 font-semibold">Count Change: </Text>
                        {editItem === item ? (
                            <TextInput
                                className="border border-gray-300 p-2 rounded text-gray-600"
                                value={Math.abs(edited.count).toString()}
                                onChangeText={(text) => handleEditChange('count', text)}
                                keyboardType="numeric"
                            />
                        ) : (
                            <Text className="text-gray-600">{Math.abs(item.count)}</Text>
                        )}
                    </View>

                    <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
                        <Text className="text-gray-700 font-semibold">Increase: </Text>
                        {editItem === item ? (
                            <RNPickerSelect
                                onValueChange={(value) => handleEditChange("added", value)}
                                items={[
                                    { label: 'Yes', value: 'true' },
                                    { label: 'No', value: 'false' },
                                ]}
                                style={pickerSelectStyles}
                                placeholder={{ label: item.count > 0 ? 'Yes' : 'No', value: item.count > 0 ? 'true' : 'false' }}
                            />
                        ) : (
                            <Text className="text-gray-600">{item.count > 0 ? 'Yes' : 'No'}</Text>
                        )}
                    </View>
                </View>

                {/* Second Row */}
                <View className="flex-row justify-between mb-2">
                    <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
                        <Text className="text-gray-700 font-semibold">Remarks: </Text>
                        {editItem === item ? (
                            <TextInput
                                className="border border-gray-300 p-2 rounded text-gray-600"
                                value={edited.remarks.toString()}
                                onChangeText={(text) => handleEditChange('remarks', text)}
                            />
                        ) : (
                            <Text className="text-gray-600">{item.remarks}</Text>
                        )}

                    </View>
                    {isExpanded && ( <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
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
                            </View>)}

                </View>

                {/* Conditionally render additional content */}
                {isExpanded && (
                    <View>
                        {/* Fourth Row */}
                        <View className="flex-row justify-between mb-2">


                        <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
                                <Text className="text-gray-700 font-semibold">Updated By:</Text>
                                {editItem === item ? (
                                    <TextInput
                                        className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-gray-200"
                                        value={item.updatedBy}
                                        editable={false}
                                    />
                                ) : (
                                    <Text className="text-gray-600 ml-2 flex-1" numberOfLines={1} ellipsizeMode="tail">{item.updatedBy}</Text>
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
                                    <TrashIcon size={24} color="black" onPress={handleDeletePress} />
                                    <PencilSquareIcon size={24} color="black" onPress={() => handleEditPress(item)} />
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>

    );
};

export default FlockItem;
