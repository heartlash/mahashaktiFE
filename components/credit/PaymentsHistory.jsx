import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import PaymentsHistoryList from './PaymentsHistoryList';
import MonthYearAndFilter from '@/components/MonthYearAndFilter';
import { getMonthStartAndEndDate, formatDateToDDMMYYYY, monthNames } from '@/lib/util';
import { getDocument } from '@/lib/download';
import { getVendorsData } from '@/lib/vendor';
import { getPaymentsDateRange } from '@/lib/payments';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '@/components/CustomModal';
import { useLocalSearchParams } from 'expo-router';



const PaymentsHistory = () => {

    const navigation = useNavigation();

    const { id, name } = useLocalSearchParams();

    const [paymentsHistoryData, setPaymentsHistoryData] = useState([]);
    const [vendorData, setVendorData] = useState([]);

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
    const [loading, setLoading] = useState(true);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
   
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Promise.all([fetchPaymentsHistory(), fetchVendorData()])
          .then(() => setRefreshing(false))
          .catch(() => setRefreshing(false));
      }, []);


    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const handleDownload = async () => {
        var data = []
        for (var paymentHistory of paymentsHistoryData)
            data.push([formatDateToDDMMYYYY(paymentHistory.paymentDate), paymentHistory.vendorName,
                paymentHistory.amount, paymentHistory.remarks, paymentHistory.createdBy])

        await getDocument((name ?? '')  + " Payment History Report",
            monthNames[selectedMonth - 1] + " " + selectedYear,
            ["Payment Date", "Vendor", "Amount", "Remarks", "Created By"],
            data.reverse(),
            [],
            []);
    };

    const fetchPaymentsHistory = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getPaymentsDateRange(id, startDate, endDate);
        if (result.errorMessage == null) {
            setPaymentsHistoryData(result.data)
            setLoading(false);
        }
        if (result.data == null)
            setPaymentsHistoryData([])
    }

    const fetchVendorData = async () => {
        const result = await getVendorsData();
        var vendorList = []
        if (result.errorMessage == null) {
            for (var data of result.data) {
                vendorList.push({ label: data.name, value: data.id });
            }
            setVendorData(vendorList);
            setLoading(false)
        } else setLoading(true)
    }


    useEffect(() => {

        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
        setSelectedYear(new Date().getFullYear()); // Reset to the current year

        fetchPaymentsHistory();
        fetchVendorData;

    }, [])

    useEffect(() => {

        fetchPaymentsHistory();
        fetchVendorData;

    }, [selectedMonth, selectedYear, refresh])


    return (
        <View>
            <View className="flex-row items-center mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                <View className="flex-1 items-center">
                    <Text className="text-lg font-bold mr-2">Payment History</Text>
                </View>
            </View>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

            <PaymentsHistoryList
                listHeaderComponent={
                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload} />
                }
                vendorData={vendorData}
                paymentsHistoryData={paymentsHistoryData}
                onRefreshOnChange={onRefreshOnChange}
                refreshing={refreshing}
                onRefresh={onRefresh}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}
            />

        </View>

    )
};

export default PaymentsHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Your global background color
        paddingBottom: 30
    },
});
