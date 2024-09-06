import { View, SafeAreaView, StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import MaterialConsumptionHistoryList from '@/components/materialConsumptionHistory/MaterialConsumptionHistoryList';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getMaterialConsumptionHistory } from '@/lib/materialConsumption';
import MonthYearAndFilter from '@/components/MonthYearAndFilter';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '@/components/CustomModal';


const MaterialConsumptionHistory = () => {

    const navigation = useNavigation();


    const { id } = useLocalSearchParams();


    const [materialConsumptionHistoryData, setMaterialConsumptionHistoryData] = useState([]);

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    /// starts here

    // State to store selected month and year
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());


    const [refresh, setRefresh] = useState(false);
    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMaterialConsumptionHistory().then(() => setRefreshing(false));
    }, []);

    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
        // Now you can use filterData as needed, e.g., update state or display it
    };

    const fetchMaterialConsumptionHistory = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getMaterialConsumptionHistory(id, startDate, endDate);
        if (result.errorMessage == null) {
            setMaterialConsumptionHistoryData(result.data)
        }
        if (result.data == null)
            setMaterialConsumptionHistoryData([])
    }


    useEffect(() => {

        fetchMaterialConsumptionHistory();

    }, [selectedMonth, selectedYear, refresh])

    return (
        <SafeAreaView style={styles.container}>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
            <View>
                <View className="mx-2 my-1">
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                </View>
                <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} />
            </View>
            {materialConsumptionHistoryData.length > 0 ? (
                <MaterialConsumptionHistoryList
                    materialConsumptionHistoryData={materialConsumptionHistoryData.reverse()}
                    setMaterialConsumptionHistoryData={setMaterialConsumptionHistoryData}
                    onRefreshOnChange={onRefreshOnChange}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    setSuccessModalVisible={setSuccessModalVisible}
                    setFailureModalVisible={setFailureModalVisible}
                    setSubmitModalVisible={setSubmitModalVisible}
                />
            ) : (<></>)}



        </SafeAreaView>

    )
};

export default MaterialConsumptionHistory;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white', // Your global background color
      paddingBottom: 30
    },
  });