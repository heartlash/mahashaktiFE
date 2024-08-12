import { View, Text, TextInput, Alert, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, {useState} from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getUserInfo } from '@/lib/auth';
import { saveProductionData } from '@/lib/production';
import moment from 'moment-timezone';



const CreateProduction = ({ onClose }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [productionDate, setProductionDate] = useState(moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'));
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
            setProductionDate(date);
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
        console.log("see on save: ",  moment(new Date()).tz(moment.tz.guess()).format('YYYY-MM-DD'))
        // Make API call to save changes
        const userInfo = await getUserInfo();
        var temp = newItem
        temp.createdBy = userInfo.name
        console.log("See time string:", productionDate)
        temp.productionDate = productionDate
        console.log("see temp:", temp)
        const result = await saveProductionData(temp);
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
        <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <View className="flex-row justify-between mb-2 ">
          <View className="flex-1 pr-2">
            <Text className="text-gray-600">Produced:</Text>

            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              onChangeText={(text) => handleNewChange('producedCount', text)}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 pl-2">
            <Text className="text-gray-600">Production Date:</Text>
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
            <Text className="text-gray-600">Broken:</Text>

            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              onChangeText={(text) => handleNewChange('brokenCount', text)}
              keyboardType="numeric"
            />

          </View>
          <View className="flex-1 pl-2">
            <Text className="text-gray-600">Reason:</Text>

            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              onChangeText={(text) => handleNewChange('brokenReason', text)}
            />

          </View>
        </View>

        <View className="flex-row justify-between mb-2">
          <View className="flex-1 pr-2">
            <Text className="text-gray-600">Gift:</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              onChangeText={(text) => handleNewChange('giftCount', text)}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 pl-2">
            <Text className="text-gray-600">Self Use:</Text>

            <TextInput
              className="border border-gray-300 p-2 rounded text-gray-600"
              onChangeText={(text) => handleNewChange('selfUseCount', text)}
              keyboardType="numeric"
            />

          </View>
        </View>
        <View className="flex-row justify-between mt-4">

          <Button title="Cancel" color="red" onPress={onClose}/>
          <Button title="Save" onPress={saveNewItem} />

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

export default CreateProduction