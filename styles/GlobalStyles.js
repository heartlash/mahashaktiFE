import {StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f7fc',
      padding: 20,
    },
    text: {
      fontSize: 16,
      color: 'black',
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#46a0f8',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    // Add more styles as needed
  });

  export const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 7,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      backgroundColor: 'white',
      color: 'gray',
      paddingRight: 30, // Ensure the text is never behind the dropdown icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 7,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      backgroundColor: 'white',
      color: 'gray',
      paddingRight: 30,
      // Force elevation for Android to ensure the border and background render correctly
      elevation: 3, // Adds shadow on Android to enhance visibility of borders
    },
    placeholder: {
      color: 'gray', // Placeholder text color
    },
  });
  