import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { saveProductionData } from '@/lib/production';
import moment from 'moment-timezone';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CreateProduction = ({ onClose, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [productionDate, setProductionDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
  const [newProduction, setNewProduction] = useState(null);


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
      setProductionDate(moment(date).tz(moment.tz.guess()).format('YYYY-MM-DD'));
    }
    hideDatePicker();
  };



  const handleNewProduction = (field, value) => {
    setNewProduction((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const saveNewProduction = async () => {
    setSubmitModalVisible(true)
    // Make API call to save changes
    const userInfo = await getUserInfo();
    var temp = newProduction
    temp.createdBy = userInfo.name
    temp.productionDate = productionDate
    const result = await saveProductionData(temp);
    setSubmitModalVisible(false)
    if (result.errorMessage == null) {
      setNewProduction(null)
      setSuccessModalVisible(true)
      setTimeout(() => {
        onRefreshOnChange()
        setSuccessModalVisible(false);
      }, 2000);

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
          <Text className="text-gray-700 font-semibold">Produced:</Text>

          <TextInput
            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
            onChangeText={(text) => handleNewProduction('producedCount', text)}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1 pl-2">
          <Text className="text-gray-700 font-semibold">Production Date:</Text>
          <TouchableOpacity
            onPress={showDatePicker}
            className="border border-gray-300 p-2 rounded bg-white"
          >
            <Text className="text-gray-600">
              {productionDate}
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
          <Text className="text-gray-700 font-semibold">Broken:</Text>

          <TextInput
            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
            onChangeText={(text) => handleNewProduction('brokenCount', text)}
            keyboardType="numeric"
          />

        </View>
        <View className="flex-1 pl-2">
          <Text className="text-gray-700 font-semibold">Reason:</Text>

          <TextInput
            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
            onChangeText={(text) => handleNewProduction('brokenReason', text)}
          />

        </View>
      </View>

      <View className="flex-row justify-between mb-2">
        <View className="flex-1 pr-2">
          <Text className="text-gray-700 font-semibold">Gift:</Text>
          <TextInput
            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
            onChangeText={(text) => handleNewProduction('giftCount', text)}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1 pl-2">
          <Text className="text-gray-700 font-semibold">Self Use:</Text>

          <TextInput
            className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
            onChangeText={(text) => handleNewProduction('selfUseCount', text)}
            keyboardType="numeric"
          />

        </View>
      </View>
      <View className="flex-row justify-between mt-4">
        <MaterialIcons name="cancel" size={30} color="black" onPress={onClose} />
        <Entypo name="save" size={30} color="black" onPress={saveNewProduction} />

      </View>
    </View>
  )
}

export default CreateProduction