import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { savePayment } from '@/lib/payments';
import moment from 'moment-timezone';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const CreatePayment = ({ onClose, vendor, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [paymentDate, setPaymentDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    const [payment, setPayment] = useState(null);


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
            setPaymentDate(moment(date).tz(moment.tz.guess()).format('YYYY-MM-DD'));
        }
        hideDatePicker();
    };

    const handleNewChange = (field, value) => {
        setPayment((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const saveNewPayment = async () => {
        setSubmitModalVisible(true)
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = payment
        temp.createdBy = userInfo.name
        temp.vendorId = vendor.id
        temp.paymentDate = paymentDate

        const result = await savePayment(temp);
        setSubmitModalVisible(false)
        if (result.errorMessage == null) {
            setPayment(null)
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
                    <Text className="text-gray-700 font-semibold">Payment Date: </Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                    >
                        <Text className="text-gray-600">
                            {paymentDate}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        date={new Date()}
                        maximumDate={new Date()} // Prevent selecting future dates
                    />
                </View>
                <View className="flex-1 pl-2">
                <Text className="text-gray-700 font-semibold">Amount: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('amount', text)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View className="flex-row justify-between mb-2">
                <View className="flex-1">
                    <Text className="text-gray-700 font-semibold">Remarks: </Text>
                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('remarks', text)}
                    />
                </View>
            </View>


            <View className="flex-row justify-between mt-4">
                <MaterialIcons name="cancel" size={30} color="black" onPress={onClose} />
                <Entypo name="save" size={30} color="black" onPress={saveNewPayment} />

            </View>
        </View>
    )
}

export default CreatePayment


