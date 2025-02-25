import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CreateOperationalExpense from './CreateOperationalExpense';
import { formatMoneyOrNumber } from '@/lib/util';

const OperationalExpenseItem = ({ item, isExpanded, onRefreshOnChange, onPress, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

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
          <Text className="text-xl font-semibold text-gray-800">{item.item}</Text>
          <Text className="text-lg font-semibold text-gray-800">₹{formatMoneyOrNumber(item.amountSpent)}</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Remarks</Text>
          <Text className="text-gray-700">{item.lastRemark === "NA" ? "NA" : `${item.lastRemark}`}</Text> 
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Amount Spent</Text>
          <Text className="text-gray-700">{item.lastAmountSpent === "NA" ? "NA" : `₹${formatMoneyOrNumber(item.lastAmountSpent)}`}</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Last Expense Date</Text>
          <Text className="text-gray-700">{item.lastExpenseDate === "NA" ? "NA" : `${item.lastExpenseDate}`}</Text> 
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
              onPress={() => navigation.navigate('operationalExpensesHistory', { id: item.id, name: item.item })} />
            <Ionicons
              name="add-circle"
              size={30}
              color="black"
              onPress={() => setCreateOperationalExpense(true)}
            />
          </View>

          {createOperationalExpense && (
            <View className="w-full px-4 mb-4">
              <CreateOperationalExpense
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

export default OperationalExpenseItem;
