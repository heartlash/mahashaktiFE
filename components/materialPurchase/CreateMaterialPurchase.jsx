import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { saveMaterialPurchase } from '@/lib/materialPurchase';
import moment from 'moment-timezone';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import { pickerSelectStyles } from '@/styles/GlobalStyles';


const CreateMaterialPurchase = ({ onClose, materials, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    const [newMaterialPurchase, setNewMaterialPurchase] = useState(null);
    const [amount, setAmount] = useState('');
    const [material, setMaterial] = useState();



    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        if (date > new Date()) {
            Alert.alert('Invalid Date', 'You cannot select a future date.');
        } else {
            setPurchaseDate(moment(date).tz(moment.tz.guess()).format('YYYY-MM-DD'));
        }
        hideDatePicker();
    };

    const handleNewChange = (field, value) => {
        setNewMaterialPurchase((prevItem) => {
            const updatedItem = {
                ...prevItem,
                [field]: value,
            };

            if(field == 'materialId') {
                for(var material of materials)
                    if(material.value == value) setMaterial(material)
            }

            // Check if the field is either 'quantity' or 'rate' and update the 'amount' accordingly
            if (field === 'quantity' || field === 'rate') {
                const quantity = field === 'quantity' ? parseFloat(value) : parseFloat(updatedItem.quantity);
                const rate = field === 'rate' ? parseFloat(value) : parseFloat(updatedItem.rate);

                // Calculate the amount only if both quantity and rate are valid numbers
                if (!isNaN(quantity) && !isNaN(rate)) {
                    updatedItem.amount = (quantity * rate).toFixed(2);
                    setAmount(updatedItem.amount)
                } else {
                    updatedItem.amount = ''; // Clear the amount if the inputs are invalid
                    setAmount('')
                }
            }
            return updatedItem;
        });
    };

    const saveNewMaterialPurchase = async () => {
        setSubmitModalVisible(true)
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = newMaterialPurchase
        temp.createdBy = userInfo.name
        temp.materialId = material.value
        temp.purchaseDate = purchaseDate

        const result = await saveMaterialPurchase(temp);
        setSubmitModalVisible(false)
        if (result.errorMessage == null) {
            setNewMaterialPurchase(null)
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
        <View className="bg-white p-4 mx-2 rounded-lg shadow-lg my-4 border border-gray-200">
            <View className="flex-row justify-between mb-2">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Item:</Text>

                    <RNPickerSelect
                        onValueChange={(value) => handleNewChange('materialId', value)}
                        items={materials}
                        placeholder={{ label: 'Choose Material', value: null }}
                        style={pickerSelectStyles} />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Purchase Date: </Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                    >
                        <Text className="text-gray-600">
                            {purchaseDate}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        maximumDate={new Date()} // Prevent selecting future dates
                    />

                </View>
            </View>

            <View className="flex-row justify-between mb-2">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Quantity {material == null ? '' : material.unit}: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('quantity', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Rate: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('rate', text)}
                        keyboardType="numeric"
                    />

                </View>

            </View>
            <View className="flex-row justify-between mb-2">

                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Amount: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        value={amount}
                        editable={false} // Make the field non-editable
                    />

                </View>
            </View>

            <View className="flex-row justify-between mt-4">
                <MaterialIcons name="cancel" size={30} color="black" onPress={onClose} />
                <Entypo name="save" size={30} color="black" onPress={saveNewMaterialPurchase} />

            </View>
        </View>
    )
}

export default CreateMaterialPurchase