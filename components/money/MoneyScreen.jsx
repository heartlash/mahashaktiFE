import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import MonthYearAndFilter from '../MonthYearAndFilter';
import { getProfitData } from '@/lib/money';
import { getMonthStartAndEndDate } from '@/lib/util';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import Animated, {FadeInDown} from 'react-native-reanimated';



const MoneyScreen = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(true)

    const [profitData, setProfitData] = useState({
        profit: 0,
        saleAmount: 0,
        credits: 0,
        materialPurchaseExpenses: 0,
        operationalExpenses: 0

    });


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfitData().then(() => setRefreshing(false));
    }, []);


    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());



    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    }


    const fetchProfitData = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getProfitData(startDate, endDate);
        if (result.data != null) {
            setProfitData(result.data)
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

        fetchProfitData();
    }, [])

    useEffect(() => {
        fetchProfitData();
    }, [selectedMonth, selectedYear])


    if (loading)
        return <AnimatedActivityIndicator />

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >

            <View style={styles.container} className="p-10 justify-center items-center mb-4">
                <Text className="text-xl font-bold text-black">Sale Amount: ₹{profitData.saleAmount} </Text>
                <Text className="text-lg text-black mt-2">Credits: ₹{profitData.credits}</Text>
                <Text className="text-lg text-black mt-2">
                    Total Expenses: ₹{profitData.materialPurchaseExpenses + profitData.operationalExpenses}
                </Text>
                <Text className="text-lg text-black mt-2">{profitData.profit === 0 ? 'Profit' : profitData.profit > 0
                    ? 'Profit' : 'Loss'} : ₹{Math.abs(parseInt(profitData.profit))}</Text>
            </View>

            <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} download={false}/>

            <Animated.View
                entering={FadeInDown.duration(1000).springify()}
            >
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/money/materialExpenses',
                    params: {
                        month: selectedMonth,
                        year: selectedYear
                    }
                })}
                style={styles.container}
                className="p-3 rounded-3xl mx-10 my-3"
            >
                <Text className="text-black text-center font-semibold p-3">Material Expenses ₹{profitData.materialPurchaseExpenses}</Text>
            </TouchableOpacity>
            </Animated.View>


            <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
            >
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/money/operationalExpenses',
                    params: {
                        month: selectedMonth,
                        year: selectedYear
                    }
                })}
                style={styles.container}
                className="p-3 rounded-3xl mx-10 my-3"
            >
                <Text className="text-black text-center font-semibold p-3">Operational Expenses ₹{profitData.operationalExpenses}</Text>
            </TouchableOpacity>
            </Animated.View>


            <Animated.View
                entering={FadeInDown.delay(400).duration(1000).springify()}
            >
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/money/vendorCredit',
                    params: {
                        month: selectedMonth,
                        year: selectedYear
                    }
                })}
                style={styles.container}
                className="p-3 rounded-3xl  mx-10 my-3"
            >
                <Text className="text-black text-center font-semibold p-3">All Time Credits</Text>
            </TouchableOpacity>
            </Animated.View>

        </ScrollView>

    );





}



export default MoneyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    }
});



