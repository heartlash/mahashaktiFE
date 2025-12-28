import React from 'react';
import { View } from 'react-native';
import FontsAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { dropdownStyles } from '@/styles/GlobalStyles';
import { Dropdown } from 'react-native-element-dropdown';

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
    setPaidFilter,
    download=true
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

    const yearOptions = Array.from({ length: 50 }, (_, i) => ({
        label: `${2024 + i}`,
        value: 2024 + i,
    }));

    return (
        <View className="space-y-4 p-4">
            <View className="flex-row justify-between">
                <View className="flex-1 mr-2">
                    <Dropdown
                        style={dropdownStyles.dropdown}
                        placeholderStyle={dropdownStyles.placeholderStyle}
                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                        iconStyle={dropdownStyles.iconStyle}
                        data={monthOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select month..."
                        value={month}
                        onChange={item => setMonth(item.value)}
                        selectedTextProps={{numberOfLines: 1}} 
                    />
                </View>
                <View className="flex-1 mr-2">
                    <Dropdown
                        style={dropdownStyles.dropdown}
                        placeholderStyle={dropdownStyles.placeholderStyle}
                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                        iconStyle={dropdownStyles.iconStyle}
                        data={yearOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select year..."
                        value={year}
                        onChange={item => setYear(item.value)}
                        selectedTextProps={{numberOfLines: 1}} 
                    />
                </View>
                {showVendorAndPaid && (
                    <>
                        <View className="flex-1 mr-2">
                            <Dropdown
                                style={dropdownStyles.dropdown}
                                placeholderStyle={dropdownStyles.placeholderStyle}
                                selectedTextStyle={dropdownStyles.selectedTextStyle}
                                iconStyle={dropdownStyles.iconStyle}
                                data={vendorData}
                                labelField="label"
                                valueField="value"
                                placeholder="Vendor..."
                                onChange={item => {
                                    setVendorFilter(item.value === null ? null : item.value);
                                }}
                                selectedTextProps={{numberOfLines: 1}}
                                search="true"
                            />
                        </View>
                        <View className="flex-1">
                            <Dropdown
                                style={dropdownStyles.dropdown}
                                placeholderStyle={dropdownStyles.placeholderStyle}
                                selectedTextStyle={dropdownStyles.selectedTextStyle}
                                iconStyle={dropdownStyles.iconStyle}
                                data={[
                                    { label: 'Yes', value: 'Yes' },
                                    { label: 'No', value: 'No' },
                                ]}
                                labelField="label"
                                valueField="value"
                                placeholder="Paid status..."
                                onChange={item => {
                                    setPaidFilter(item.value === null ? null : item.value);
                                }}
                                selectedTextProps={{numberOfLines: 1}}
                            />
                        </View>
                    </>
                )}
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-4 justify-evenly">
                <FontsAwesome name="search" size={30} color="green" onPress={handleShowPress} />
                {download && (<Feather name="download" size={30} color="green" onPress={handleDownload}/>)}
            </View>
        </View>
    );
};

export default MonthYearAndFilter;
