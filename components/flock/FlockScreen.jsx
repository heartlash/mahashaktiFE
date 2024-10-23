import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import MonthYearAndFilter from '../MonthYearAndFilter';
import { getFlockCount, getFlockChange } from '@/lib/flock';
import CreateFlockChange from './CreateFlockChange';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../CustomModal';
import FlockList from './FlockList';
import { getMonthStartAndEndDate } from '@/lib/util';



const FlockScreen = () => {

    const navigation = useNavigation()
    const [flockCount, setFlockCount] = useState(0)
    const [flockChangeData, setFlockChangeData] = useState([])
    const [totalMortality, setTotalMortality] = useState(0)
    const [averageDailyMortality, setAverageDailyMortality] = useState(0)

    const [createNewFlockChange, setCreateNewFlockChange] = useState(false)

    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFlockData().then(() => setRefreshing(false));
    }, []);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }


    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());


    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
    }

    const handleDownload = async () => {

    };

    const fetchFlockData = async () => {
        const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
        const result = await getFlockCount();
        if (result.errorMessage == null) {
            setFlockCount(result.data);
            setLoading(false);
        } else {
            setLoading(true);
        }

        const resultFlockChange = await getFlockChange(startDate, endDate);
        var totalMortalityCount = 0;
        for (var flockChange of resultFlockChange.data) {
            if (flockChange.count < 0)
                totalMortalityCount = totalMortalityCount + Math.abs(flockChange.count)
        }
        setTotalMortality(totalMortalityCount);
        setAverageDailyMortality(resultFlockChange.data.length != 0 ? parseFloat(totalMortalityCount / resultFlockChange.data.length).toFixed(2) : 0)

        if (resultFlockChange.errorMessage == null) {
            setFlockChangeData(resultFlockChange.data);
            setLoading(false);
        } else {
            setLoading(true);
        }
    };

    useEffect(() => {

        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth() + 1); // Reset to the current month
        setSelectedYear(new Date().getFullYear()); // Reset to the current year

        fetchFlockData();

    }, [])

    useEffect(() => {
        fetchFlockData();
    }, [selectedMonth, selectedYear, refresh])

    return (
        <>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
            <FlockList
                listHeaderComponent={<>
                    <View className="mx-2 my-1">
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                    </View>
                    <View style={styles.container}>
                        <View className="p-7 justify-center items-center">

                            <Text className="text-xl font-bold text-black">Total Flock: {flockCount} </Text>
                        </View>
                        <View className="flex flex-row">
                            <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Total Mortality</Text>
                            <Text className="text-right text-gray-700 font-semibold  mb-2">{totalMortality}</Text>
                        </View>
                        <View className="flex flex-row">
                            <Text className="text-left text-gray-700 font-semibold mx-5 mb-2">Average Daily Mortality</Text>
                            <Text className="text-right text-gray-700 font-semibold  mb-2">{averageDailyMortality}</Text>
                        </View>
                    </View>
                    <MonthYearAndFilter setMonth={setMonth} setYear={setYear} month={month} year={year} handleShowPress={handleShowPress} handleDownload={handleDownload} />

                    {createNewFlockChange ? (
                        <CreateFlockChange
                            onClose={() => setCreateNewFlockChange(false)}
                            onRefreshOnChange={onRefreshOnChange}
                            setSuccessModalVisible={setSuccessModalVisible}
                            setFailureModalVisible={setFailureModalVisible}
                            setSubmitModalVisible={setSubmitModalVisible}

                        />
                    ) : (<View className="mb-3">
                        <Ionicons name="add-circle" className="mb-3" size={45} style={{ alignSelf: 'center' }} color="black" onPress={() => setCreateNewFlockChange(true)} />
                    </View>
                    )}
                </>
                }
                data={flockChangeData.sort((a, b) => b.date.localeCompare(a.date))}
                onRefreshOnChange={onRefreshOnChange}
                refreshing={refreshing}
                onRefresh={onRefresh}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}

            />
        </>
    );
}



export default FlockScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    }
});