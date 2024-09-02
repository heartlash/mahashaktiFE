import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import RNPickerSelect from 'react-native-picker-select';
import { saveFlockChange } from '@/lib/flock';
import moment from 'moment-timezone';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';


const CreateFlockChange = ({ onClose }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [changeDate, setChangeDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
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
            setChangeDate(moment(date).tz(moment.tz.guess()).format('YYYY-MM-DD'));
        }
        hideDatePicker();
    };

    const handleNewChange = (field, value) => {
        setNewMaterialConsumption((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const saveNewFlockChange = async () => {
        setLoading(true)
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = newMaterialConsumption
        temp.createdBy = userInfo.name
        temp.date = changeDate
        console.log("see temp:", temp)

        const result = await saveFlockChange(temp);
        console.log("see result: ", result)
        if (result.errorMessage == null) {
            setNewMaterialConsumption(null)
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
                    //placeholder={{ label: "Filter By Paid Status...", value: null }}
                    />
                </View>
            </View>

            <View className="flex-row justify-between mb-2 ">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Remarks: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('remarks', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Date: </Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 p-2 rounded bg-white"
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

                {loading && (
                    <AnimatedActivityIndicator />
                )}

            </View>
        </View>
    )
}

export default CreateFlockChange

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