import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { updateFlockChange, deleteFlockChange } from '@/lib/flock';
import { getUserInfo } from '@/lib/auth';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const FlockItem = ({ item, isExpanded, onPress, editItem, setEditItem, setFlockChangeData }) => {

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
        var updatedItem = { ...edited, updatedBy: userInfo.name };
        updatedItem.count = Math.abs(updatedItem.count)
        console.log("see updated item:", updatedItem)
        const result = await updateFlockChange(updatedItem);
        if (result) {
            setEditItem(null);
            Alert.alert("Success", "Data updated", [{ text: "OK" }]);
            setFlockChangeData((prevData) =>
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
                        const result = await deleteFlockChange(item.id);
                        if (result) {
                            Alert.alert("Success", "Data deleted", [{ text: "OK" }]);
                            setFlockChangeData((prevData) =>
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

    if (loading)
        return <AnimatedActivityIndicator />

    return (

        <TouchableOpacity
            className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
            onPress={onPress}
        >

            <Text className="text-lg font-bold mb-2">
                {new Date(item.date).toDateString()}
            </Text>
            {/* First Row */}
            <View className="flex-row justify-between mb-2">
                <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
                    <Text className="text-gray-600">Count Change: </Text>
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
                    <Text className="text-gray-600">Increase: </Text>
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
                    <Text className="text-gray-600">Remarks: </Text>
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
                {isExpanded && (<View className="flex-1 pl-2 flex-row">
                    <Text className="text-gray-600">Created By: </Text>
                    <Text className="text-gray-600">{item.createdBy}</Text>
                </View>)}

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
        </TouchableOpacity>

    );
};

export default FlockItem;


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});