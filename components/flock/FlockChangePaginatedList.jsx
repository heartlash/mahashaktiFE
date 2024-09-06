import React, { useState } from 'react';
import { View, FlatList, Button, Text, Animated, RefreshControl } from 'react-native';
import FlockItem from './FlockItem';

const FLockChangePaginatedList = ({ listHeaderComponent, data, setFlockChangeData, scrollY, onRefreshOnChange, refreshing
    , onRefresh, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };
    // Calculate total pages
    const totalPages = Math.ceil(data.length / pageSize);

    // Get current page data
    const currentPageData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const renderItem = ({ item }) => (
        <FlockItem
            item={item}
            isExpanded={expandedItemId === item.id}
            onPress={() => handlePress(item.id)}
            editItem={editItem}
            setEditItem={setEditItem}
            onRefreshOnChange={onRefreshOnChange}
            setFlockChangeData={setFlockChangeData}
            setSuccessModalVisible={setSuccessModalVisible}
            setFailureModalVisible={setFailureModalVisible}
            setSubmitModalVisible={setSubmitModalVisible}
        />
    );



    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={listHeaderComponent}
                data={currentPageData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16} // To ensure smooth scrolling
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Make sure refreshing is set correctly
                        onRefresh={onRefresh}   // Trigger refresh when pulled down
                    />
                } />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                    title="Previous"
                    onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />
                <Text>{`${currentPage} / ${totalPages}`}</Text>
                <Button
                    title="Next"
                    onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </View>
        </View>
    );
};

export default FLockChangePaginatedList;
