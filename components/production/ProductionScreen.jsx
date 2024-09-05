import { StyleSheet, Text, View } from 'react-native';
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
import CustomModal from '../CustomModal';


const ProductionScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedValue = useSharedValue(0);
  const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 50);

  const [productionData, setProductionData] = useState([]);
  const [averageDailyProduction, setAverageDailyProduction] = useState(0);

  const [averageProductionPercentage, setAverageProductionPercentage] = useState(0);
  const [averageBrokenCount, setAverageBrokenCount] = useState(0);

  const [createProduction, setCreateProduction] = useState(false)

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [failureModalVisible, setFailureModalVisible] = useState(false)
  const [submitModalVisible, setSubmitModalVisible] = useState(false)
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
    if (result.errorMessage == null) {
      var count = 0
      var sumOfPercentages = 0
      var sumOfProduction = 0
      var sumOfBrokenCount = 0


      setProductionData(result.data)
      for (var data of result.data) {
        count++
        sumOfPercentages += parseFloat(data.productionPercentage)
        sumOfProduction += data.producedCount
        sumOfBrokenCount += data.brokenCount
      }
      setAverageProductionPercentage(parseFloat(sumOfPercentages / count).toFixed(2))
      setAverageDailyProduction(parseFloat(sumOfProduction / count).toFixed(2))
      setAverageBrokenCount(parseFloat(sumOfBrokenCount / count).toFixed(2))

      setLoading(false);
    }
    else {
      setLoading(true);
    }
  }

  const [currentView, setCurrentView] = useState(0);

  const views = [
    {
      title: 'Average Percentage',
      value: averageProductionPercentage,
    },
    {
      title: 'Average Production',
      value: averageDailyProduction,
    },
    {
      title: 'Average Broken Count',
      value: averageBrokenCount,
    },
  ];

  useEffect(() => {

    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
    setSelectedYear(new Date().getFullYear()); // Reset to the current year

    fetchProductionDataDateRange();
    setChartRefresh(!chartRefresh);

    const interval = setInterval(() => {
      setCurrentView((prevView) => (prevView + 1) % views.length);
    }, 2000);

    return () => clearInterval(interval);

  }, [])

  useEffect(() => {
    fetchProductionDataDateRange();
    setChartRefresh(!chartRefresh);

    const interval = setInterval(() => {
      setCurrentView((prevView) => (prevView + 1) % views.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedMonth, selectedYear, refresh])


  const reversedData = [...productionData].reverse();

  if (loading) {
    return <AnimatedActivityIndicator />
  }

  return (
    <GestureHandlerRootView>
      <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
      <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
      <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

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

              {views.map((view, index) => (
                <View
                  className="flex flex-row"
                  key={index}
                  style={[
                    styles.view,
                    { opacity: currentView === index ? 1 : 0 },
                  ]}
                >
                  <Text className="text-left text-gray-700 font-semibold mx-5 mb-3">{view.title}</Text>
                  <Text className="text-right text-gray-700 font-semibold mb-3">{view.value}</Text>
                </View>
              ))}

            </View>) : (<></>)}

          <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} />

          {createProduction ? (
            <CreateProduction
              onClose={() => setCreateProduction(false)}
              onRefreshOnChange={onRefreshOnChange}
              setSuccessModalVisible={setSuccessModalVisible}
              setFailureModalVisible={setFailureModalVisible}
              setSubmitModalVisible={setSubmitModalVisible} />
          ) : (<View className="mb-3">
            <Ionicons name="add-circle" className="mb-3" size={45} style={{ alignSelf: 'center' }} color="black" onPress={() => setCreateProduction(true)} />
          </View>
          )}
        </View>}
        productionData={reversedData}
        onRefreshOnChange={onRefreshOnChange}
        refreshing={refreshing}
        onRefresh={onRefresh}
        setSuccessModalVisible={setSuccessModalVisible}
        setFailureModalVisible={setFailureModalVisible}
        setSubmitModalVisible={setSubmitModalVisible}
      />
    </GestureHandlerRootView>
  );
};

export default ProductionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDD0',
    justifyContent: 'flex-end',
  },
  text: {
    color: 'black',
    fontSize: 24,
    paddingTop: 10,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  view: {
    position: 'absolute',
  }
});


