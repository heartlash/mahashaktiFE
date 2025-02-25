import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../CustomModal';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import EggTypeList from './EggTypeList';
import { getEggCount } from '@/lib/egg';

const EggScreen = () => {

    const navigation = useNavigation()
    const [eggCount, setEggCount] = useState([])

    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEggCount().then(() => setRefreshing(false));
    }, []);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const fetchEggCount = async () => {
        const result = await getEggCount();
        if (result.errorMessage == null) {
            const formattedEggCount = Object.entries(result.data).map((entry, index) => {
                return { id: index + 1, name: entry[0], count: entry[1] };
            });
            setEggCount(formattedEggCount)
            setLoading(false);
        } else {
            setEggCount(null)
            setLoading(true);
        }

    }


    useEffect(() => {
        fetchEggCount();
    }, [])

    useEffect(() => {
        fetchEggCount();
    }, [refresh])

    if (loading) {
        return <AnimatedActivityIndicator />
    }

    return (
        <>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
            <EggTypeList
                listHeaderComponent={
                    <View className="flex-row items-center mx-2 my-1 mb-10">
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                        <View className="flex-1 items-center">
                            <Text className="text-lg font-bold mr-2">Egg Stock</Text>
                        </View>
                    </View>
                }
                data={eggCount}
                isStock={true}
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



export default EggScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    }
});