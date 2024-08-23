import { Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import SaleList from './SaleList';
import CreateSale from './CreateSale';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getSaleDataDateRange } from '@/lib/sale';
import { getVendorsData } from '@/lib/vendor';
import MonthYearSelector from '../MonthYearAndFilter';



const SaleScreen = () => {



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
        <View>
            <SaleList
                listHeaderComponent={

                    <View>
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
                        ) : (<TouchableOpacity
                            onPress={() => setCreateSale(true)}
                            className="bg-blue-500 p-4 rounded-lg mb-2"
                            style={{ alignSelf: 'center' }}
                        >
                            <Text className="text-white font-bold">Create</Text>
                        </TouchableOpacity>
                        )}
                    </View>

                }


                saleData={saleData}
                setSaleData={setSaleData}
                vendorData={vendorData}
                onRefreshOnChange={onRefreshOnChange}
                onRefresh={onRefresh}
                refreshing={refreshing} />

        </View>

    )
};

export default SaleScreen;
