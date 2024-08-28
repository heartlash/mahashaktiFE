import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { saveMaterialConsumption } from '@/lib/materialConsumption';
import moment from 'moment-timezone';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const CreateMaterialConsumption = ({ onClose, materialId, onRefreshOnChange }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [consumptionDate, setConsumptionDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false)
    const [newMaterialConsumption, setNewMaterialConsumption] = useState(null);


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
            setProductionDate(date);
        }
        hideDatePicker();
    };

    const handleNewChange = (field, value) => {
        setNewMaterialConsumption((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const saveNewMaterialConsumption = async () => {
        setLoading(true)
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = newMaterialConsumption
        temp.createdBy = userInfo.name
        temp.materialId = materialId
        temp.consumptionDate = consumptionDate
        console.log("see temp:", temp)

        const result = await saveMaterialConsumption(temp);
        console.log("see result: ", result)
        if (result.errorMessage == null) {
            setNewMaterialConsumption(null)
            Alert.alert(
                "Success",
                "Date saved",
                [{ text: "OK" }],
                { cancelable: false }
            );
            onRefreshOnChange();

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
        <View className="bg-white p-4 mx-2 rounded-lg shadow-lg my-4 border border-gray-200">
            <View className="flex-row justify-between mb-2 ">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Quantity: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('quantity', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Consumption Date: </Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                    >
                        <Text className="text-gray-600">
                            {consumptionDate}
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

            <View className="flex-row justify-between mt-4">

                <MaterialIcons name="cancel" size={30} color="black" onPress={onClose} />
                <Entypo name="save" size={30} color="black" onPress={saveNewMaterialConsumption} />

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

export default CreateMaterialConsumption