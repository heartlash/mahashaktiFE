import {StyleSheet, Text, useWindowDimensions, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SystemBars} from 'react-native-bars';
import LineChart from '@/components/production/LineChart';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import AnimatedText from '@/components/production/AnimatedText';
import RNPickerSelect from 'react-native-picker-select';
import {useSharedValue} from 'react-native-reanimated';
import {useFont} from '@shopify/react-native-skia';
import { getCurrentMonthInfo } from '@/lib/util';
import { getProductionDataDateRange } from '@/lib/production';

const LineChartScreen = () => {
  const CHART_MARGIN = 5;
  const CHART_HEIGHT = 150;
  const {width: CHART_WIDTH} = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(null);

  const [productionData, setProductionData] = useState(null);
 
  const selectedValue = useSharedValue(0);
  const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 88);

  var {currentMonth, startDate, endDate} = getCurrentMonthInfo();

  console.log("see current month start date and end date: ", currentMonth, startDate, endDate);

  /// starts here

  const today = new Date();
  console.log("see today: ", today, "currentMonth: ", currentMonth)
  const currentYear = today.getFullYear();

  // State to store selected month and year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate month options (1-12)
  const monthOptions = [{"label": "January", "value": 1}, {"label": "February", "value": 2}, {"label": "March", "value": 3}, {"label": "April", "value": 4}, {"label": "May", "value": 5}, {"label": "June", "value": 6}, {"label": "July", "value": 7}, {"label": "August", "value": 8}, {"label": "September", "value": 9}, {"label": "October", "value": 10}, {"label": "November", "value": 11}, {"label": "December", "value": 12}]
  const monthMaps = {"1": "January", "2": "February", "3": "March", "4": "April", "5": "May","6": "June", "7": "July", "8": "August", "9": "September","10": "October", "11": "November", "12": "December"}
  console.log("see here: ", monthMaps[selectedMonth])

  // Generate year options (e.g., from 1900 to 2100)
  const yearOptions = Array.from({ length: 201 }, (_, i) => ({
    label: `${1900 + i}`,
    value: 1900 + i,
  }));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg shadow-md mb-4"
      onPress={() => console.log('Item pressed:', item)}
    >
      <Text className="text-lg font-bold mb-2">{item.producedCount}</Text>
      <Text className="text-gray-600">{item.productionPercentage}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchProductionDataDateRange = async(startDate, endDate) => {
      const result = await getProductionDataDateRange(startDate, endDate);
      setProductionData(result)
    }

    fetchProductionDataDateRange(startDate, endDate);
  }, [])

  if (!font) {
    return null;
  }

  const data = [
    {label: '1', date: '1', value: 80, producedCount: 22000},
    {label: '2', date: '2', value: 80, producedCount: 22000},
    {label: '3', date: '3', value: 81, producedCount: 22000},
    {label: '4', date: '4', value: 84, producedCount: 22000},
    {label: '5', date: '5', value: 84, producedCount: 22000},
    {label: '6', date: '6', value: 90, producedCount: 22000},
    {label: '7', date: '7', value: 82, producedCount: 22000},
    {label: '8', date: '8', value: 78, producedCount: 22000},
    {label: '9', date: '9', value: 56, producedCount: 22000},
    {label: '10', date: '10', value: 63, producedCount: 22000},
    {label: '11', date: '11', value: 89, producedCount: 22000},
    {label: '12', date: '12', value: 89, producedCount: 22000},
    {label: '13', date: '13', value: 86, producedCount: 22000},
    {label: '14', date: '14', value: 82, producedCount: 22000},
    {label: '15', date: '15', value: 82, producedCount: 22000},
    {label: '16', date: '16', value: 81, producedCount: 22000},
    {label: '17', date: '17', value: 89, producedCount: 22000},
    {label: '18', date: '18', value: 80, producedCount: 22000},
    {label: '19', date: '19', value: 83, producedCount: 22000},
    {label: '20', date: '20', value: 67, producedCount: 22000},
    {label: '21', date: '21', value: 78, producedCount: 22000},
    {label: '22', date: '22', value: 67, producedCount: 22000},
    {label: '23', date: '23', value: 89, producedCount: 22000},
    {label: '24', date: '24', value: 90, producedCount: 22000},
    {label: '25', date: '25', value: 67, producedCount: 22000},
    {label: '26', date: '26', value: 45, producedCount: 22000},
    {label: '27', date: '27', value: 34, producedCount: 22000},
    {label: '28', date: '28', value: 89, producedCount: 22000},
    {label: '29', date: '29', value: 90, producedCount: 22000},
    {label: '30', date: '30', value: 95, producedCount: 22000},
    {label: '31', date: '31', value: 99, producedCount: 22000},


  ];


  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <SystemBars animated={true} barStyle={'light-content'} />
        {selectedDate ? (<Text style={styles.text}>{selectedDate} {monthMaps[selectedMonth]}</Text>) : <Text style={styles.text}>{selectedDate} Production</Text>}
        
        <AnimatedText selectedValue={selectedValue} font={font} />
        <LineChart
          data={data}
          chartHeight={CHART_HEIGHT}
          chartWidth={CHART_WIDTH}
          chartMargin={CHART_MARGIN}
          setSelectedDate={setSelectedDate}
          selectedValue={selectedValue}
        />
      </View>
      <View class = "flex flex-row">
        <View  className="basis-1/2">
          <RNPickerSelect
            onValueChange={(value) => setSelectedMonth(value)}
            items={monthOptions}
            value={selectedMonth}
            style={pickerSelectStyles}
            
          />
        </View>
        <View className="basis-1/2">
          <RNPickerSelect
            onValueChange={(value) => setSelectedYear(value)}
            items={yearOptions}
            value={selectedYear}
            style={pickerSelectStyles}
           
          />
        </View>
      </View>

     
    <View className="flex-1 p-4 bg-gray-100">
      <FlatList
        data={productionData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
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

