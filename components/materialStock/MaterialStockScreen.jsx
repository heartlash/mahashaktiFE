import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { getMaterialStock } from '@/lib/materialStock';
import MaterialStockList from './MaterialStockList';



const MaterialStockScreen = () => {

    const [materialStockData, setMaterialStockData] = useState([])
    const [outOfStock, setOutOfStock] = useState(0)
    const [toBeOutOfStock, setToBeOutOfStock] = useState(0)


    const [loading, setLoading] = useState(true)

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
            var count = 0;
            var count1 = 0;
            for (var data of result.data) {
                if (parseInt(data.wouldLastFor) == 0) {
                    count++;
                }
                else if (parseFloat(data.minQuantity) > parseFloat(data.quantity)) {
                    count1++;
                }
            }
            setOutOfStock(count)
            setToBeOutOfStock(count1)
            setLoading(false);
        } else {
            setLoading(true);
        }
    };



    useEffect(() => {
        fetchMaterialStock();
    }, [refresh]);


    return (
        <MaterialStockList
            listHeaderComponent=
            {materialStockData.length > 0 ? (
                <View
                    className="bg-white-50 p-10 justify-center items-center mb-4"
                >
                    <Text className="text-xl font-bold text-black">Total Materials: {materialStockData.length}</Text>
                    <Text className="text-lg text-black mt-2">Out of Stock: {outOfStock}</Text>
                    <Text className="text-lg text-black mt-2">Low Stock: {toBeOutOfStock}</Text>
                </View>) : (<></>)}

            materialStockData={materialStockData.sort((a, b) => a.material.localeCompare(b.material))}
            onRefreshOnChange={onRefreshOnChange}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    );
}



export default MaterialStockScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0d0d0d',
    },
    text: {
      color: 'white',
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Roboto-Regular',
    },
  });