import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, TextInput } from 'react-native';
import React, { useState } from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { router } from 'expo-router';



export default RenderItem = ({ item, index, goTo, isVendor }) => {
  const { width } = useWindowDimensions();

  const [isExpanded, setIsExpanded] = useState(false);
  const [amount, setAmount] = useState(0);


  const onPress = () => {
    if (isVendor) {
      setIsExpanded(!isExpanded);
    } else {
      router.push(goTo)
    }
  }
  return (
    <Animated.View
      style={[styles.container, { width: width * 0.9 }]}
      entering={FadeInDown.delay(index * 200)}
      exiting={FadeOutDown}>
      <TouchableOpacity style={styles.contentContainer} onPress={() => onPress()}>
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
          <TouchableOpacity style={styles.settleButton}>
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
