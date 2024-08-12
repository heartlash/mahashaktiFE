import { StyleSheet, Text, useWindowDimensions, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SystemBars } from 'react-native-bars';
import LineChart from '@/components/production/LineChart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedText from '@/components/production/AnimatedText';
import RNPickerSelect from 'react-native-picker-select';
import { useSharedValue } from 'react-native-reanimated';
import { useFont } from '@shopify/react-native-skia';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getProductionDataDateRange } from '@/lib/production';
import ProductionList from './ProductionList';
import CreateProduction from './CreateProduction';


const LineChartScreen = () => {
  const CHART_MARGIN = 5;
  const CHART_HEIGHT = 150;
  const { width: CHART_WIDTH } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedValue = useSharedValue(0);
  const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 88);

  const [productionData, setProductionData] = useState([]);
  const [createProduction, setCreateProduction] = useState(false)

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


  useEffect(() => {
    const fetchProductionDataDateRange = async () => {
      console.log("see selectedMonth and year in the constructor: ", selectedMonth, selectedYear)
      const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
      console.log("see startDate and endDate: ", startDate, endDate)
      const result = await getProductionDataDateRange(startDate, endDate);
      console.log("see result from BE: ", result)

      setProductionData(result)
      console.log("see result from BE: ", productionData)
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
          <View className="flex-1">
          <TouchableOpacity
                onPress={() => setCreateProduction(true)}
                className="bg-blue-500 p-4 rounded-lg mb-2"
              >
                <Text className="text-white font-bold">Create</Text>
              </TouchableOpacity>
            </View>
          {createProduction && (
                    <CreateProduction
                        onClose={() => setCreateProduction(false)}
                    />
                )}
          <ProductionList
            productionData={reversedData}
            setProductionData={setProductionData}
          />
        </View>

      ) : (<Text>HEHE</Text>)}
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

