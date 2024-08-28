import { Text, View, useWindowDimensions, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SystemBars } from 'react-native-bars';
import LineChart from '../chart/LineChart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedText from '../chart/AnimatedText';
import { useSharedValue } from 'react-native-reanimated';
import { useFont } from '@shopify/react-native-skia';
import SaleList from './SaleList';
import CreateSale from './CreateSale';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getSaleDataDateRange } from '@/lib/sale';
import { getVendorsData } from '@/lib/vendor';
import MonthYearSelector from '../MonthYearAndFilter';
import { getFormattedDate } from '@/lib/util';
import Ionicons from 'react-native-vector-icons/Ionicons';



const SaleScreen = () => {

    const [selectedDate, setSelectedDate] = useState(null);
    const selectedValue = useSharedValue(0);
    const font = useFont(require('../../assets/fonts/Roboto-Regular.ttf'), 60);

    const [saleData, setSaleData] = useState([]);
    const [storedSaleData, setStoredSaleData] = useState([]);

    const [createSale, setCreateSale] = useState(false)
    const [vendorData, setVendorData] = useState([]);


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
        var filteredList = []

        for (var data of storedSaleData) {

            if (vendorFilter === null && paidFilter === null)
                filteredList.push(data)

            else if (vendorFilter == data.vendorId && paidFilter === null)
                filteredList.push(data)

            else if (vendorFilter === null && paidFilter == data.paid)
                filteredList.push(data)

            else if (vendorFilter == data.vendorId && paidFilter == data.paid)
                filteredList.push(data)
        }

        return filteredList
    }

    const consolidateSalesData = (saleData) => {
        // Create an empty map to store aggregated data
        const aggregatedData = new Map();

        // Loop through each item in the data
        saleData.forEach(({ saleDate, soldCount }) => {
            if (aggregatedData.has(saleDate)) {
                // If the date already exists in the map, add to the existing soldCount
                aggregatedData.set(saleDate, aggregatedData.get(saleDate) + soldCount);
            } else {
                // Otherwise, set the initial soldCount for the new date
                aggregatedData.set(saleDate, soldCount);
            }
        });

        // Convert the map back to an array of objects
        const result = Array.from(aggregatedData, ([saleDate, soldCount]) => ({
            value: soldCount,
            label: saleDate,
            date: getFormattedDate(saleDate)
        }));

        console.log("works till here: ", result)
        console.log("saleData till here: ", saleData)

        return result.reverse();
    };

    const handleShowPress = () => {

        setSelectedMonth(month);
        setSelectedYear(year);
        setUpdateComponent(!updateComponent);

        console.log("see current filters: ", vendorFilter, paidFilter)

        const filteredData = filterData()
        setSaleData(filteredData)
    };

    const fetchSaleDataDateRange = async () => {

        console.log("use effect ran")
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getSaleDataDateRange(startDate, endDate);
        console.log("see result in sale screen: ", result)
        setSaleData(result)
        setStoredSaleData(result)

    }

    const fetchVendorData = async () => {
        const result = await getVendorsData();
        var vendorList = []
        if (result != null) {
            for (var data of result) {
                vendorList.push({ label: data.name, value: data.id });
            }
            setVendorData(vendorList);
        }
    }

    useEffect(() => {

        fetchSaleDataDateRange();
        fetchVendorData();

    }, [selectedMonth, selectedYear, refresh])

    console.log("see vendorData in useEffect: ", vendorData)

    return (
        <GestureHandlerRootView>
            <SaleList
                listHeaderComponent={<View>
                    {saleData.length > 0 && storedSaleData.length > 0 ? (
                        <View style={styles.container}>
                            <SystemBars animated={true} barStyle={'light-content'} />
                            {selectedDate ? (<Text style={styles.text}>{selectedDate}</Text>) : <Text style={styles.text}>{selectedDate} Production</Text>}
                            <AnimatedText selectedValue={selectedValue} font={font} />
                            <LineChart
                                data={consolidateSalesData(storedSaleData)}
                                setSelectedDate={setSelectedDate}
                                selectedValue={selectedValue}
                                type="Sale"
                            />
                        </View>) : (<></>)}

                    <MonthYearSelector setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress}
                        showVendorAndPaid={true}
                        vendorData={vendorData}
                        setVendorFilter={setVendorFilter}
                        setPaidFilter={setPaidFilter} />

                    {createSale ? (
                        <CreateSale
                            onClose={() => setCreateSale(false)}
                            vendorData={vendorData}
                        />
                    ) : (
                        <View className="mb-3">
                            <Ionicons name="add-circle" size={45} style={{ alignSelf: 'center' }} color="black" onPress={() => setCreateSale(true)} />
                        </View>
                    )}
                </View>

                }


                saleData={saleData}
                setSaleData={setSaleData}
                vendorData={vendorData}
                onRefreshOnChange={onRefreshOnChange}
                onRefresh={onRefresh}
                refreshing={refreshing} />

        </GestureHandlerRootView>

    )
};

export default SaleScreen;

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

