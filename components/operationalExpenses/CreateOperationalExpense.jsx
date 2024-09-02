import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { saveOperationalExpense } from '@/lib/operationalExpense';
import moment from 'moment-timezone';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const CreateOperationalExpenseItem = ({ onClose, operationalExpenseItems, onRefreshOnChange }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [expenseDate, setExpenseDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false)
    const [newOperationalExpense, setNewOperationalExpense] = useState(null);


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
            setExpenseDate(moment(date).tz(moment.tz.guess()).format('YYYY-MM-DD'));
        }
        hideDatePicker();
    };



    const handleNewOperationalExpense = (field, value) => {
        setNewOperationalExpense((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const saveNewOperationalExpense = async () => {
        setLoading(true)
        console.log("see on save: ", moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'))
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = newOperationalExpense
        temp.createdBy = userInfo.name
        temp.expenseDate = expenseDate
        console.log("see temp:", temp)
        const result = await saveOperationalExpense(temp);
        console.log("see result: ", result)
        if (result.errorMessage == null) {
            setNewOperationalExpense(null)
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
        <View className="bg-white p-4 mx-2 rounded-lg shadow-lg mb-4 border border-gray-200">
            <View className="flex-row justify-between mb-2 ">
                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Item:</Text>

                    <View className="border border-gray-300 p-2 rounded bg-white">
                        <RNPickerSelect
                            onValueChange={(value) => handleNewOperationalExpense('itemId', value)}
                            items={operationalExpenseItems}
                            placeholder={{ label: 'Choose Expense Item', value: null }}
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700" />
                    </View>
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Expense Date:</Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 p-2 rounded bg-white"
                    >
                        <Text className="text-gray-600">
                            {expenseDate}
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
                    <Text className="text-gray-700 font-semibold">Amount:</Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewOperationalExpense('amount', text)}
                        keyboardType="numeric"
                    />

                </View>
              
            </View>

            
            <View className="flex-row justify-between mt-4">
                <MaterialIcons name="cancel" size={30} color="black" onPress={onClose} />
                <Entypo name="save" size={30} color="black" onPress={saveNewOperationalExpense} />


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

export default CreateOperationalExpenseItem