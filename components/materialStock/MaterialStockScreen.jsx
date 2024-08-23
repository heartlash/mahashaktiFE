import { View, Text, FlatList, Dimensions, Button, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { router } from 'expo-router';
import { getMaterialStock } from '@/lib/materialStock';
import { PlusCircleIcon } from "react-native-heroicons/solid";
import { MinusCircleIcon } from "react-native-heroicons/solid";
import CreateMaterialPurchase from './CreateMaterialPurchase';
import CreateMaterialConsumption from './CreateMaterialConsumption';
import { useNavigation } from '@react-navigation/native';




const MaterialStockScreen = () => {

    const [materialStockData, setMaterialStockData] = useState([])
    const [loading, setLoading] = useState(true)
    const [showRecordConsumption, setShowRecordConsumption] = useState(false)
    const [showRecordPurchase, setShowRecordPurchase] = useState(false)
    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [showRecordButtons, setShowRecordButtons] = useState(true)

    const navigation = useNavigation();



    const handlePressOnMaterial = (item) => {
        if (selectedMaterial == null) setSelectedMaterial(item)
        else setSelectedMaterial(null)
    }

    const handlePressOnRecordPurchase = () => {
        setShowRecordButtons(false)
        setShowRecordPurchase(true);
    }

    const handlePressOnRecordConsumption = (item) => {
        setShowRecordButtons(false)
        setShowRecordConsumption(true);
    }


    const handleOnCloseRecordPurchase = () => {
        setShowRecordButtons(true)
        setShowRecordPurchase(false);
    }

    const handleOnCloseRecordConsumption = () => {
        setShowRecordButtons(true)
        setShowRecordConsumption(false);
    }

    const scrollY = useRef(new Animated.Value(0)).current;

    // Interpolating the scroll position to adjust height and opacity
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 300],
        outputRange: [300, 0],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 300],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handlePressOnMaterial(item)}
        >
            <View className="bg-gray-200 p-2 m-2 rounded-lg">
                <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold text-gray-800">{item.material}</Text>
                    <Text className="text-lg font-semibold text-gray-800">{item.quantity} {item.unit}</Text>
                </View>

                <Text className="font-pregular text-gray-800">Last Purchase Date: {item.lastPurchaseDate}</Text>
                <Text className="font-pregular text-gray-800">Will Last for: 10 days</Text>
                <Text className="font-pregular text-gray-800">Last Purchase Rate: {100.00} per {item.unit}</Text>

                {/* Conditionally render the CreateMaterialPurchase component only for the selected item */}
                {selectedMaterial === item && (
                    <>
                        {showRecordButtons && (
                            <View>
                                <View className="flex-row justify-between">
                                    <MinusCircleIcon onPress={() => handlePressOnRecordConsumption()} />
                                    <PlusCircleIcon onPress={() => handlePressOnRecordPurchase()} />
                                </View>
                                <View className="flex-row justify-between">


                                    <Button
                                        title="Consumption History"
                                        onPress={() => navigation.navigate('materialPurchaseHistory', { id: item.materialId })}
                                    />
                                    <Button
                                        title="Purchase History"
                                        onPress={() => navigation.navigate('materialPurchaseHistory', { id: item.materialId })}
                                    />
                                
                                </View>
                            </View>
                        )}

                        {showRecordConsumption && (
                            <CreateMaterialConsumption materialId={item.materialId} onClose={() => handleOnCloseRecordConsumption()} />
                        )}
                        {showRecordPurchase && (
                            <CreateMaterialPurchase materialId={item.materialId} onClose={() => handleOnCloseRecordPurchase()} />
                        )}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );


    useEffect(() => {
        const fetchMaterialStock = async () => {
            const result = await getMaterialStock();
            if (result.errorMessage == null) {
                setMaterialStockData(result.data);
                console.log("value is set: ", materialStockData)
                setLoading(false);
            } else {
                setLoading(true);
            }
        };

        fetchMaterialStock();
    }, []);


    return (
        <View className="flex-1 bg-white">
            {/* First View (Animated) */}
            <Animated.View
                style={{
                    height: headerHeight,
                    opacity: headerOpacity,
                    overflow: 'hidden', // Ensure the view collapses correctly
                }}
                className="bg-blue-500 p-4 justify-center items-center"
            >
                <Text className="text-2xl font-bold text-white">Total Material: {materialStockData.length}</Text>
                <Text className="text-lg text-white mt-2">Total Sales: $12345</Text>
                <Text className="text-lg text-white mt-2">Total Products: 987</Text>
                <Text className="text-lg text-white mt-2">Active Users: 321</Text>
            </Animated.View>

            {/* Second View (Animated FlatList) */}
            <Animated.FlatList
                data={materialStockData.sort((a, b) => a.material.localeCompare(b.material))}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                style={{ flex: 1 }}
            />
        </View>
    );
}



export default MaterialStockScreen