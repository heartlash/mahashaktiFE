import { Text, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getOperationalExpenses, getOperationalExpenseItems } from '@/lib/operationalExpense';
import OperationalExpenseHistoryList from './OperationalExpenseHistoryList';
import MonthYearAndFilter from '../MonthYearAndFilter';
import { formatDateToDDMMYYYY } from '@/lib/util';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../CustomModal';
import { getDocument } from '@/lib/download';
import { monthNames } from '@/lib/util';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import { useLocalSearchParams } from 'expo-router';


const OperationalExpensesHistory = () => {

    const navigation = useNavigation();

    const { id, name } = useLocalSearchParams();

    const [operationalExpensesData, setOperationalExpensesData] = useState([]);
    const [operationalExpenseItems, setOperationalExpenseItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

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
        Promise.all([fetchOperationalExpensesDateRange(), fetchOperationalExpenseItems()])
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    }, []);

    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    }

    const handleDownload = async () => {
        var data = []
        let itemTotals = {};
        let grandTotal = 0;

        for (var operationalExpense of operationalExpensesData) {
            data.push([formatDateToDDMMYYYY(operationalExpense.expenseDate), operationalExpense.itemName,
                operationalExpense.amount, operationalExpense.remarks])

            if (!itemTotals[operationalExpense.itemName]) 
                itemTotals[operationalExpense.itemName] = 0;
            
            itemTotals[operationalExpense.itemName] += operationalExpense.amount;
            grandTotal += operationalExpense.amount;
        }

        let summaryData = [];

        for (let item in itemTotals) {
            const totalSpent = itemTotals[item];
            const percentageSpent = grandTotal > 0
                ? ((totalSpent / grandTotal) * 100).toFixed(2)
                : 0;

            summaryData.push([item, totalSpent, `${percentageSpent}%`]);
        }
        
        await getDocument((name ?? '') + " Operational Expense Report",
            monthNames[selectedMonth - 1] + " " + selectedYear,
            ["Date", "Item", "Amount", "Remarks"],
            data.reverse(),
            ["Item", "Amount Spent", "Precentage Spent"],
            summaryData);
    };

    const fetchOperationalExpensesDateRange = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getOperationalExpenses(id, startDate, endDate);
        if (result.errorMessage == null) {
            setOperationalExpensesData(result.data)
            setLoading(false);
        }

        if (result.data == null)
            setOperationalExpensesData([])
    }


    const fetchOperationalExpenseItems = async () => {
        const result = await getOperationalExpenseItems();
        if (result.errorMessage == null) {
            var expenseItems = []
            for (var data of result.data) {
                expenseItems.push({ label: data.item, value: data.id });
            }
            setOperationalExpenseItems(expenseItems)
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

        fetchOperationalExpensesDateRange();
        fetchOperationalExpenseItems();
    }, [])

    useEffect(() => {
        fetchOperationalExpensesDateRange();
        fetchOperationalExpenseItems();
    }, [selectedMonth, selectedYear, refresh])


    const reversedData = [...operationalExpensesData].reverse();

    if (loading) 
        return <AnimatedActivityIndicator/>
    
    return (
        <View>
            <View className="flex-row items-center mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                <View className="flex-1 items-center">
                    <Text className="text-lg font-bold mr-2">Ops Expense History</Text>
                </View>
            </View>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
            <OperationalExpenseHistoryList
                listHeaderComponent={
                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload}/>
                }
                operationalExpensesData={reversedData}
                operationalExpenseItems={operationalExpenseItems}
                onRefreshOnChange={onRefreshOnChange}
                refreshing={refreshing}
                onRefresh={onRefresh}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}

            />
        </View>
    );
};

export default OperationalExpensesHistory;

