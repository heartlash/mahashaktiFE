import { StyleSheet, Text, View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SystemBars } from 'react-native-bars';
import LineChart from '../chart/LineChart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedText from '../chart/AnimatedText';
import { useSharedValue } from 'react-native-reanimated';
import { useFont } from '@shopify/react-native-skia';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getProductionDataDateRange } from '@/lib/production';
import ProductionList from './ProductionList';
import CreateProduction from './CreateProduction';
import MonthYearAndFilter from '../MonthYearAndFilter';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';


const ProductionScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedValue = useSharedValue(0);
  const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 50);

  const [productionData, setProductionData] = useState([]);
  const [averageDailyProduction, setAverageDailyProduction] = useState(0);

  const [averageProductionPercentage, setAverageProductionPercentage] = useState(0);

  const [createProduction, setCreateProduction] = useState(false)

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [chartRefresh, setChartRefresh] = useState(false);

  const onRefreshOnChange = () => {
    setRefresh(prev => !prev);
  }

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProductionDataDateRange().then(() => setRefreshing(false));
  }, []);

  const handleShowPress = () => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }


  const fetchProductionDataDateRange = async () => {
    const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
    const result = await getProductionDataDateRange(startDate, endDate);
    if (result.data != null) {
      var count = 0
      var sumOfPercentages = 0
      var sumOfProduction = 0

      setProductionData(result.data)
      for (var data of result.data) {
        count++
        sumOfPercentages += parseFloat(data.productionPercentage)
        sumOfProduction += data.producedCount
      }
      setAverageProductionPercentage(parseFloat(sumOfPercentages / count).toFixed(2))
      setAverageDailyProduction(parseFloat(sumOfProduction / count).toFixed(2))
      setLoading(false);
    }
    else {
      setLoading(true);
    }
  }


  useEffect(() => {

    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
    setSelectedYear(new Date().getFullYear()); // Reset to the current year

    fetchProductionDataDateRange();
    setChartRefresh(!chartRefresh);

  }, [])

  useEffect(() => {
    fetchProductionDataDateRange();
    setChartRefresh(!chartRefresh);
  }, [selectedMonth, selectedYear, refresh])


  const reversedData = [...productionData].reverse();

  if (loading) {
    return <AnimatedActivityIndicator />
  }

  return (
    <GestureHandlerRootView>
      <ProductionList
        listHeaderComponent={<View>
          {productionData.length > 0 ? (
            <View style={styles.container}>
              <SystemBars animated={true} barStyle={'light-content'} />
              {selectedDate ? (<Text style={styles.text}>{selectedDate}</Text>) : <Text style={styles.text}>{selectedDate} Production</Text>}

              <AnimatedText selectedValue={selectedValue} font={font} />
              <LineChart
                data={productionData}
                setSelectedDate={setSelectedDate}
                selectedValue={selectedValue}
                type="Production"
                chartRefresh={chartRefresh}
              />
              <View className="flex flex-row">
                <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Average Percentage</Text>
                <Text className="text-right text-gray-700 font-semibold  mb-2">{averageProductionPercentage}</Text>

              </View>
              <View className="flex flex-row">
                <Text className="text-gray-700 font-semibold mx-5 mb-2">Average Production </Text>
                <Text className="text-right text-gray-700 font-semibold  mb-2">{ averageDailyProduction }</Text>

              </View>

            </View>) : (<></>)}

          <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} />

          {createProduction ? (
            <CreateProduction
              onClose={() => setCreateProduction(false)}
              onRefreshOnChange={onRefreshOnChange}
            />
          ) : (<View className="mb-3">
            <Ionicons name="add-circle" className="mb-3" size={45} style={{ alignSelf: 'center' }} color="black" onPress={() => setCreateProduction(true)} />
          </View>
          )}
        </View>}
        productionData={reversedData}
        onRefreshOnChange={onRefreshOnChange}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </GestureHandlerRootView>
  );
};

export default ProductionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDD0',
  },
  text: {
    color: 'black',
    fontSize: 24,
    paddingTop: 10,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
});


