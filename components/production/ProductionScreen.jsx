import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { getSheds } from '@/lib/shed';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getProductionDataDateRange } from '@/lib/production';
import MonthYearAndFilter from '../MonthYearAndFilter';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import CustomModal from '../CustomModal';
import ShedList from '../shed/ShedList';
import { formatMoneyOrNumber } from '@/lib/util';


const ProductionScreen = () => {

  const [shedData, setShedData] = useState([])

  const [totalProduction, setTotalProduction] = useState(0);
  const [averageDailyProduction, setAverageDailyProduction] = useState(0);
  const [averageProductionPercentage, setAverageProductionPercentage] = useState(0);
  const [averageBrokenCount, setAverageBrokenCount] = useState(0);

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
    Promise.all([fetchProductionDataDateRange(), fetchSheds()])
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, []);
  const handleShowPress = () => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }

  const handleDownload = async () => {
  };

  const fetchProductionDataDateRange = async () => {
    const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
    const result = await getProductionDataDateRange(startDate, endDate);
    if (result.errorMessage == null) {
      var count = 0
      var sumOfPercentages = 0
      var sumOfProduction = 0
      var sumOfBrokenCount = 0

      for (var data of result.data) {
        count++
        sumOfPercentages += parseFloat(data.productionPercentage)
        sumOfProduction += data.producedCount
        sumOfBrokenCount += data.brokenCount
      }
      setTotalProduction(sumOfProduction)
      setAverageProductionPercentage(parseFloat(sumOfPercentages / count).toFixed(2))
      setAverageDailyProduction(parseFloat(sumOfProduction / count).toFixed(2))
      setAverageBrokenCount(parseFloat(sumOfBrokenCount / count).toFixed(2))

      setLoading(false);
    }
    else {
      setLoading(true);
    }
  }
  const fetchSheds = async () => {

    const shedResult = await getSheds();

    if (shedResult.errorMessage == null) {
      var shedList = []
      for (var shed of shedResult.data) {
        if (shed.active == true && shed.baby == false)
          shedList.push(shed)
      }
      setShedData(shedList)
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  useEffect(() => {

    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
    setSelectedYear(new Date().getFullYear()); // Reset to the current year

    fetchProductionDataDateRange();
    fetchSheds();

  }, [])

  useEffect(() => {
    fetchProductionDataDateRange();
    fetchSheds();
    setChartRefresh(!chartRefresh);
  }, [selectedMonth, selectedYear, refresh])


  if (loading) {
    return <AnimatedActivityIndicator />
  }

  return (
    <>
      <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
      <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
      <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

      <ShedList
        listHeaderComponent={<>
          <View style={styles.container}>
            <View className="p-7 justify-center items-center">
              <Text className="text-xl font-bold text-black">Total Production: {formatMoneyOrNumber(totalProduction)} </Text>
            </View>
            <View className="flex flex-row">
              <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Average Production</Text>
              <Text className="text-right text-gray-700 font-semibold  mb-2">{averageDailyProduction}</Text>
            </View>
            <View className="flex flex-row">
              <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Average Production Percentage</Text>
              <Text className="text-right text-gray-700 font-semibold  mb-2">{averageProductionPercentage}</Text>
            </View>
            <View className="flex flex-row">
              <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Average Broken</Text>
              <Text className="text-right text-gray-700 font-semibold  mb-2">{averageBrokenCount}</Text>
            </View>
          </View>
          <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload} download={false} />
        </>
        }
        isProduction={true}
        data={shedData}
        onRefreshOnChange={onRefreshOnChange}
        refreshing={refreshing}
        onRefresh={onRefresh}
        setSuccessModalVisible={setSuccessModalVisible}
        setFailureModalVisible={setFailureModalVisible}
        setSubmitModalVisible={setSubmitModalVisible}
      />
    </>
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


