import { StyleSheet, Text, View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getOperationalExpenses, getOperationalExpenseItems } from '@/lib/operationalExpense';
import OperationalExpenseList from './OperationalExpenseList';
import CreateOperationalExpenseItem from './CreateOperationalExpense';
import MonthYearAndFilter from '../MonthYearAndFilter';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


const OperationalExpensesScreen = () => {

    const navigation = useNavigation();

    const [selectedDate, setSelectedDate] = useState(null);

    const [operationalExpensesData, setOperationalExpensesData] = useState([]);
    const [operationalExpenseItems, setOperationalExpenseItems] = useState([]);

    const [createOperationalExpense, setCreateOperationalExpense] = useState(false)

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
        Promise.all([fetchOperationalExpensesDateRange(), fetchOperationalExpenseItems()])
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    }, []);

    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    }


    const fetchOperationalExpensesDateRange = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getOperationalExpenses(startDate, endDate);
        if (result.data != null) {
            setOperationalExpensesData(result.data)
            setLoading(false);
        }
        else {
            setLoading(true);
        }
    }


    const fetchOperationalExpenseItems = async () => {
        const result = await getOperationalExpenseItems();
        if (result.data != null) {
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

    if (loading) {
        return <Modal transparent={true}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        </Modal>
    }

    return (
        <View>
            <View className="mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>
            <OperationalExpenseList
                listHeaderComponent={<View>


                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} />

                    {createOperationalExpense ? (
                        <CreateOperationalExpenseItem
                            onClose={() => setCreateOperationalExpense(false)}
                            onRefreshOnChange={onRefreshOnChange}
                            operationalExpenseItems={operationalExpenseItems}
                        />
                    ) : (<View className="mb-3">
                        <Ionicons name="add-circle" className="mb-3" size={45} style={{ alignSelf: 'center' }} color="black" onPress={() => setCreateOperationalExpense(true)} />
                    </View>
                    )}
                </View>}
                operationalExpensesData={reversedData}
                operationalExpenseItems={operationalExpenseItems}
                onRefreshOnChange={onRefreshOnChange}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
};

export default OperationalExpensesScreen;

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


