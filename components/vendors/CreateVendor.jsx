import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { saveVendor } from '@/lib/vendor';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const CreateVendor = ({ onClose, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

    const [newItem, setNewItem] = useState(null);


    const handleNewChange = (field, value) => {
        setNewItem((prevItem) => {
            const updatedItem = {
                ...prevItem,
                [field]: value,
            };
            return updatedItem;
        });
    };

    const saveNewItem = async () => {
        setSubmitModalVisible(true)
        const result = await saveVendor(newItem);
        setSubmitModalVisible(false)
        if (result.errorMessage == null) {
            setNewItem(null)
            setSuccessModalVisible(true)
            setTimeout(() => {
                onRefreshOnChange()
                setSuccessModalVisible(false);
            }, 2000);
            onClose()
        } else {
            setFailureModalVisible(true)
            setTimeout(() => {
                setFailureModalVisible(false);
            }, 2000);
        }

    }

    return (
        <View className="bg-white p-4 mx-2 rounded-lg shadow-lg mb-4 border border-gray-200">

            <View className="mb-3 pr-2">
                <Text className="text-gray-700 font-semibold">Vendor Name: </Text>

                <TextInput
                    className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                    onChangeText={(text) => handleNewChange('name', text)}
                />
            </View>
            <View className="mb-3 pr-2">
                <Text className="text-gray-700 font-semibold">Phone Number: </Text>
                <TextInput
                    className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                    onChangeText={(text) => handleNewChange('phoneNumber', text)}
                    keyboardType='numeric'
                />
            </View>
            <View className="mb-3 pr-2">
                <Text className="text-gray-700 font-semibold">Address: </Text>

                <TextInput
                    className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                    onChangeText={(text) => handleNewChange('address', text)}

                />
            </View>

            <View className="flex-row justify-between mt-4">
                <MaterialIcons name="cancel" size={30} color="black" onPress={onClose} />
                <Entypo name="save" size={30} color="black" onPress={saveNewItem} />
            </View>

        </View>
    )
}

export default CreateVendor