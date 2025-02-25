import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DonutChart from '../donut/DonutChart';
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getOperationalExpenses, getOperationalExpenseItems, getOperationalExpensesLatest } from '@/lib/operationalExpense';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomModal from '../CustomModal';
import OperationalExpenseList from '../operationalExpenses/OperationalExpenseList';
import MonthYearAndFilter from '../MonthYearAndFilter';
import { getFormattedDate } from '@/lib/util';

const RADIUS = 120;


export const OperationalExpensesScreen = () => {

    const navigation = useNavigation();
    const router = useRouter();

    const [operationalExpenses, setOperationalExpenses] = useState([]);
    const totalValue = useSharedValue(0);
    const decimals = useSharedValue([]);

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOperationalExpenses().then(() => setRefreshing(false));
    }, []);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }


    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());


    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    }


    const fetchOperationalExpenses = async () => {
        setLoading(true)

        var operationalExpensess = []
        const operationExpenseItemResult = await getOperationalExpenseItems();
        if (operationExpenseItemResult.errorMessage == null) {
            operationalExpensess = operationExpenseItemResult.data
        }

        const operationExpenseLatestResult = await getOperationalExpensesLatest();
        if (operationExpenseLatestResult.errorMessage == null) {

            setLoading(false);
        }
        else {
            setLoading(true);
        }

        const { startDate, endDate } = getMonthStartAndEndDate(month, year)
        const result = await getOperationalExpenses(null, startDate, endDate);
        if (result.errorMessage == null) {
            const operationalExpenseItemToAmountMapped = result.data.reduce((acc, item) => {
                if (acc[item.itemId]) {
                    acc[item.itemId] += item.amount;
                } else {
                    acc[item.itemId] = item.amount;
                }
                return acc;
            }, {});


            var total = Object.values(operationalExpenseItemToAmountMapped).reduce(
                (acc, currentValue) => acc + currentValue,
                0,
            );

            for (var operationalExpense of operationalExpensess) {
                if (operationalExpense.id in operationalExpenseItemToAmountMapped) {
                    operationalExpense.amountSpent = operationalExpenseItemToAmountMapped[operationalExpense.id]
                }
                else operationalExpense.amountSpent = 0

                if (operationalExpense.id in operationExpenseLatestResult.data) {
                    operationalExpense.lastAmountSpent = operationExpenseLatestResult.data[operationalExpense.id].amount
                    operationalExpense.lastExpenseDate = getFormattedDate(operationExpenseLatestResult.data[operationalExpense.id].expenseDate)
                    operationalExpense.lastRemark = operationExpenseLatestResult.data[operationalExpense.id].remarks
                }
                else {
                    operationalExpense.lastAmount = "NA"
                    operationalExpense.lastExpenseDate = "NA"
                    operationalExpense.lastRemark = "NA"
                }

            }
            setOperationalExpenses(operationalExpensess)
            totalValue.value = withTiming(total, { duration: 1000 });
            decimals.value = [...['0.1']];
            setLoading(false)

        }

    }


    useEffect(() => {

        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
        setSelectedYear(new Date().getFullYear()); // Reset to the current year

        fetchOperationalExpenses();

    }, [])

    useEffect(() => {
        fetchOperationalExpenses();
    }, [selectedMonth, selectedYear, refresh])


    const font = useFont(require('../../assets/fonts/Roboto-Bold.ttf'), 40);
    const smallFont = useFont(require('../../assets/fonts/Roboto-Light.ttf'), 20);

    if (!font || !smallFont || loading) {
        return <AnimatedActivityIndicator />
    }

    return (
        <View>
            <View className="flex-row items-center mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                <View className="flex-1 items-center">
                    <Text className="text-lg font-bold mr-2">Operational Expenses</Text>
                </View>
            </View>

            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />


            <OperationalExpenseList
                listHeaderComponent={
                    <>
                        <View style={{ backgroundColor: '#FFFDD0' }}>
                            <View style={styles.chartContainer}>
                                <DonutChart
                                    radius={RADIUS}
                                    font={font}
                                    smallFont={smallFont}
                                    totalValue={totalValue}
                                    n={1}
                                    decimals={decimals}
                                    colors={['#ffe680']}
                                />
                            </View>
                        </View>

                        <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} download={false} />

                        <View className="items-center mb-7 space-y-5">
                            <FontAwesome5
                                name="list"
                                size={20}
                                color="black"
                                onPress={() => router.push('/money/operationalExpensesHistory')}
                            />
                        </View>


                    </>

                }
                operationalExpenseData={operationalExpenses.sort((a, b) => a.item.localeCompare(b.item))}
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

const styles = StyleSheet.create({
    chartContainer: {
        width: RADIUS * 2,
        height: RADIUS * 2,
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center'
    },
});

