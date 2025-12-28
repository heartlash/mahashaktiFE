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

export const dropdownStyles = StyleSheet.create({
    dropdown: {
      height: 40,
      backgroundColor: 'white',
      borderRadius: 10,
      paddingHorizontal: 12,
      alignContent: 'center',
      borderWidth: 1,
      borderColor: 'gray',

    },
    placeholderStyle: {
      color: 'gray',
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: 'black',
    },    
    iconStyle: {
      display: 'none'
    },
  });
  