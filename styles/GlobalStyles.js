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
        paddingVertical: 7, // Matches the padding of your TouchableOpacity
        paddingHorizontal: 12, // Matches the padding of your TouchableOpacity
        borderWidth: 1,
        borderColor: 'gray', // Matches 'border-gray-300' class
        borderRadius: 10, // Matches 'rounded-lg' class
        backgroundColor: 'white', // Matches 'bg-white' class
        color: 'black',
        paddingRight: 30, // Ensure the text is never behind the dropdown icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 7, // Matches the padding of your TouchableOpacity
        paddingHorizontal: 12, // Matches the padding of your TouchableOpacity
        borderWidth: 1,
        borderColor: 'gray', // Matches 'border-gray-300' class
        borderRadius: 10, // Matches 'rounded-lg' class
        backgroundColor: 'white', // Matches 'bg-white' class
        color: 'black',
        paddingRight: 30, // Ensure the text is never behind the dropdown icon
    },
});