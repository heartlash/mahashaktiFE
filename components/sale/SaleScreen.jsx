import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SystemBars } from 'react-native-bars';
import LineChart from '../chart/LineChart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedText from '../chart/AnimatedText';
import { useSharedValue } from 'react-native-reanimated';
import { useFont } from '@shopify/react-native-skia';
import SaleList from './SaleList';
import CreateSale from './CreateSale';
import { getMonthStartAndEndDate, formatDateToDDMMYYYY } from '@/lib/util';
import { getSaleDataDateRange } from '@/lib/sale';
import { getVendorsData } from '@/lib/vendor';
import { getDocument } from '@/lib/download';
import MonthYearSelector from '../MonthYearAndFilter';
import { getFormattedDate, monthNames } from '@/lib/util';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import CustomModal from '../CustomModal';


const SaleScreen = () => {

    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState(null);
    const selectedValue = useSharedValue(0);
    const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 50);

    const [loading, setLoading] = useState(true);

    const [saleData, setSaleData] = useState([]);
    const [storedSaleData, setStoredSaleData] = useState([]);
    const [averageRatePerCarton, setAverageRatePerCarton] = useState(0);
    const [averageDailySaleCount, setAverageDailySaleCount] = useState(0);



    const [createSale, setCreateSale] = useState(false)
    const [vendorData, setVendorData] = useState([]);

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)



    const [updateComponent, setUpdateComponent] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [vendorFilter, setVendorFilter] = useState(null);
    const [paidFilter, setPaidFilter] = useState(null);

    const [refresh, setRefresh] = useState(false);
    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Promise.all([fetchSaleDataDateRange(), fetchVendorData()])
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    }, []);

    const filterData = () => {
        let paidBoolean = null;
        if (paidFilter == 'Yes') paidBoolean = true;
        if (paidFilter == 'No') paidBoolean = false;
        var filteredList = []

        for (var data of storedSaleData) {

            if (vendorFilter === null && paidBoolean === null)
                filteredList.push(data)

            else if (vendorFilter == data.vendorId && paidBoolean === null)
                filteredList.push(data)

            else if (vendorFilter === null && paidBoolean == data.paid)
                filteredList.push(data)

            else if (vendorFilter == data.vendorId && paidBoolean == data.paid)
                filteredList.push(data)
        }

        return filteredList
    }

    const consolidateSalesData = (saleData) => {
        const aggregatedData = new Map();

        saleData.forEach(({ saleDate, soldCount }) => {
            if (aggregatedData.has(saleDate)) {
                aggregatedData.set(saleDate, aggregatedData.get(saleDate) + soldCount);
            } else {
                aggregatedData.set(saleDate, soldCount);
            }
        });

        const result = Array.from(aggregatedData, ([saleDate, soldCount]) => ({
            value: soldCount,
            label: saleDate,
            date: getFormattedDate(saleDate)
        }));

        return result.reverse();
    };

    const handleShowPress = () => {

        setSelectedMonth(month);
        setSelectedYear(year);
        setUpdateComponent(!updateComponent);

        const filteredData = filterData()
        setSaleData(filteredData)
    };

    const handleDownload = async () => {
        var data = []
        var totalEggsSold = 0;
        var totalAmount = 0;
        var totalPaidAmount = 0;
        var vendorName = vendorFilter != null ? saleData[0].vendorName : ''

        for (var sale of saleData) {
            totalEggsSold += sale.soldCount
            totalAmount += sale.amount
            totalPaidAmount += sale.paidAmount
            data.push([formatDateToDDMMYYYY(sale.saleDate), sale.soldCount, (sale.soldCount / 210).toFixed(2), sale.rate, + sale.amount, sale.paidAmount, sale.vendorName])
        }

        await getDocument("Sales Report",
            monthNames[selectedMonth - 1] + " " + selectedYear + " " + vendorName,
            ["Date", "Eggs Sold", "Cartons Sold", "Carton Rate", "Amount", "Paid Amount", "Vendor"],
            data.reverse(),
            ["Total Eggs Sold", "Total Cartons", "Average Rate", "Total Amount", "Paid", "Credit"],
            [totalEggsSold, (totalEggsSold / 210).toFixed(2), averageRatePerCarton, totalAmount, totalPaidAmount, totalAmount - totalPaidAmount]
        )
    };

    const fetchSaleDataDateRange = async () => {

        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getSaleDataDateRange(startDate, endDate);

        if (result.errorMessage == null) {
            setSaleData(result.data)
            setStoredSaleData(result.data)
            var count = 0
            var sumOfRatePerCarton = 0
            var sumOfDailySold = 0
            for (var data of result.data) {
                count++
                sumOfRatePerCarton += data.rate
                sumOfDailySold += data.soldCount
            }
            setAverageRatePerCarton(parseFloat(sumOfRatePerCarton / count).toFixed(2))
            setAverageDailySaleCount(parseFloat(sumOfDailySold / count).toFixed(2))

            setLoading(false)

        } else setLoading(true)

    }

    const fetchVendorData = async () => {
        const result = await getVendorsData();
        var vendorList = []
        if (result.errorMessage == null) {
            for (var data of result.data) {
                vendorList.push({ label: data.name, value: data.id });
            }
            setVendorData(vendorList);
            setLoading(false)
        } else setLoading(true)
    }

    useEffect(() => {
        fetchSaleDataDateRange();
        fetchVendorData();

    }, [selectedMonth, selectedYear, refresh])

    if (loading) {
        return <AnimatedActivityIndicator />
    }

    return (
        <GestureHandlerRootView>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

            <SaleList
                listHeaderComponent={<View>
                    {saleData.length > 0 && storedSaleData.length > 0 ? (
                        <View style={styles.container}>
                            <SystemBars animated={true} barStyle={'light-content'} />
                            {selectedDate ? (<Text style={styles.text}>{selectedDate}</Text>) : <Text style={styles.text}>{selectedDate} Sale</Text>}
                            <AnimatedText selectedValue={selectedValue} font={font} />
                            <LineChart
                                data={consolidateSalesData(storedSaleData)}
                                setSelectedDate={setSelectedDate}
                                selectedValue={selectedValue}
                                type="Sale"
                            />
                            <View className="flex flex-row">
                                <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Average Rate Per Carton</Text>
                                <Text className="text-right text-gray-700 font-semibold  mb-2">{averageRatePerCarton}</Text>
                            </View>
                            <View className="flex flex-row">
                                <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Average Daily Sold</Text>
                                <Text className="text-right text-gray-700 font-semibold  mb-2">{averageDailySaleCount}</Text>

                            </View>
                        </View>) : (<></>)}

                    <MonthYearSelector setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload}
                        showVendorAndPaid={true}
                        vendorData={vendorData}
                        setVendorFilter={setVendorFilter}
                        setPaidFilter={setPaidFilter} />

                    {createSale ? (
                        <CreateSale
                            onClose={() => setCreateSale(false)}
                            vendorData={vendorData}
                            onRefreshOnChange={onRefreshOnChange}
                            setSuccessModalVisible={setSuccessModalVisible}
                            setFailureModalVisible={setFailureModalVisible}
                            setSubmitModalVisible={setSubmitModalVisible}
                        />
                    ) : (
                        <View className="flex-row justify-end mb-3">
                            {/* Center Button */}
                            <View className="mr-20 items-end">
                                <Ionicons name="add-circle" size={45} color="black" onPress={() => setCreateSale(true)} />
                            </View>

                            {/* Right-Aligned Button */}
                            <View className=" items-end pr-4 mt-1">
                                <TouchableOpacity className="bg-yellow-200 p-2 rounded-md" onPress={() => router.push('/sale/vendors')}>
                                    <Text className="text-black">Vendors</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                }


                saleData={saleData}
                setSaleData={setSaleData}
                vendorData={vendorData}
                onRefreshOnChange={onRefreshOnChange}
                onRefresh={onRefresh}
                refreshing={refreshing}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}
            />

        </GestureHandlerRootView>

    )
};

export default SaleScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    },
    text: {
        color: 'black',
        fontSize: 24,
        paddingTop: 10,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
});

