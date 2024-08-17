import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { saveMaterialPurchase } from '@/lib/materialPurchase';
import moment from 'moment-timezone';



const CreateMaterialPurchase = ({ onClose, materialId }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false)
    const [newMaterialPurchase, setNewMaterialPurchase] = useState(null);


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
        setNewMaterialPurchase((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const saveNewMaterialPurchase = async () => {
        setLoading(true)
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = newMaterialPurchase
        temp.createdBy = userInfo.name
        temp.materialId = materialId
        temp.purchaseDate = purchaseDate
        console.log("see temp:", temp)
        console.log("see new item:", newMaterialPurchase)

        const result = await saveMaterialPurchase(temp);
        console.log("see result: ", result)
        if (result.errorMessage == null) {
            setNewMaterialPurchase(null)
            Alert.alert(
                "Success",
                "Date saved",
                [{ text: "OK" }],
                { cancelable: false }
            );
            //setCreateProduction(false)

        } else {
            Alert.alert(
                "Failure",
                result.errorMessage,
                [{ text: "OK" }],
                { cancelable: false }
            );
        }

        setLoading(false)

        onClose();

    }

    return (
        <View className="bg-white p-4 rounded-lg shadow-md mb-4">
            <View className="flex-row justify-between mb-2 ">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-600">Quantity: </Text>

                    <TextInput
                        className="border border-gray-300 p-2 rounded text-gray-600"
                        onChangeText={(text) => handleNewChange('quantity', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-600">Purchase Date: </Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 p-2 rounded bg-white"
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
                    <Text className="text-gray-600">Rate: </Text>

                    <TextInput
                        className="border border-gray-300 p-2 rounded text-gray-600"
                        onChangeText={(text) => handleNewChange('rate', text)}
                        keyboardType="numeric"
                    />

                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-600">Amount: </Text>

                    <TextInput
                        className="border border-gray-300 p-2 rounded text-gray-600"
                        onChangeText={(text) => handleNewChange('amount', text)}
                    />

                </View>
            </View>

            <View className="flex-row justify-between mt-4">

                <Button title="Cancel" color="red" onPress={onClose} />
                <Button title="Save" onPress={saveNewMaterialPurchase} />

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
    )
}

export default CreateMaterialPurchase