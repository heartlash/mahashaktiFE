import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DonutChart from '../donut/DonutChart';
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import RenderItem from '../donut/RenderItem';
import { useGlobalSearchParams } from 'expo-router';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getOperationalExpenses } from '@/lib/operationalExpense';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';


const RADIUS = 120;


export const OperationalExpensesChart = () => {

    const { month, year } = useGlobalSearchParams();
    const navigation = useNavigation();


    const [operationExpenseItemToAmountExpense, setOperationExpenseItemToAmountExpense] = useState({})

    const [data, setData] = useState([]);
    const totalValue = useSharedValue(0);
    const decimals = useSharedValue([]);
    const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433', '#ff9cb1', '#5ab0ff', '#d5f97a',
        '#a2ebd2', '#f75a59', '#ffa3c3', '#71b8ff', '#e1ff8c', '#b8eed9', '#ff7b7a'];

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOperationalExpensesHistory().then(() => setRefreshing(false));
    }, []);

    const fetchOperationalExpensesHistory = async () => {
        setLoading(true)
        const { startDate, endDate } = getMonthStartAndEndDate(month, year)
        const result = await getOperationalExpenses(startDate, endDate);
        if (result.errorMessage == null) {
            const operationalExpenseItemToAmountMapped = result.data.reduce((acc, item) => {
                if (acc[item.itemName]) {
                    acc[item.itemName] += item.amount;
                } else {
                    acc[item.itemName] = item.amount;
                }
                return acc;
            }, {});

            setOperationExpenseItemToAmountExpense(operationalExpenseItemToAmountMapped);
            generateData(operationalExpenseItemToAmountMapped);
            setLoading(false)
        }
        if (result.data == null)
            setMaterialToAmountExpense({})
    }

    useEffect(() => {

        fetchOperationalExpensesHistory();

    }, [])


    const calculatePercentage = (numbers, total) => {
        const percentageArray = [];

        numbers.forEach(number => {
            const percentage = Math.round((number / total) * 100);

            percentageArray.push(percentage);
        });

        return percentageArray;
    }

    const generateData = (operationExpenseItemToAmountExpense) => {

        const generateNumbers = Object.values(operationExpenseItemToAmountExpense)
        const materialNames = Object.keys(operationExpenseItemToAmountExpense)

        const total = generateNumbers.reduce(
            (acc, currentValue) => acc + currentValue,
            0,
        );
        const generatePercentages = calculatePercentage(generateNumbers, total);
        const generateDecimals = generatePercentages.map(
            number => Number(number.toFixed(0)) / 100,
        );
        totalValue.value = withTiming(total, { duration: 1000 });
        decimals.value = [...generateDecimals];

        const arrayOfObjects = generateNumbers.map((value, index) => ({
            value,
            percentage: generatePercentages[index],
            color: colors[index],
            name: materialNames[index]
        }));

        setData(arrayOfObjects);
    };

    const font = useFont(require('../../assets/fonts/Roboto-Bold.ttf'), 40);
    const smallFont = useFont(require('../../assets/fonts/Roboto-Light.ttf'), 20);

    if (!font || !smallFont || loading) {
        return <AnimatedActivityIndicator/>
    }

    return (
        <View>
            <View className="mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>
            <ScrollView
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <View style={styles.chartContainer}>
                    <DonutChart
                        radius={RADIUS}
                        font={font}
                        smallFont={smallFont}
                        totalValue={totalValue}
                        n={data.length}
                        decimals={decimals}
                        colors={colors}
                        type="Spent"
                    />
                </View>
                {data.map((item, index) => {
                    return <RenderItem item={item} key={index} index={index} goTo={"/money/operationalExpensesScreen"} />;
                })}


            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    chartContainer: {
        width: RADIUS * 2,
        height: RADIUS * 2,
        marginTop: 10,
        marginBottom: 20
    },
    button: {
        marginVertical: 40,
        backgroundColor: '#f4f7fc',
        paddingHorizontal: 60,
        paddingVertical: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: 20,
    },
});

