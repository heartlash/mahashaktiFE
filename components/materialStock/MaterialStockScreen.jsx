import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'expo-router';
import { getMaterialStock } from '@/lib/materialStock';
import MaterialStockList from './MaterialStockList';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import CustomModal from '../CustomModal';


const MaterialStockScreen = () => {

    const [materialStockData, setMaterialStockData] = useState([])
    const [activeFilter, setActiveFilter] = useState('ALL');
    const router = useRouter();


    const [loading, setLoading] = useState(true)
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    const [refresh, setRefresh] = useState(false);

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMaterialStock().then(() => setRefreshing(false));
    }, []);

    const fetchMaterialStock = async () => {
        const result = await getMaterialStock();
        if (result.errorMessage == null) {
            setMaterialStockData(result.data);
            for (var data of result.data) {
                if (parseFloat(data.expectedDailyConsumption) == 0)
                    data.stockStatus = "NOT_IN_USE"
                else if (parseInt(data.wouldLastFor) == 0)
                    data.stockStatus = "OUT_OF_STOCK"

                else if (parseFloat(data.minQuantity) > parseFloat(data.quantity))
                    data.stockStatus = "LOW_STOCK"

            }

            setLoading(false);
        } else {
            setLoading(true);
        }
    };

    const getFilteredMaterialData = () => {
        if (activeFilter == 'ALL') return materialStockData;
        return materialStockData.filter((item) => item.stockStatus === activeFilter);
    };


    useEffect(() => {
        fetchMaterialStock();
    }, [refresh]);

    if (loading) {
        return <AnimatedActivityIndicator />
    }

    const filteredData = getFilteredMaterialData();

    return (
        <>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
            <MaterialStockList
                listHeaderComponent=
                {materialStockData.length > 0 ? (<>
                    <View style={styles.container}
                        className="p-10 justify-center items-center mb-4"
                    >
                        <TouchableOpacity
                            onPress={() => setActiveFilter('ALL')}
                            className={`px-2 py-1 rounded-lg ${
                                activeFilter === 'ALL' ? 'bg-amber-200' : ''
                            } shadow-md`}                        >
                            <Text className="text-xl font-bold text-black">Total Materials: {materialStockData.length}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveFilter('NOT_IN_USE')}
                            className={`px-2 py-1 rounded-lg ${
                                activeFilter === 'NOT_IN_USE' ? 'bg-amber-200' : ''
                            } shadow-md`}                                >
                            <Text className="text-lg text-black">Not In Use: {materialStockData.filter((item) => item.stockStatus === 'NOT_IN_USE').length}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveFilter('OUT_OF_STOCK')}
                            className={`px-2 py-1 rounded-lg ${
                                activeFilter === 'OUT_OF_STOCK' ? 'bg-amber-200' : ''
                            } shadow-md`}                                >
                            <Text className="text-lg text-black">Out of Stock: {materialStockData.filter((item) => item.stockStatus === 'OUT_OF_STOCK').length}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveFilter('LOW_STOCK')}
                            className={`px-2 py-1 rounded-lg ${
                                activeFilter === 'LOW_STOCK' ? 'bg-amber-200' : ''
                            } shadow-md`}                                >
                            <Text className="text-lg text-black">Low Stock: {materialStockData.filter((item) => item.stockStatus === 'LOW_STOCK').length}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 justify-center items-center">
                        <TouchableOpacity
                            className="bg-yellow-200 p-2 rounded-md mb-4"
                            onPress={() => router.push('/material/feedComposition')}
                        >
                            <Text className="text-black">Feed Composition</Text>
                        </TouchableOpacity>
                    </View></>
                ) : (<></>)}

                materialStockData={filteredData.sort((a, b) => a.material.localeCompare(b.material))}
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



export default MaterialStockScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    }
});