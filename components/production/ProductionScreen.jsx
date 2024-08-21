import { StyleSheet, Text, useWindowDimensions, View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SystemBars } from 'react-native-bars';
import LineChart from '@/components/production/LineChart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedText from '@/components/production/AnimatedText';
import { useSharedValue } from 'react-native-reanimated';
import { useFont } from '@shopify/react-native-skia';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getProductionDataDateRange } from '@/lib/production';
import ProductionList from './ProductionList';
import CreateProduction from './CreateProduction';
import MonthYearAndFilter from '../MonthYearAndFilter';


const ProductionScreen = () => {
  const CHART_MARGIN = 5;
  const CHART_HEIGHT = 150;
  const { width: CHART_WIDTH } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedValue = useSharedValue(0);
  const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 60);

  const [productionData, setProductionData] = useState([]);
  const [createProduction, setCreateProduction] = useState(false)

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

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


  const monthMaps = { "1": "January", "2": "February", "3": "March", "4": "April", "5": "May", "6": "June", "7": "July", "8": "August", "9": "September", "10": "October", "11": "November", "12": "December" }
  console.log("see here: ", monthMaps[selectedMonth])

  const handleShowPress = () => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }


  const fetchProductionDataDateRange = async () => {
    const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
    const result = await getProductionDataDateRange(startDate, endDate);
    if(result.data != null) {
      setProductionData(result.data)
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
  }, [])

  useEffect(() => {
    fetchProductionDataDateRange();
  }, [selectedMonth, selectedYear, refresh])



  if (!font) {
    return null;
  }
  const reversedData = [...productionData].reverse();

  if (loading) {
    return <Modal transparent={true}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    </Modal>
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
                chartHeight={CHART_HEIGHT}
                chartWidth={CHART_WIDTH}
                chartMargin={CHART_MARGIN}
                setSelectedDate={setSelectedDate}
                selectedValue={selectedValue}
              />
            </View>) : (<></>)}

          <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} />

          {createProduction ? (
            <CreateProduction
              onClose={() => setCreateProduction(false)}
              onRefresh={onRefresh}
            />
          ) : (<View className="flex-1 items-center">
            <TouchableOpacity
              onPress={() => setCreateProduction(true)}
              className="bg-blue-500 p-4 rounded-lg mb-3"
              style={{ alignSelf: 'center' }}
            >
              <Text className="text-white font-bold">Create</Text>
            </TouchableOpacity>
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
    backgroundColor: '#0d0d0d',
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
});


