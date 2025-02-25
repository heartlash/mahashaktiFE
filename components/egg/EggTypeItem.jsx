import React from 'react';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { removeUnderscores } from '@/lib/util';
import { formatMoneyOrNumber } from '@/lib/util';

const EggTypeItem = ({ item, isStock, isSale }) => {

    const router = useRouter();
    const onPress = () => {

        var pathname = '/sale/saleTypeScreen';
        if (!isStock) {
            router.push({
                pathname,
                params: {
                    eggTypeName: item.name,
                    eggTypeId: item.id,
                }
            })
        }
    }

    var trays;
    var cartons;
    var eggs;

    function calculateEggs(x) {
        const eggsPerCarton = 210;
        const eggsPerTray = 30;

        cartons = Math.floor(x / eggsPerCarton);

        const remainingEggs = x % eggsPerCarton;

        trays = Math.floor(remainingEggs / eggsPerTray);

        eggs = remainingEggs % eggsPerTray;

    }


    calculateEggs(item.count)


    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
        >
            <Animated.View
                entering={FadeInDown.duration(1000).springify()}
            >
                <View className="flex-row justify-between mb-3">
                    <Text className="text-xl font-semibold text-gray-800">{removeUnderscores(item.name)}</Text>
                    <View className="flex-row space-x-2">

                        {item.name == 'GRADE_A' ? (
                            <Image
                                source={require('../../assets/images/normal.png')}
                                className="w-8 h-8 rounded-md"
                                resizeMode="contain"
                            />
                        ) : (
                            <Image
                                source={require('../../assets/images/broken.png')}
                                className="w-8 h-8 rounded-md"
                                resizeMode="contain"
                            />
                        )}

                    </View>
                </View>
                {isStock && (
                    <>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-700 font-semibold">Eggs In Stock</Text>
                            <Text className="text-gray-700">{formatMoneyOrNumber(item.count)}</Text>
                        </View>

                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-700 font-semibold">Cartons In Stock</Text>
                            <Text className="text-gray-700">{cartons} Cartons {trays} Trays {eggs} Eggs</Text>
                        </View>
                    </>
                )}

                {isSale && (
                    <>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-700 font-semibold">Sold</Text>
                            <Text className="text-gray-700">{formatMoneyOrNumber(item.totalSold)} Eggs</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-700 font-semibold">To</Text>
                            <Text className="text-gray-700">{item.vendors} Vendors</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-700 font-semibold">Average Rate</Text>
                            <Text className="text-gray-700">₹{item.averageRate}</Text>
                        </View>

                    </>
                )}

            </Animated.View>
        </TouchableOpacity>
    );
};

export default EggTypeItem;
