import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { getMaterialStock } from '@/lib/materialStock';
import MaterialStockList from './MaterialStockList';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import CustomModal from '../CustomModal';


const MaterialStockScreen = () => {

    const [materialStockData, setMaterialStockData] = useState([])
    const [outOfStock, setOutOfStock] = useState(0)
    const [lowStock, setLowStock] = useState(0)
    const [notInUse, setNotInUse] = useState(0)



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
            var countNotInUse = 0;
            var countOutOfStock = 0;
            var countLowStock = 0;
            for (var data of result.data) {
                if(parseFloat(data.expectedDailyConsumption) == 0)
                    countNotInUse++;
                else if (parseInt(data.wouldLastFor) == 0)
                    countOutOfStock++;
                
                else if (parseFloat(data.minQuantity) > parseFloat(data.quantity))
                    countLowStock++;
            
            }
            setOutOfStock(countOutOfStock)
            setLowStock(countLowStock)
            setNotInUse(countNotInUse)

            setLoading(false);
        } else {
            setLoading(true);
        }
    };



    useEffect(() => {
        fetchMaterialStock();
    }, [refresh]);

    if (loading) {
        return <AnimatedActivityIndicator />
    }

    return (
        <>
            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />
            <MaterialStockList
                listHeaderComponent=
                {materialStockData.length > 0 ? (
                    <View style={styles.container}
                        className="p-10 justify-center items-center mb-4"
                    >
                        <Text className="text-xl font-bold text-black">Total Materials: {materialStockData.length}</Text>
                        <Text className="text-lg text-black mt-2">Not In Use: {notInUse}</Text>
                        <Text className="text-lg text-black mt-2">Out of Stock: {outOfStock}</Text>
                        <Text className="text-lg text-black mt-2">Low Stock: {lowStock}</Text>
                    </View>) : (<></>)}

                materialStockData={materialStockData.sort((a, b) => a.material.localeCompare(b.material))}
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