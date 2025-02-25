import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { getPriceRecommendation } from '@/lib/money';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import PriceRecommendationDataList from './PriceRecommendationDataList';
import Animated, { FadeInDown } from 'react-native-reanimated';


const PriceRecommendation = () => {

    const navigation = useNavigation()

    const [recommendationData, setRecommendationData] = useState([]);
    const [recommendatedPrice, setRecommendatedPrice] = useState(0);

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPriceRecommendation().then(() => setRefreshing(false));
    }, []);

    const fetchPriceRecommendation = async () => {
        const result = await getPriceRecommendation()
        if (result.data != null) {
            var price = result.data.reduce((total, data) => total + data.recommendedCartonPrice, 0);

            setRecommendatedPrice((price / result.data.length).toFixed(2));
            setRecommendationData(result.data)
            setLoading(false);
        }
        else {
            setLoading(true);
        }
    }


    useEffect(() => {
        fetchPriceRecommendation();
    }, [])


    if (loading)
        return <AnimatedActivityIndicator />

    return (
        <>
            <PriceRecommendationDataList
                listHeaderComponent={
                    <View>
                        <View className="flex-row items-center mx-2 my-1 mb-5">
                            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                            <View className="flex-1 items-center">
                                <Text className="text-lg font-bold mr-2">Price Recommendation</Text>
                            </View>
                        </View>
                        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
                            <View style={styles.container} className="p-5 justify-center items-center mb-4">
                                <Text className="text-2xl text-lime-800 font-bold">₹{recommendatedPrice}</Text>
                            </View>
                        </Animated.View>
                    </View>
                }
                data={recommendationData}
                refreshing={refreshing}
                onRefresh={onRefresh}
                listFooterComponent={
                    <Text className="text-gray-700 text-center">** Based on today's data on eggrate.in </Text>
                }
            />
        </>

    );

}

export default PriceRecommendation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    }
});