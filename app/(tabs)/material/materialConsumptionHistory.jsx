import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import MaterialConsumptionHistoryList from '@/components/materialConsumptionHistory/MaterialConsumptionHistoryList';
import { getMonthStartAndEndDate, formatDateToDDMMYYYY, monthNames } from '@/lib/util';
import { getDocument } from '@/lib/download';
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

    const handleDownload = async () => {
        var data = []
        for (var consumptionData of materialConsumptionHistoryData)
            data.push([formatDateToDDMMYYYY(consumptionData.consumptionDate), consumptionData.materialName,
            consumptionData.quantity + ' ' + consumptionData.unitSymbol])

        await getDocument(consumptionData.materialName + " Consumption Report",
            monthNames[selectedMonth - 1] + " " + selectedYear,
            ["Date", "Material", "Quantity"],
            data);
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
                <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
                <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
                <View>
                    <View className="flex-row items-center mx-2 my-1">
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                        <View className="flex-1 items-center">
                            <Text className="text-lg font-bold mr-2">Consumption History</Text>
                        </View>
                    </View>
                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload} />
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


            </KeyboardAvoidingView>
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
