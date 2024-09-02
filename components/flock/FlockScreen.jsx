import { View, Text, StyleSheet, RefreshControl, Animated, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { getFlockCount, getFlockChange, saveFlockChange, updateFlockChange, deleteFlockChange } from '@/lib/flock';
import FLockChangePaginatedList from './FlockChangePaginatedList';
import CreateFlockChange from './CreateFlockChange';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';



const FlockScreen = () => {

    const navigation = useNavigation()
    const [flockCount, setFlockCount] = useState(0)
    const [flockChangeData, setFlockChangeData] = useState([])
    const [showFlockChangeHistory, setShowFlockChangeHistory] = useState(false)
    const [createNewFlockChange, setCreateNewFlockChange] = useState(false)

    const [loading, setLoading] = useState(true)

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFlockData().then(() => setRefreshing(false));
    }, []);

    const scrollY = useRef(new Animated.Value(0)).current;

    // Interpolating the scroll position to adjust height and opacity
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [200, 0],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const fetchFlockData = async () => {
        const count = await getFlockCount();
        if (count != null) {
            setFlockCount(count);
            setLoading(false);
        } else {
            setLoading(true);
        }

        const resultFlockChange = await getFlockChange();
        if (resultFlockChange.errorMessage == null) {
            setFlockChangeData(resultFlockChange.data);
            setLoading(false);
        } else {
            setLoading(true);
        }
    };

    useEffect(() => {
        fetchFlockData();
    }, []);


    return (
        <FLockChangePaginatedList
            listHeaderComponent={<>
              <View className="mx-2 my-1">
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.container} className="p-10 justify-center items-center mb-4">
                    <Text className="text-xl font-bold text-black">Total Flock: {flockCount} </Text>
                </View>

                {createNewFlockChange ? (
                    <CreateFlockChange
                        onClose={() => setCreateNewFlockChange(false)}
                    />
                ) : (<View className="mb-3">
                    <Ionicons name="add-circle" className="mb-3" size={45} style={{ alignSelf: 'center' }} color="black" onPress={() => setCreateNewFlockChange(true)} />
                </View>
                )}
            </>
            }
            data={flockChangeData.sort((a, b) => a.date.localeCompare(b.date))}
            onClose={() => setShowFlockChangeHistory(false)} setFlockChangeData={setFlockChangeData} scrollY={scrollY}
        />
    );
}



export default FlockScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    }
});