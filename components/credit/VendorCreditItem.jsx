import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CreatePayment from './CreatePayment';
import { formatMoneyOrNumber } from '@/lib/util';

const VendorCreditItem = ({ item, isExpanded, onRefreshOnChange, onPress, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

    const navigation = useNavigation();

    const [createOperationalExpense, setCreateOperationalExpense] = useState(false)

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
        >

            <Animated.View
                entering={FadeInDown.duration(1000).springify()}
            >
                <View className="flex-row justify-between mb-3">
                    <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
                    <Text className="text-lg font-semibold text-gray-800">₹{formatMoneyOrNumber(item.totalCreditAmount)}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-semibold">Last Payment</Text>
                    <Text className="text-gray-700">{item.lastRemark === "NA" ? "NA" : `₹${item.lastAmount}`}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-semibold">Last Payment Date</Text>
                    <Text className="text-gray-700">{item.lastAmountSpent === "NA" ? "NA" : `${item.lastPaymentDate}`}</Text>
                </View>
            </Animated.View>
            {/* Conditionally render the CreateMaterialPurchase component only for the selected item */}
            {isExpanded && (
                <>

                    <View className="flex-row justify-between mt-5 mb-2">

                        <FontAwesome5
                            name="list"
                            size={17}
                            color="black"
                            onPress={() => navigation.navigate('paymentsHistory', { id: item.id, name: item.name })} />
                        <FontAwesome6
                            name="money-check-dollar"
                            size={27}
                            color="green"
                            onPress={() => setCreateOperationalExpense(true)}
                        />
                    </View>

                    {createOperationalExpense && (
                        <View className="w-full px-4 mb-4">
                            <CreatePayment
                                vendor={item}
                                onClose={() => setCreateOperationalExpense(false)}
                                onRefreshOnChange={onRefreshOnChange}
                                operationalExpenseItem={item}
                                setSuccessModalVisible={setSuccessModalVisible}
                                setFailureModalVisible={setFailureModalVisible}
                                setSubmitModalVisible={setSubmitModalVisible}
                            />
                        </View>
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

export default VendorCreditItem;
