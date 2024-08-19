import { View, Text, FlatList, Dimensions, Button, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { getFlockCount, getFlockChange, saveFlockChange, updateFlockChange, deleteFlockChange } from '@/lib/flock';
import FLockChangePaginatedList from './FlockChangePaginatedList';
import CreateFlockChange from './CreateFlockChange';



const FlockScreen = () => {

    const [flockCount, setFlockCount] = useState(0)
    const [flockChangeData, setFlockChangeData] = useState([])
    const [showFlockChangeHistory, setShowFlockChangeHistory] = useState(false)
    const [createNewFlockChange, setCreateNewFlockChange] = useState(false)

    const [loading, setLoading] = useState(true)


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

    useEffect(() => {
        const fetchFlockData = async () => {
            const count = await getFlockCount();
            if (count != null) {
                setFlockCount(count);
                console.log("value is set: ", flockCount)
                setLoading(false);
            } else {
                setLoading(true);
            }

            const resultFlockChange = await getFlockChange();
            if (resultFlockChange.errorMessage == null) {
                setFlockChangeData(resultFlockChange.data);
                console.log("value is set: ", flockChangeData)
                setLoading(false);
            } else {
                setLoading(true);
            }
        };

        fetchFlockData();
    }, []);


    return (
        <View className="flex-1">
            {/* First View (Animated) */}
            <Animated.View
                style={{
                    height: headerHeight,
                    opacity: headerOpacity,
                    overflow: 'hidden', // Ensure the view collapses correctly
                }}
                className="bg-blue-500 p-4 justify-center items-center"
            >
                <Text className="text-2xl font-bold text-white">Total Flock: {flockCount}</Text>
                <Text className="text-lg text-white mt-2">Total Sales: $12345</Text>
            </Animated.View>


            {createNewFlockChange ? (
                <CreateFlockChange
                    onClose={() => setCreateNewFlockChange(false)}
                />
            ) : (<TouchableOpacity
                onPress={() => setCreateNewFlockChange(true)}
                className="bg-blue-500 p-4 rounded-lg mb-2 center self-start w-auto"
            >
                <Text className="text-white font-bold">Create</Text>
            </TouchableOpacity>
            )}


            <TouchableOpacity
                onPress={() => setShowFlockChangeHistory(!showFlockChangeHistory)}
                className="bg-blue-500 p-4 rounded-lg mb-2"
            >
                <Text className="text-white font-bold">{showFlockChangeHistory ? 'Hide History' : 'Show History'}</Text>
            </TouchableOpacity>

            {showFlockChangeHistory ? (
                <FLockChangePaginatedList data={flockChangeData.sort((a, b) => a.date.localeCompare(b.date))}
                    onClose={() => setShowFlockChangeHistory(false)} setFlockChangeData={setFlockChangeData} scrollY={scrollY}
                />
            ) : (<></>)}
        </View>
    );
}



export default FlockScreen