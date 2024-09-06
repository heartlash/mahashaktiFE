import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const AnimatedNumber = ({ toValue }) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(toValue, { duration: 2000 });
  }, [toValue]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: 1, // This is just to trigger the re-render
    };
  });

  return (
    <View>
      <Animated.Text style={[{ fontSize: 24 }, animatedTextStyle]}>
        {Math.round(animatedValue.value)}
      </Animated.Text>
    </View>
  );
};