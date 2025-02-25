import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DonutChart from '../donut/DonutChart';
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { getFormattedDate } from '@/lib/util';
import { getVendorsData } from '@/lib/vendor';
import { getCredits } from '@/lib/sale';
import { getPaymentsLatest } from '@/lib/payments';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomModal from '../CustomModal';
import VendorCreditList from '../credit/VendorCreditList';

const RADIUS = 120;


export const VendorCreditScreen = () => {

    const navigation = useNavigation();
    const router = useRouter();

    const [vendorCreditData, setVendorCreditData] = useState({})


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
        fetchVendorsCredits().then(() => setRefreshing(false));
    }, []);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const fetchVendorsCredits = async () => {
        setLoading(true)

        const vendorsResult = await getVendorsData();
        var vendorCreditDataTemp = vendorsResult.data

        const creditsResult = await getCredits();

        const result = await getPaymentsLatest();

        if (creditsResult.errorMessage == null) {
            const vendorToAmountMapped = creditsResult.data.reduce((acc, item) => {
                if (acc[item.vendorId]) {
                    acc[item.vendorId] += item.amount;
                } else {
                    acc[item.vendorId] = item.amount;
                }
                return acc;
            }, {});

            var total = Object.values(vendorToAmountMapped).reduce(
                (acc, currentValue) => acc + currentValue,
                0,
            );

            for (vendor of vendorCreditDataTemp) {
                if (vendor.id in vendorToAmountMapped) {
                    vendor.totalCreditAmount = vendorToAmountMapped[vendor.id]
                } else {
                    vendor.totalCreditAmount = 0
                }

                if (vendor.id in result.data) {
                    vendor.lastAmount = result.data[vendor.id].amount
                    vendor.lastPaymentDate = getFormattedDate(result.data[vendor.id].paymentDate)
                    vendor.lastRemark = result.data[vendor.id].remarks
                }
                else {
                    vendor.lastAmount = "NA"
                    vendor.lastPaymentDate = "NA"
                    vendor.lastRemark = "NA"
                }
            }
        }

        setVendorCreditData(vendorCreditDataTemp)

        totalValue.value = withTiming(total, { duration: 1000 });
        decimals.value = [...['0.1']];
        setLoading(false)

    }


    useEffect(() => {
        fetchVendorsCredits();
    }, [])

    useEffect(() => {
        fetchVendorsCredits();
    }, [refresh])


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
                    <Text className="text-lg font-bold mr-2">Vendor Credits</Text>
                </View>
            </View>

            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />


            <VendorCreditList
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

                        <View className="items-center mt-5 mb-7 space-y-5">
                            <FontAwesome5
                                name="list"
                                size={20}
                                color="black"
                                onPress={() => router.push('/money/paymentsHistory')}
                            />
                        </View>


                    </>

                }
                vendorCreditData={vendorCreditData.sort((a, b) => a.name.localeCompare(b.name))}
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

