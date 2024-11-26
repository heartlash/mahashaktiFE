import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PriceRecommendationDataItem = ({ item }) => {


    return (<>
        <Text className="text-gray-700 font-bold text-lg mb-3 ml-3">{item.region}</Text>
        <TouchableOpacity
            className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
        >
            <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
            >
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-bold">Egg Price</Text>
                    <Text className="text-gray-700 font-bold">₹{item.eggPrice}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-bold">Base Carton Price</Text>
                    <Text className="text-lime-800 font-bold">₹{item.cartonPrice}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-bold">Carton Price Including Transportation</Text>
                    <Text className="text-lime-800 font-bold">₹{item.cartonPriceWithTransportation}</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>


        <TouchableOpacity
            className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
        >
            <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
            >
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-bold">Premium Charge</Text>
                    <Text className="text-gray-700 font-bold">₹{item.premiumCharge}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-bold">Transportation Charge</Text>
                    <Text className="text-gray-700 font-bold">₹{item.transportationCharge}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-bold">Recommended Egg Price </Text>
                    <Text className="text-gray-700 font-bold">₹{item.recommendedEggPrice}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-700 font-bold">Recommended Carton Price</Text>
                    <Text className="text-lime-800 font-bold">₹{item.recommendedCartonPrice}</Text>
                </View>

            </Animated.View>
        </TouchableOpacity>
    </>

    );
};

export default PriceRecommendationDataItem;
