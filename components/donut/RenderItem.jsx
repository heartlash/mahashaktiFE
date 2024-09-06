import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { settleVendorCredit } from '@/lib/vendor';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';



export default RenderItem = ({ item, index, goTo, isVendor, isExpanded, onPress, vendorNameToId, onRefreshOnChange }) => {
  const { width } = useWindowDimensions();

  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(0);


  const onPressHere = () => {
    if (!isVendor) {
      router.push(goTo)
    }
    else onPress()
  }

  const onSettle = async(vendorId, amount) => {
    setLoading(true)
    const result = await settleVendorCredit(vendorId, amount);

    if (result.errorMessage == null) {
      Alert.alert("Success", "Data updated", [{ text: "OK" }]);
      onRefreshOnChange()
    } else {
      Alert.alert("Failure", "Data updation failed", [{ text: "OK" }]);
    }
    setLoading(false);
  }

  if(loading)
    return <AnimatedActivityIndicator/>

  return (
    <Animated.View
      style={[styles.container, { width: width * 0.9 }]}
      entering={FadeInDown.delay(index * 200)}
      exiting={FadeOutDown}>
      <TouchableOpacity style={styles.contentContainer} onPress={() => onPressHere()}>
        <View style={[styles.color, { backgroundColor: item.color }]} />
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.text}>{item.percentage}%</Text>
        <Text style={styles.text}>₹{item.value}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.expandedContent}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              const numericValue = parseInt(text);
              if (!isNaN(numericValue) && numericValue <= parseInt(item.value)) {
                setAmount(text);
              } else if (numericValue > parseInt(item.value)) {
                setAmount(item.value);
              }
            }}
            keyboardType="numeric"
            value={amount}
          />
          <TouchableOpacity style={styles.settleButton} onPress={() => onSettle(vendorNameToId[item.name], amount)}>
            <Text style={styles.settleText}>Settle</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: '#f4f7fc',
    borderRadius: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  expandedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10, // Add some space between the rows
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10, // Space between input and button
  },
  settleButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
  },
  settleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
