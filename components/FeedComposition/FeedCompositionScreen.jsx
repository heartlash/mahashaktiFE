import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { getSheds } from '@/lib/shed';
import { getFeedQuantityPerShed } from '@/lib/feed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../CustomModal';
import FeedShedList from './FeedShedList';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';



const FeedCompositionScreen = () => {

    const navigation = useNavigation()

    const [shedFeedData, setShedFeedData] = useState([])
  
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchShedFeedData().then(() => setRefreshing(false));
    }, []);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const handleDownload = async () => {

    };

    const fetchShedFeedData = async () => {

        const shedResult = await getSheds();
        var tempShedData = []

        if(shedResult.errorMessage == null) {
            tempShedData = shedResult.data
            setLoading(false)
        } else setLoading(true)

        var tempShedFeedData = []

        for(var shed of tempShedData) {

            const shedFeedQuantityResult = await getFeedQuantityPerShed(shed.id);

            if(shedFeedQuantityResult.errorMessage == null) {
                shed.id = shedFeedQuantityResult.data.id
                shed.shedId =  shedFeedQuantityResult.data.shed.id
                shed.quantityPerBird = shedFeedQuantityResult.data.quantityPerBird
                tempShedFeedData.push(shed)
                setLoading(false)
            } else setLoading(true)
        }

        setShedFeedData(tempShedFeedData)
    }

    useEffect(() => {
        fetchShedFeedData();
    }, [refresh])

    if (loading) {
        return <AnimatedActivityIndicator />
    }

    return (
        <>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />


            <FeedShedList
                listHeaderComponent={<>
                   <View className="flex-row items-center mx-2 my-1 mb-5">
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                        <View className="flex-1 items-center">
                            <Text className="text-lg font-bold mr-2">Feed Composition</Text>
                        </View>
                    </View>
                </>
                }
                data={shedFeedData}
                onRefreshOnChange={onRefreshOnChange}
                refreshing={refreshing}
                onRefresh={onRefresh} 
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}

            />

        </>
    );
}



export default FeedCompositionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    }
});