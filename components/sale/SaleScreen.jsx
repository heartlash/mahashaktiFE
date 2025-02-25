import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getSaleDataDateRange } from '@/lib/sale';
import MonthYearAndFilter from '../MonthYearAndFilter';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import CustomModal from '../CustomModal';
import EggTypeList from '../egg/EggTypeList';
import { formatMoneyOrNumber } from '@/lib/util';
import { getEggTypes } from '@/lib/eggType';

const SaleScreen = () => {

    const [eggTypeData, setEggTypeData] = useState([]);

    const [totalSale, setTotalSale] = useState(0);
    const [totalVendorsSold, setTotalVendorsSold] = useState(0);


    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)
    const [chartRefresh, setChartRefresh] = useState(false);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Promise.all([fetchSaleDataDateRange()])
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    }, []);
    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    }

    const handleDownload = async () => {
    };

    const fetchSaleDataDateRange = async () => {

        const eggTypesResult = await getEggTypes();

        if (eggTypesResult.errorMessage == null) {
            setLoading(false)

        } else setLoading(true)


        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getSaleDataDateRange(startDate, endDate);

        if (result.errorMessage == null) {
            var vendorList = []
            var sumOfDailySold = 0
            for (var data of result.data) {
                sumOfDailySold += data.soldCount
                if (!vendorList.includes(data.vendorId)) vendorList.push(data.vendorId)
            }

            // Add individual analytics to eggTypeData
            eggTypesResult.data.forEach(type => {

                const filteredData = result.data.filter(sale => sale.eggTypeId == type.id);

                // Calculate total sold for this egg type
                type.totalSold = filteredData.reduce((sum, sale) => sum + sale.soldCount, 0);

                // Calculate average sale rate for this egg type
                type.averageRate = filteredData.length > 0
                    ? Math.floor(filteredData.reduce((sum, sale) => sum + sale.rate, 0) / filteredData.length)
                    : 0;

                // Calculate unique vendors for this egg type
                type.vendors = new Set(filteredData.map(sale => sale.vendorId)).size;
            });

            setEggTypeData(eggTypesResult.data)
            setTotalSale(sumOfDailySold)
            setTotalVendorsSold(vendorList.length)
            setLoading(false)

        } else setLoading(true)

    }


    useEffect(() => {

        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
        setSelectedYear(new Date().getFullYear()); // Reset to the current year

        fetchSaleDataDateRange();

    }, [])

    useEffect(() => {
        fetchSaleDataDateRange();
        setChartRefresh(!chartRefresh);
    }, [selectedMonth, selectedYear, refresh])

    if (loading) {
        return <AnimatedActivityIndicator />
    }

    return (
        <>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

            <EggTypeList
                listHeaderComponent={<>
                    <View style={styles.container}>
                        <View className="p-7 justify-center items-center">
                            <Text className="text-xl font-bold text-black">Total Sale: {formatMoneyOrNumber(totalSale)} </Text>
                        </View>
                    </View>
                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload} download={false} />
                </>
                }
                isSale={true}
                data={eggTypeData}
                onRefreshOnChange={onRefreshOnChange}
                refreshing={refreshing}
                onRefresh={onRefresh}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}
            />
        </>
    );
};

export default SaleScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
        justifyContent: 'flex-end',
    },
    text: {
        color: 'black',
        fontSize: 24,
        paddingTop: 10,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    view: {
        position: 'absolute',
    }
});

