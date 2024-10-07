import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { deleteVendor, updateVendor } from '@/lib/vendor';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';


const VendorItem = ({ item, isExpanded, onPress, editItem, setEditItem, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

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

        const result = await updateVendor(edited);

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
                        const result = await deleteVendor(item.id);
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

                {/* First Row */}
                <View className={`flex-1 pr-2 mb-3 ${editItem === item ? '' : 'flex-row items-center'}`}>
                    <Text className="text-gray-700 font-semibold">Vendor Name: </Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                            value={edited.name.toString()}
                            onChangeText={(text) => handleEditChange('name', text)}
                        />
                    ) : (
                        <Text className="text-gray-700">{item.name}</Text>
                    )}
                </View>


                <View className={`flex-1 pr-2 mb-3 ${editItem === item ? '' : 'flex-row items-center'}`}>
                    <Text className="text-gray-700 font-semibold">Phone Number: </Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                            value={edited.phoneNumber.toString()}
                            onChangeText={(text) => handleEditChange('phoneNumber', text)}
                            keyboardType='numeric'
                        />
                    ) : (
                        <Text className="text-gray-700">{item.phoneNumber}</Text>
                    )}
                </View>


                <View className={`flex-1 pr-2 mb-3 ${editItem === item ? '' : 'flex-row items-center'}`}>
                    <Text className="text-gray-700 font-semibold">Address: </Text>
                    {editItem === item ? (
                        <TextInput
                            className="border border-gray-300 px-3 p-2 rounded-md text-gray-700"
                            value={edited.address.toString()}
                            onChangeText={(text) => handleEditChange('address', text)}
                        />
                    ) : (
                        <Text className="text-gray-700">{item.address}</Text>
                    )}
                </View>

                {isExpanded && (
                    <View>
                        {/* Edit and Delete Buttons */}
                        <View className="flex-row justify-between mt-5 mb-5">
                            {editItem === item ? (
                                <View className="flex-1 flex-row justify-between">
                                    <MaterialIcons name="cancel" size={30} color="black" onPress={() => setEditItem(null)} />
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

export default VendorItem;
