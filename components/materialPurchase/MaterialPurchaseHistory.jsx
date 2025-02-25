import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import MaterialPurchaseHistoryList from './MaterialPurchaseHistoryList';
import MonthYearAndFilter from '@/components/MonthYearAndFilter';
import { getMonthStartAndEndDate, formatDateToDDMMYYYY, monthNames } from '@/lib/util';
import { getDocument } from '@/lib/download';
import { getMaterialPurchase, getMaterials } from '@/lib/materialPurchase';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '@/components/CustomModal';
import { useLocalSearchParams } from 'expo-router';



const MaterialPurchaseHistory = () => {

    const navigation = useNavigation();

    const { id, name } = useLocalSearchParams();

    const [materialPurchaseData, setMaterialPurchaseData] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    /// starts here

    // State to store selected month and year
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMaterialPurchase().then(() => setRefreshing(false));
    }, []);



    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const handleDownload = async () => {
        var data = []
        for (var purchaseData of materialPurchaseData)
            data.push([formatDateToDDMMYYYY(purchaseData.purchaseDate), purchaseData.materialName,
            purchaseData.quantity + ' ' + purchaseData.unitSymbol, purchaseData.rate, purchaseData.amount])

        await getDocument((name ?? '')  + " Material Purchase Report",
            monthNames[selectedMonth - 1] + " " + selectedYear,
            ["Date", "Material", "Quantity", "Rate", "Amount"],
            data.reverse(),
            [],
            []);
    };

    const fetchMaterialPurchase = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getMaterialPurchase(id, startDate, endDate);
        if (result.errorMessage == null) {
            setMaterialPurchaseData(result.data)
            setLoading(false);
        }
        if (result.data == null)
            setMaterialPurchaseData([])
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

        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
        setSelectedYear(new Date().getFullYear()); // Reset to the current year

        fetchMaterialPurchase();
        fetchMaterials();

    }, [])

    useEffect(() => {

        fetchMaterialPurchase();
        fetchMaterials();

    }, [selectedMonth, selectedYear, refresh])


    return (
        <View>
            <View className="flex-row items-center mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                <View className="flex-1 items-center">
                    <Text className="text-lg font-bold mr-2">Purchase History</Text>
                </View>
            </View>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

            <MaterialPurchaseHistoryList
                listHeaderComponent={
                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload} />
                }
                materialPurchaseData={materialPurchaseData}
                setMaterialPurchaseData={setMaterialPurchaseData}
                onRefreshOnChange={onRefreshOnChange}
                refreshing={refreshing}
                onRefresh={onRefresh}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}
            />

        </View>

    )
};

export default MaterialPurchaseHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Your global background color
        paddingBottom: 30
    },
});
