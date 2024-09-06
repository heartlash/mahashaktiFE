import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import RNPickerSelect from 'react-native-picker-select';
import { saveFlockChange } from '@/lib/flock';
import moment from 'moment-timezone';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { pickerSelectStyles } from '@/styles/GlobalStyles';


const CreateFlockChange = ({ onClose, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [changeDate, setChangeDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    const [newFlockChange, setNewFlockChange] = useState(null);


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
            setChangeDate(moment(date).tz(moment.tz.guess()).format('YYYY-MM-DD'));
        }
        hideDatePicker();
    };

    const handleNewChange = (field, value) => {
        setNewFlockChange((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const saveNewFlockChange = async () => {
        setSubmitModalVisible(true)

        const userInfo = await getUserInfo();
        var temp = newFlockChange
        temp.createdBy = userInfo.name
        temp.date = changeDate

        const result = await saveFlockChange(temp);
        setSubmitModalVisible(false)
        if (result.errorMessage == null) {
            setNewFlockChange(null)
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
            <View className="flex-row justify-between mb-2 ">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Count: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('count', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Increase: </Text>
                    <RNPickerSelect
                        onValueChange={(text) => handleNewChange('added', text)}
                        items={[
                            { label: 'Yes', value: 'true' },
                            { label: 'No', value: 'false' },
                        ]}
                        style={pickerSelectStyles}
                    />
                </View>
            </View>

            <View className="flex-row justify-between mb-2 ">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Remarks: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('remarks', text)}
                    />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Date: </Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 p-2 rounded-lg bg-white"
                    >
                        <Text className="text-gray-600">
                            {changeDate}
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
                <Entypo name="save" size={30} color="black" onPress={saveNewFlockChange} />

            </View>
        </View>
    )
}

export default CreateFlockChange
