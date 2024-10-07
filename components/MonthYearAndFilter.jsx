import React from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FontsAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { pickerSelectStyles } from '@/styles/GlobalStyles';

const MonthYearAndFilter = ({
    setMonth,
    setYear,
    month,
    year,
    handleShowPress,
    handleDownload,
    showVendorAndPaid,
    vendorData,
    setVendorFilter,
    setPaidFilter
}) => {
    const monthOptions = [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 }
    ];

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
                        useNativeAndroidPickerStyle={false}  // Add this to have better control on Android
                    />
                </View>
                <View className="flex-1 mr-2">
                    <RNPickerSelect
                        onValueChange={setYear}
                        items={yearOptions}
                        value={year}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select year...", value: null }}
                        useNativeAndroidPickerStyle={false}  // Add this to have better control on Android
                    />
                </View>
                {showVendorAndPaid && (
                    <>
                        <View className="flex-1 mr-2">
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    // Force the value to null if it's the placeholder
                                    setVendorFilter(value === "null" ? null : value);
                                }}
                                items={vendorData}
                                style={pickerSelectStyles}
                                placeholder={{ label: "Vendor...", value: null }}
                                useNativeAndroidPickerStyle={false}  // Add this to have better control on Android
                            />
                        </View>
                        <View className="flex-1">
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    // Force the value to null if it's the placeholder
                                    setPaidFilter(value === "null" ? null : value);
                                }}
                                items={[
                                    { label: 'Yes', value: 'Yes' },
                                    { label: 'No', value: 'No' },
                                ]}
                                style={pickerSelectStyles}
                                placeholder={{ label: "Paid status...", value: null }}
                                useNativeAndroidPickerStyle={false}  // Add this to have better control on Android
                            />
                        </View>
                    </>
                )}
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-4 justify-evenly">
                <FontsAwesome name="search" size={30} color="green" onPress={handleShowPress} />
                <Feather name="download" size={30} color="green" onPress={handleDownload}/>
            </View>
        </View>
    );
};

export default MonthYearAndFilter;
