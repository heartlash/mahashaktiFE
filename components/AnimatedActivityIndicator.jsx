import React from 'react';
import { View, ActivityIndicator, Animated, StyleSheet, Text } from 'react-native';

const AnimatedActivityIndicator = ({size, padding}) => {
  const animatedColor = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedColor, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedColor, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }),
    ])
  ).start();

  const interpolatedColor = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3498db', '#e74c3c'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinnerWrapper, { backgroundColor: interpolatedColor }]}>
        <ActivityIndicator size={size} color="#ffffff" />
      </Animated.View>
      <Text className="mt-4 font-pregular">This might take a moment!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerWrapper: {
    borderRadius: 50,
    padding: 30
  },
});

export default AnimatedActivityIndicator;
