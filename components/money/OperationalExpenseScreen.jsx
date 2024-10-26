import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DonutChart from '../donut/DonutChart';
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import RenderItem from '../donut/RenderItem';
import { useGlobalSearchParams } from 'expo-router';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getOperationalExpenses, getOperationalExpenseItems } from '@/lib/operationalExpense';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomModal from '../CustomModal';
import CreateOperationalExpenseItem from '../operationalExpenses/CreateOperationalExpense';

const RADIUS = 120;


export const OperationalExpensesScreen = () => {

    const { month, year } = useGlobalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();

    const [operationExpenseItemToAmountExpense, setOperationExpenseItemToAmountExpense] = useState({})
    const [createOperationalExpense, setCreateOperationalExpense] = useState(false)
    const [operationalExpenseItems, setOperationalExpenseItems] = useState([]);


    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)


    const [data, setData] = useState([]);
    const totalValue = useSharedValue(0);
    const decimals = useSharedValue([]);
    const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433', '#ff9cb1', '#5ab0ff', '#d5f97a',
        '#a2ebd2', '#f75a59', '#ffa3c3', '#71b8ff', '#e1ff8c', '#b8eed9', '#ff7b7a'];

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [refresh, setRefresh] = useState(false);


    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

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

        fetchOperationalExpensesHistory();
        fetchOperationalExpenseItems();

    }, [refresh])


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
        return <AnimatedActivityIndicator />
    }

    return (
        <View>
            <View className="mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>

            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

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

                {/* Centered Icon Section */}
                {!createOperationalExpense && (
                    <View className="items-center mb-7 space-y-5">
                        <Ionicons
                            name="add-circle"
                            size={45}
                            color="black"
                            onPress={() => setCreateOperationalExpense(true)}
                        />
                        <FontAwesome5
                            name="list"
                            size={20}
                            color="black"
                            onPress={() => router.push('/money/operationalExpensesHistory')}
                        />
                    </View>


                )}

                {/* CreateMaterialPurchase Section */}
                {createOperationalExpense && (
                    <View className="w-full px-4 mb-4">
                        <CreateOperationalExpenseItem
                            onClose={() => setCreateOperationalExpense(false)}
                            onRefreshOnChange={onRefreshOnChange}
                            operationalExpenseItems={operationalExpenseItems}
                            setSuccessModalVisible={setSuccessModalVisible}
                            setFailureModalVisible={setFailureModalVisible}
                            setSubmitModalVisible={setSubmitModalVisible}
                        />
                    </View>
                )}

                <View className="w-full px-4">

                    {data.map((item, index) => {
                        return <RenderItem item={item} key={index} index={index} goTo={"/money/operationalExpensesHistory"} />;
                    })}
                </View>


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

