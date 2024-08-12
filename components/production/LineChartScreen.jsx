import { StyleSheet, Text, useWindowDimensions, View, FlatList, TouchableOpacity, Button, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SystemBars } from 'react-native-bars';
import LineChart from '@/components/production/LineChart';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import AnimatedText from '@/components/production/AnimatedText';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSharedValue } from 'react-native-reanimated';
import { useFont } from '@shopify/react-native-skia';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getProductionDataDateRange, updateProductionData, deleteProductionData, saveProductionData } from '@/lib/production';
import { getUserInfo } from '@/lib/auth';


const LineChartScreen = () => {
  const CHART_MARGIN = 5;
  const CHART_HEIGHT = 150;
  const { width: CHART_WIDTH } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedValue = useSharedValue(0);
  const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 88);

  const [productionData, setProductionData] = useState([]);

  /// starts here

  // State to store selected month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate month options (1-12)
  const monthOptions = [{ "label": "January", "value": 1 }, { "label": "February", "value": 2 }, { "label": "March", "value": 3 }, { "label": "April", "value": 4 }, { "label": "May", "value": 5 }, { "label": "June", "value": 6 }, { "label": "July", "value": 7 }, { "label": "August", "value": 8 }, { "label": "September", "value": 9 }, { "label": "October", "value": 10 }, { "label": "November", "value": 11 }, { "label": "December", "value": 12 }]
  const monthMaps = { "1": "January", "2": "February", "3": "March", "4": "April", "5": "May", "6": "June", "7": "July", "8": "August", "9": "September", "10": "October", "11": "November", "12": "December" }
  console.log("see here: ", monthMaps[selectedMonth])

  // Generate year options (e.g., from 1900 to 2100)
  const yearOptions = Array.from({ length: 201 }, (_, i) => ({
    label: `${1900 + i}`,
    value: 1900 + i,
  }));

  const [expandedItemId, setExpandedItemId] = useState(null);

  const [editItem, setEditItem] = useState(null);
  const [createProduction, setCreateProduction] = useState(false);



  const [edited, setEdited] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [productionDate, setProductionDate] = useState(new Date());
  const [producedCount, setProducedCount] = useState('');

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

  const [newItem, setNewItem] = useState(null);


  const handleNewChange = (field, value) => {
    console.log("comes here to handleEditChange: ", field, value)
    console.log("see setNewItem before", edited)
    setNewItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
    console.log("see setNewItem after", newItem)
  };

  const saveNewItem = async () => {
    setLoading(true)
    // Make API call to save changes
    const userInfo = await getUserInfo();
    var temp = newItem
    temp.createdBy = userInfo.name
    console.log("See time string:", productionDate.toISOString())
    temp.productionDate = productionDate.toISOString().toString().split('T')[0]
    console.log("see temp:", temp)
    const result = await saveProductionData(temp);
    console.log("see result: ", result)
    if (result.errorMessage == null) {
      setEditItem(null)
      Alert.alert(
        "Success",
        "Date saved",
        [{ text: "OK" }],
        { cancelable: false }
      );
      setCreateProduction(false)

    } else {
      Alert.alert(
        "Failure",
        result.errorMessage,
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    setLoading(false)



  }

  const handlePress = (itemId) => {

    console.log(" before called: ", expandedItemId)

    setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    console.log("called: ", itemId)
    console.log("after called: ", expandedItemId)

  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItemId === item.id;

    const handleEditChange = (field, value) => {
      console.log("comes here to handleEditChange: ", field, value)
      console.log("see edited before", edited)
      setEdited((prevItem) => ({
        ...prevItem,
        [field]: value,
      }));

      console.log("see edited after", edited)

    };

    const handleEditPress = (item) => {
      setEditItem(item);
      setEdited(item)
      console.log("see edit item: ", editItem)
    };

    const handleSavePress = async () => {

      setLoading(true)
      // Make API call to save changes
      const userInfo = await getUserInfo();
      var temp = edited
      temp.updatedBy = userInfo.name
      const result = await updateProductionData(temp);
      if (result != null) {
        setEditItem(null)
        Alert.alert(
          "Success",
          "Date updated",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Failure",
          "Data updation failed",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }

      setLoading(false)



    };

    const handleDeletePress = async () => {

      setLoading(true)
      // Prompt for confirmation
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // Call the async function here
                const result = await deleteProductionData(expandedItemId);
                // Optionally, you can show a success message or refresh data
                if (typeof result != undefined) {
                  console.log('Item deleted successfully');
                  Alert.alert(
                    "Success",
                    "Date deleted",
                    [{ text: "OK" }],
                    { cancelable: false })
                }
                else {
                  Alert.alert(
                    "Failure",
                    "Data deletion failed",
                    [{ text: "OK" }],
                    { cancelable: false }
                  );
                }
              } catch (error) {
                // Handle errors here
                Alert.alert(
                  "Failure",
                  "Data deletion failed",
                  [{ text: "OK" }],
                  { cancelable: false }
                );
                console.error('Error deleting item:', error);
              }

              setLoading(false)

            },
          },
        ]
      );
    };



    return (


      <TouchableOpacity
        className="bg-white p-4 rounded-lg shadow-md mb-4"
        onPress={() => handlePress(item.id)}
      >
        <Text className="text-lg font-bold mb-2">
          {new Date(item.productionDate).toDateString()}
        </Text>

        {/* First Row */}
        <View className="flex-row justify-between mb-2">
          <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
            <Text className="text-gray-600">Produced: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded text-gray-600"
                value={edited.producedCount.toString()}
                onChangeText={(text) => handleEditChange('producedCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-600">{item.producedCount}</Text>
            )}
          </View>
          <View className="flex-1 pl-2 flex-row">
            <Text className="text-gray-600">Percentage: </Text>
            <Text className="text-gray-600">{item.productionPercentage}%</Text>

          </View>
        </View>

        {/* Second Row */}
        <View className="flex-row justify-between mb-2">
          <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
            <Text className="text-gray-600">Broken:</Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded text-gray-600"
                value={edited.brokenCount.toString()}
                onChangeText={(text) => handleEditChange('brokenCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-600">{item.brokenCount}</Text>
            )}
          </View>
          <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
            <Text className="text-gray-600">Reason: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded text-gray-600"
                value={edited.brokenReason}
                onChangeText={(text) => handleEditChange('brokenReason', text)}
              />
            ) : (
              <Text className="text-gray-600">{item.brokenReason}</Text>
            )}
          </View>
        </View>

        {/* Third Row */}
        <View className="flex-row justify-between mb-2">
          <View className={`flex-1 pr-2 ${editItem === item ? '' : 'flex-row'}`}>
            <Text className="text-gray-600">Gift: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded text-gray-600"
                value={edited.giftCount.toString()}
                onChangeText={(text) => handleEditChange('giftCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-600">{item.giftCount}</Text>
            )}
          </View>
          <View className={`flex-1 pl-2 ${editItem === item ? '' : 'flex-row'}`}>
            <Text className="text-gray-600">Self Use: </Text>
            {editItem === item ? (
              <TextInput
                className="border border-gray-300 p-2 rounded text-gray-600"
                value={edited.selfUseCount.toString()}
                onChangeText={(text) => handleEditChange('selfUseCount', text)}
                keyboardType="numeric"
              />
            ) : (
              <Text className="text-gray-600">{item.selfUseCount}</Text>
            )}
          </View>
        </View>

        {/* Conditionally render additional content */}
        {isExpanded && (
          <View>
            {/* Fourth Row */}
            <View className="flex-row justify-between mb-2">
              <View className="flex-1 pr-2 flex-row">
                <Text className="text-gray-600">Saleable Eggs: </Text>
                <Text className="text-gray-600">{item.saleableCount}</Text>
              </View>
              <View className="flex-1 pl-2">
                <Text className="text-gray-600">Created By: </Text>
                <Text className="text-gray-600">{item.createdBy}</Text>
              </View>
            </View>

            <View className="flex-row mb-2">
              <Text className="text-gray-600">Updated By: </Text>
              <Text className="text-gray-600">{item.updatedBy}</Text>
            </View>

            {/* Edit and Delete Buttons */}
            <View className="flex-row justify-between mt-4">
              <Button title="Delete" color="red" onPress={handleDeletePress} />

              {editItem === item ? (
                <Button title="Save" onPress={handleSavePress} />
              ) : (
                <Button title="Edit" onPress={() => handleEditPress(item)} />
              )}

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
        )}
      </TouchableOpacity>


    )
  };

  useEffect(() => {
    const fetchProductionDataDateRange = async () => {
      console.log("see selectedMonth and year in the constructor: ", selectedMonth, selectedYear)
      const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
      console.log("see startDate and endDate: ", startDate, endDate)
      const result = await getProductionDataDateRange(startDate, endDate);
      console.log("see result from BE: ", result)

      setProductionData(result)
      console.log("see result from BE: ", productionData)
      var meow = []
      if (meow.length > 0) {
        console.log("see meow??")
      }
    }

    fetchProductionDataDateRange();
  }, [selectedMonth, selectedYear])

  if (!font) {
    return null;
  }
  const reversedData = [...productionData].reverse();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      {productionData.length > 0 ? (
        <View>
          <View style={styles.container}>
            <SystemBars animated={true} barStyle={'light-content'} />
            {selectedDate ? (<Text style={styles.text}>{selectedDate}</Text>) : <Text style={styles.text}>{selectedDate} Production</Text>}

            <AnimatedText selectedValue={selectedValue} font={font} />
            <LineChart
              data={productionData}
              chartHeight={CHART_HEIGHT}
              chartWidth={CHART_WIDTH}
              chartMargin={CHART_MARGIN}
              setSelectedDate={setSelectedDate}
              selectedValue={selectedValue}
            />
          </View>
          <View className="flex-row space-x-4 p-4">
            <View className="flex-1">
              <RNPickerSelect
                onValueChange={(value) => setSelectedMonth(value)}
                items={monthOptions}
                value={selectedMonth}
                style={pickerSelectStyles}
                placeholder={{ label: "Select month...", value: null }}
              />
            </View>
            <View className="flex-1">
              <RNPickerSelect
                onValueChange={(value) => setSelectedYear(value)}
                items={yearOptions}
                value={selectedYear}
                style={pickerSelectStyles}
                placeholder={{ label: "Select year...", value: null }}
              />
            </View>
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => setCreateProduction(true)}
                className="bg-green-500 p-4 rounded-lg"
              >
                <Text className="text-white font-semibold">Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>

          {createProduction ?
            (<View className="bg-white p-4 rounded-lg shadow-md mb-4">
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
                      {productionDate.toDateString()}
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

                <Button title="Cancel" color="red" onPress={() => setCreateProduction(false)} />
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
            </View>) : (<View className="flex-1 justify-center items-center">
              <TouchableOpacity
                onPress={() => setCreateProduction(true)}
                className="bg-blue-500 p-4 rounded-lg mb-2"
              >
                <Text className="text-white font-bold">Create</Text>
              </TouchableOpacity>
            </View>)}



          <View className="flex-1 p-4 bg-gray-100">
            <FlatList
              data={reversedData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      ) : (<View><Text>HEHE</Text></View>)}
    </GestureHandlerRootView>
  );
};

export default LineChartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
});


const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

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

