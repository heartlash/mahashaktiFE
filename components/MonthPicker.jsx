import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const MonthPicker = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // January is 0, so add 1
  console.log("see today: ", today, "currentMonth: ", currentMonth)
  const currentYear = today.getFullYear();

  // State to store selected month and year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate month options (1-12)
  const monthOptions = [{"label": "January", "value": 1}, {"label": "February", "value": 2}, {"label": "March", "value": 3}, {"label": "April", "value": 4}, {"label": "May", "value": 5}, {"label": "June", "value": 6}, {"label": "July", "value": 7}, {"label": "August", "value": 8}, {"label": "September", "value": 9}, {"label": "October", "value": 10}, {"label": "November", "value": 11}, {"label": "December", "value": 12}]

  console.log("see monthOptions: ", monthOptions)

  // Generate year options (e.g., from 1900 to 2100)
  const yearOptions = Array.from({ length: 201 }, (_, i) => ({
    label: `${1900 + i}`,
    value: 1900 + i,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Month:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedMonth(value)}
        items={monthOptions}
        value={selectedMonth}
        style={pickerSelectStyles}
      />

      <Text style={styles.label}>Select Year:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedYear(value)}
        items={yearOptions}
        value={selectedYear}
        style={pickerSelectStyles}
      />

      <Text style={styles.result}>
        Selected: {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
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

export default MonthPicker;
