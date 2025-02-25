import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DonutChart from '../donut/DonutChart';
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getMaterialPurchase, getMaterials, getMaterialPurchaseLatest } from '@/lib/materialPurchase';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomModal from '../CustomModal';
import MaterialExpenseList from '../materialPurchase/MaterialExpenseList';
import MonthYearAndFilter from '../MonthYearAndFilter';
import { getFormattedDate } from '@/lib/util';

const RADIUS = 120;


export const MaterialExpensesScreen = () => {

    const navigation = useNavigation();
    const router = useRouter();

    const [materials, setMaterials] = useState([]);

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
        fetchMaterialPurchase().then(() => setRefreshing(false));
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


    const fetchMaterialPurchase = async () => {
        setLoading(true)

        var materials = []
        const materialsResult = await getMaterials();
        if (materialsResult.errorMessage == null) {
            materials = materialsResult.data
            setMaterials(materialsResult.data)

        }

        const latestMaterialPurchaseResult = await getMaterialPurchaseLatest();
        if (latestMaterialPurchaseResult.errorMessage == null) {
            setLoading(false);
        }
        else {
            setLoading(true);
        }

        const { startDate, endDate } = getMonthStartAndEndDate(month, year)

        const result = await getMaterialPurchase(null, startDate, endDate);

        if (result.errorMessage == null) {
            const materialToAmountMapped = result.data.reduce((acc, item) => {
                if (acc[item.materialId]) {
                    acc[item.materialId] += item.amount;
                } else {
                    acc[item.materialId] = item.amount;
                }
                return acc;
            }, {});

            var total = Object.values(materialToAmountMapped).reduce(
                (acc, currentValue) => acc + currentValue,
                0,
            );

            for (var material of materials) {
                if (material.id in materialToAmountMapped) {
                    material.amountSpent = materialToAmountMapped[material.id]
                }
                else material.amountSpent = 0

                if (material.id in latestMaterialPurchaseResult.data) {
                    material.lastPurchaseRate = latestMaterialPurchaseResult.data[material.id].rate
                    material.lastPurchaseDate = getFormattedDate(latestMaterialPurchaseResult.data[material.id].purchaseDate)
                    material.lastPurchaseQuantity = latestMaterialPurchaseResult.data[material.id].quantity
                }
                else {
                    material.lastPurchaseRate = "NA"
                    material.lastPurchaseDate = "NA"
                    material.lastPurchaseQuantity = "NA"
                }

            }

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

        fetchMaterialPurchase();

    }, [])

    useEffect(() => {
        fetchMaterialPurchase();
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
                    <Text className="text-lg font-bold mr-2">Material Expenses</Text>
                </View>
            </View>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

            <MaterialExpenseList
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
                                onPress={() => router.push('/money/materialPurchaseHistory')}
                            />
                        </View>


                    </>

                }
                materialExpenseData={materials.sort((a, b) => a.name.localeCompare(b.name))}
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

