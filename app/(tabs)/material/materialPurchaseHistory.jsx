import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialPurchaseHistoryList from '@/components/materialPurchaseHistory/MaterialPurchaseHistoryList';
import MonthYearAndFilter from '@/components/MonthYearAndFilter';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getMaterialPurchaseHistory } from '@/lib/materialPurchase';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NoDataFound from '@/components/NoDataFound';



const MaterialPurchaseHistory = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();


    const [materialPurchaseHistoryData, setMaterialPurchaseHistoryData] = useState([]);

    /// starts here

    // State to store selected month and year
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [refresh, setRefresh] = useState(false);
    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMaterialPurchaseHistory().then(() => setRefreshing(false));
    }, []);



    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const fetchMaterialPurchaseHistory = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getMaterialPurchaseHistory(id, startDate, endDate);
        if (result.errorMessage == null) {
            setMaterialPurchaseHistoryData(result.data)
        }
        if (result.data == null)
            setMaterialPurchaseHistoryData([])
    }


    useEffect(() => {

        fetchMaterialPurchaseHistory();

    }, [selectedMonth, selectedYear])

    return (
        <SafeAreaView>



            {materialPurchaseHistoryData.length > 0 ? (
                <MaterialPurchaseHistoryList
                    listHeaderComponent={
                        <View>
                            <View className="mx-2 my-1">
                                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                            </View>
                            <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} />
                        </View>
                    }
                    materialPurchaseHistoryData={materialPurchaseHistoryData.reverse()}
                    setMaterialPurchaseHistoryData={setMaterialPurchaseHistoryData}
                    onRefreshOnChange={onRefreshOnChange}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            ) : (<NoDataFound/>)}
        </SafeAreaView>

    )
};

export default MaterialPurchaseHistory;