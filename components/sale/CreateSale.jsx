import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { saveSaleData } from '@/lib/sale';
import moment from 'moment-timezone';
import RNPickerSelect from 'react-native-picker-select';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const CreateSale = ({ onClose, vendorData, onRefreshOnChange }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [saleDate, setSaleDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false)
    const [newItem, setNewItem] = useState(null);


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
            setSaleDate(moment(date).tz(moment.tz.guess()).format('YYYY-MM-DD'));
        }
        hideDatePicker();
    };



    const handleNewChange = (field, value) => {
        setNewItem((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const saveNewItem = async () => {
        setLoading(true)
        console.log("see on save: ", moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'))
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = newItem
        temp.createdBy = userInfo.name
        console.log("See time string:", saleDate)
        temp.saleDate = saleDate
        temp.vendorId = temp.vendor
        console.log("see temp:", temp)
        const result = await saveSaleData(temp);
        console.log("see result: ", result)
        if (result.errorMessage == null) {
            setNewItem(null)
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
                    <Text className="text-gray-700 font-semibold">Eggs Sold: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('soldCount', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Sale Date: </Text>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className="border border-gray-300 p-2 rounded bg-white"
                    >
                        <Text className="text-gray-600">
                            {saleDate}
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
                    <Text className="text-gray-700 font-semibold">Rate: </Text>

                    <TextInput
                        className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
                        onChangeText={(text) => handleNewChange('rate', text)}
                        keyboardType="numeric"
                    />

                </View>
                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Amount: </Text>

                    <TextInput
                        className="border border-gray-300 p-2 rounded text-gray-600"
                        onChangeText={(text) => handleNewChange('amount', text)}
                    />

                </View>
            </View>

            <View className="flex-row justify-between mb-2">

                <View className="flex-1 pr-2">
                    <Text className="text-gray-700 font-semibold">Vendor: </Text>
                    <View className="border border-gray-300 p-2 rounded bg-white">
                        <RNPickerSelect
                            onValueChange={(value) => handleNewChange('vendor', value)}
                            items={vendorData}
                            placeholder={{ label: 'Choose Vendor', value: null }}
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700" />
                    </View>

                </View>

                <View className="flex-1 pl-2">
                    <Text className="text-gray-700 font-semibold">Paid:</Text>
                    <View className="border border-gray-300 p-2 rounded bg-white">
                        <RNPickerSelect
                            onValueChange={(value) => handleNewChange('paid', value)}
                            items={[
                                { label: 'Yes', value: true },
                                { label: 'No', value: false },
                            ]}
                            placeholder={{ label: 'Choose Paid Status', value: null }}
                            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700" />
                    </View>
                </View>

            </View>
            <View className="flex-row justify-between mt-4">
                <MaterialIcons name="cancel" size={30} color="black" onPress={onClose}  />
                <Entypo name="save" size={30} color="black" onPress={saveNewItem} />

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

export default CreateSale