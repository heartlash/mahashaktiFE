import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const MonthYearAndFilter = ({
    setMonth,
    setYear,
    month,
    year,
    handleShowPress,
    showVendorAndPaid,
    vendorData,
    setVendorFilter,
    setPaidFilter,
    setCreate
}) => {
    const monthOptions = [{ "label": "January", "value": 1 }, { "label": "February", "value": 2 }, { "label": "March", "value": 3 }, { "label": "April", "value": 4 }, { "label": "May", "value": 5 }, { "label": "June", "value": 6 }, { "label": "July", "value": 7 }, { "label": "August", "value": 8 }, { "label": "September", "value": 9 }, { "label": "October", "value": 10 }, { "label": "November", "value": 11 }, { "label": "December", "value": 12 }]

    const yearOptions = Array.from({ length: 201 }, (_, i) => ({
        label: `${1900 + i}`,
        value: 1900 + i,
    }));

    return (
        <View className="space-y-4 p-4">
            {/* Month and Year Pickers */}
            <View className="flex-row justify-between">
                <View className="flex-1 mr-2">
                    <RNPickerSelect
                        onValueChange={setMonth}
                        items={monthOptions}
                        value={month}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select month...", value: null }}
                    />
                </View>
                <View className="flex-1 mr-2">
                    <RNPickerSelect
                        onValueChange={setYear}
                        items={yearOptions}
                        value={year}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select year...", value: null }}
                    />
                </View>
                {showVendorAndPaid && (
                    <>
                        <View className="flex-1 mr-2">
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    console.log("see value in the vendor picker: ", value)
                                    // Force the value to null if it's the placeholder
                                    setVendorFilter(value == "null" ? null : value);
                                }}
                                items={vendorData}
                                style={pickerSelectStyles}
                                placeholder={{ label: "Vendor...", value: null }}
                            />
                        </View>
                        <View className="flex-1">
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    console.log("see value in the paid picker: ", value)

                                    // Force the value to null if it's the placeholder
                                    setPaidFilter(value == "null" ? null : value);
                                }} items={[
                                    { label: 'Yes', value: 'Yes' },
                                    { label: 'No', value: 'No' },
                                ]}
                                style={pickerSelectStyles}
                                placeholder={{ label: "Paid status...", value: null }}
                            />
                        </View>
                    </>
                )}
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-4">
                <View className="flex-1">
                    <TouchableOpacity
                        onPress={handleShowPress}
                        className="bg-green-500 p-4 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Show Data</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-1">
                    <TouchableOpacity
                        onPress={() => setCreate(true)}
                        className="bg-green-500 p-4 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Download PDF</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default MonthYearAndFilter;


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
