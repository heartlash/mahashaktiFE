import { View, Text } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { getPriceRecommendation } from '@/lib/money';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import PriceRecommendationDataList from './PriceRecommendationDataList';


const PriceRecommendation = () => {

    const navigation = useNavigation()

    const [recommendationData, setRecommendationData] = useState([]);

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPriceRecommendation().then(() => setRefreshing(false));
    }, []);

    const fetchPriceRecommendation = async () => {
        const result = await getPriceRecommendation()
        if (result.data != null) {
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
                listHeaderComponent={<View className="flex-row items-center mx-2 my-1 mb-5">
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                    <View className="flex-1 items-center">
                        <Text className="text-lg font-bold mr-2">Price Recommendation</Text>
                    </View>
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
