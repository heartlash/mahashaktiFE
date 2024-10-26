import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DonutChart from '../donut/DonutChart';
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import RenderItem from '../donut/RenderItem';
import { useGlobalSearchParams } from 'expo-router';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getMaterialPurchase, getMaterials } from '@/lib/materialPurchase';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import CreateMaterialPurchase from '../materialPurchase/CreateMaterialPurchase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomModal from '../CustomModal';

const RADIUS = 120;


export const MaterialExpensesScreen = () => {

    const { month, year } = useGlobalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();

    const [materialToAmountExpense, setMaterialToAmountExpense] = useState({})
    const [createMaterialPurchase, setCreateMaterialPurchase] = useState(false)

    const [data, setData] = useState([]);
    const [materials, setMaterials] = useState([]);

    const totalValue = useSharedValue(0);
    const decimals = useSharedValue([]);
    const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433', '#ff9cb1', '#5ab0ff', '#d5f97a',
        '#a2ebd2', '#f75a59', '#ffa3c3', '#71b8ff', '#e1ff8c', '#b8eed9', '#ff7b7a'];

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


    const fetchMaterialPurchase = async () => {
        setLoading(true)
        const { startDate, endDate } = getMonthStartAndEndDate(month, year)
        const result = await getMaterialPurchase(null, startDate, endDate);
        if (result.errorMessage == null) {
            const materialToAmountMapped = result.data.reduce((acc, item) => {
                if (acc[item.materialName]) {
                    acc[item.materialName] += item.amount;
                } else {
                    acc[item.materialName] = item.amount;
                }
                return acc;
            }, {});

            setMaterialToAmountExpense(materialToAmountMapped);
            generateData(materialToAmountMapped);
            setLoading(false)

        }
        if (result.data == null)
            setMaterialToAmountExpense({})
    }

    const fetchMaterials = async () => {
        const result = await getMaterials();
        if (result.errorMessage == null) {
            var materialItems = []
            for (var data of result.data) {
                materialItems.push({ label: data.name, value: data.id, unit: data.unit });
            }
            setMaterials(materialItems)
            setLoading(false);
        }
        else {
            setLoading(true);
        }
    }


    useEffect(() => {

        fetchMaterialPurchase();
        fetchMaterials();

    }, [refresh])


    const calculatePercentage = (numbers, total) => {
        const percentageArray = [];

        numbers.forEach(number => {
            const percentage = Math.round((number / total) * 100);

            percentageArray.push(percentage);
        });

        return percentageArray;
    }

    const generateData = (materialToAmountExpense) => {

        const generateNumbers = Object.values(materialToAmountExpense)
        const materialNames = Object.keys(materialToAmountExpense)

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
                {!createMaterialPurchase && (
                    <View className="items-center mb-7 space-y-5">
                        <Ionicons
                            name="add-circle"
                            size={45}
                            color="black"
                            onPress={() => setCreateMaterialPurchase(true)}
                        />
                        <FontAwesome5
                            name="list"
                            size={20}
                            color="black"
                            onPress={() => router.push('/money/materialPurchaseHistory')}
                        />
                    </View>


                )}

                {/* CreateMaterialPurchase Section */}
                {createMaterialPurchase && (
                    <View className="w-full px-4 mb-4">
                        <CreateMaterialPurchase
                            onClose={() => setCreateMaterialPurchase(false)}
                            onRefreshOnChange={onRefreshOnChange}
                            materials={materials}
                            setSuccessModalVisible={setSuccessModalVisible}
                            setFailureModalVisible={setFailureModalVisible}
                            setSubmitModalVisible={setSubmitModalVisible}
                        />
                    </View>
                )}

                {/* List Section */}
                <View className="w-full px-4">
                    {data.map((item, index) => (
                        <RenderItem item={item} key={index} index={index} goTo={"/money/materialPurchaseHistory"} />
                    ))}
                </View>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    chartContainer: {
        width: RADIUS * 2,
        height: RADIUS * 2,
        marginTop: 10,
        marginBottom: 20
    },
});

