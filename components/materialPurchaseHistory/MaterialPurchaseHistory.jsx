import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialPurchaseHistoryList from './MaterialPurchaseHistoryList';
import RNPickerSelect from 'react-native-picker-select';
import { getMonthStartAndEndDate } from '@/lib/util';
import { getMaterialPurchaseHistory } from '@/lib/materialPurchase';



const MaterialPurchaseHistoryScreen = () => {
    const { id } = useLocalSearchParams();



    const [materialPurchaseHistoryData, setMaterialPurchaseHistoryData] = useState([]);

    /// starts here

    // State to store selected month and year
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());


    const handleShowPress = () => {
        setSelectedMonth(month);
        setSelectedYear(year);
        // Now you can use filterData as needed, e.g., update state or display it
    };


    // Generate month options (1-12)
    const monthOptions = [{ "label": "January", "value": 1 }, { "label": "February", "value": 2 }, { "label": "March", "value": 3 }, { "label": "April", "value": 4 }, { "label": "May", "value": 5 }, { "label": "June", "value": 6 }, { "label": "July", "value": 7 }, { "label": "August", "value": 8 }, { "label": "September", "value": 9 }, { "label": "October", "value": 10 }, { "label": "November", "value": 11 }, { "label": "December", "value": 12 }]
    const monthMaps = { "1": "January", "2": "February", "3": "March", "4": "April", "5": "May", "6": "June", "7": "July", "8": "August", "9": "September", "10": "October", "11": "November", "12": "December" }
    console.log("see here: ", monthMaps[selectedMonth])

    // Generate year options (e.g., from 1900 to 2100)
    const yearOptions = Array.from({ length: 201 }, (_, i) => ({
        label: `${1900 + i}`,
        value: 1900 + i,
    }));


    useEffect(() => {
        const fetchMaterialPurchaseHistory = async () => {
            console.log("see selectedMonth and year in the constructor: ", selectedMonth, selectedYear)
            const { startDate, endDate } = getMonthStartAndEndDate(selectedMonth, selectedYear)
            console.log("see startDate and endDate: ", startDate, endDate)
            const result = await getMaterialPurchaseHistory(id, startDate, endDate);
            console.log("see result from BE: ", result)
            if (result.errorMessage == null) {
                setMaterialPurchaseHistoryData(result.data)
            }
            if(result.data == null) 
                setMaterialPurchaseHistoryData([])
        }

        fetchMaterialPurchaseHistory();

    }, [selectedMonth, selectedYear])

    return (
        <View>
            <View>
                <View className="flex-row space-x-4 p-4">
                    <View className="flex-1">
                        <RNPickerSelect
                            onValueChange={(value) => setMonth(value)}
                            items={monthOptions}
                            value={month}
                            style={pickerSelectStyles}
                            placeholder={{ label: "Select month...", value: null }}
                        />
                    </View>
                    <View className="flex-1">
                        <RNPickerSelect
                            onValueChange={(value) => setYear(value)}
                            items={yearOptions}
                            value={year}
                            style={pickerSelectStyles}
                            placeholder={{ label: "Select year...", value: null }}
                        />
                    </View>
                    <View className="flex-1">
                        <TouchableOpacity
                            onPress={handleShowPress}
                            className="bg-green-500 p-4 rounded-lg"
                        >
                            <Text className="text-white font-semibold">Show</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {materialPurchaseHistoryData.length > 0 ? (
                    <MaterialPurchaseHistoryList
                        materialPurchaseHistoryData={materialPurchaseHistoryData}
                        setMaterialPurchaseHistoryData={setMaterialPurchaseHistoryData} />
                ) : (<Text>HEHE</Text>)}
            </View>
        </View>

    )
};

export default MaterialPurchaseHistoryScreen;

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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});