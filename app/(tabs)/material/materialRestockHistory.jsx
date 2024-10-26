import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import MaterialRestockHistoryList from '@/components/materialRestockHistory/MaterialRestockHistoryList';
import MonthYearAndFilter from '@/components/MonthYearAndFilter';
import { getMonthStartAndEndDate, formatDateToDDMMYYYY, monthNames } from '@/lib/util';
import { getDocument } from '@/lib/download';
import { getMaterialRestock } from '@/lib/materialRestock';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '@/components/CustomModal';



const MaterialRestockHistory = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();


    const [materialRestockHistoryData, setMaterialRestockHistoryData] = useState([]);

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
    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMaterialRestockHistory().then(() => setRefreshing(false));
    }, []);



    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const handleDownload = async () => {
        var data = []
        for (var purchaseData of materialPurchaseHistoryData)
            data.push([formatDateToDDMMYYYY(purchaseData.purchaseDate), purchaseData.materialName,
            purchaseData.quantity + ' ' + purchaseData.unitSymbol, purchaseData.rate, purchaseData.amount])

        await getDocument(purchaseData.materialName + " Purchase Report",
            monthNames[selectedMonth - 1] + " " + selectedYear,
            ["Date", "Material", "Quantity", "Rate", "Amount"],
            data);
    };

    const fetchMaterialRestockHistory = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getMaterialRestock(id, startDate, endDate);
        if (result.errorMessage == null) {
            setMaterialRestockHistoryData(result.data)
        }
        if (result.data == null)
            setMaterialRestockHistoryData([])
    }


    useEffect(() => {

        fetchMaterialRestockHistory();

    }, [refresh, selectedMonth, selectedYear])

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
                <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
                <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
                <View>
                    <View className="flex-row items-center mx-2 my-1">
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                        <View className="flex-1 items-center">
                            <Text className="text-lg font-bold mr-2">Restock History</Text>
                        </View>
                    </View>
                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload} />
                </View>
                {materialRestockHistoryData.length > 0 ? (
                    <MaterialRestockHistoryList
                        materialRestockHistoryData={materialRestockHistoryData.reverse()}
                        setMaterialRestockHistoryData={setMaterialRestockHistoryData}
                        onRefreshOnChange={onRefreshOnChange}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        setSuccessModalVisible={setSuccessModalVisible}
                        setFailureModalVisible={setFailureModalVisible}
                        setSubmitModalVisible={setSubmitModalVisible}
                    />
                ) : (<></>)}
            </KeyboardAvoidingView>
        </SafeAreaView>

    )
};

export default MaterialRestockHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Your global background color
        paddingBottom: 30
    },
});
