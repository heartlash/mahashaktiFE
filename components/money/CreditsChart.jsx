import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DonutChart from '../donut/DonutChart';
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import RenderItem from '../donut/RenderItem';
import { getVendorsCredits, settleVendorCredit } from '@/lib/vendor';
import { useNavigation } from '@react-navigation/native';


const RADIUS = 160;


const CreditsChart = () => {

    const navigation = useNavigation();


    const [creditsToVendors, setCreditsToVendors] = useState({})
    const [loading, setLoading] = useState(false)


    const [data, setData] = useState([]);
    const totalValue = useSharedValue(0);
    const decimals = useSharedValue([]);
    const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433', '#ff9cb1', '#5ab0ff', '#d5f97a',
        '#a2ebd2', '#f75a59', '#ffa3c3', '#71b8ff', '#e1ff8c', '#b8eed9', '#ff7b7a'];

    const fetchVendorsCredits = async () => {
        const result = await getVendorsCredits();
        if (result.errorMessage == null) {
            const vendorToAmountMapped = result.data.reduce((acc, item) => {
                if (acc[item.vendorName]) {
                    acc[item.vendorName] += item.amount;
                } else {
                    acc[item.vendorName] = item.amount;
                }
                return acc;
            }, {});
            setCreditsToVendors(vendorToAmountMapped);
            generateData(vendorToAmountMapped);

        }
        if (result.data == null)
            setCreditsToVendors({})
    }

    useEffect(() => {

        fetchVendorsCredits();

    }, [])


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

    const font = useFont(require('../../assets/fonts/Roboto-Bold.ttf'), 60);
    const smallFont = useFont(require('../../assets/fonts/Roboto-Light.ttf'), 25);

    if (!font || !smallFont) {
        return <View />
    }

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
            <ScrollView
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.chartContainer}>
                    <DonutChart
                        radius={RADIUS}
                        font={font}
                        smallFont={smallFont}
                        totalValue={totalValue}
                        n={data.length}
                        decimals={decimals}
                        colors={colors}
                        type="Credit"
                    />
                </View>
                {data.map((item, index) => {
                    return <RenderItem item={item} key={index} index={index} isVendor={true} />;
                })}


            </ScrollView>
        </View>
    );
};

export default CreditsChart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    chartContainer: {
        width: RADIUS * 2,
        height: RADIUS * 2,
        marginTop: 10,
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

