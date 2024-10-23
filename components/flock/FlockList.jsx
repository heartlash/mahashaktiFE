import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import FlockItem from './FlockItem';

const FlockList = ({ data, listHeaderComponent, onRefreshOnChange, onRefresh, refreshing, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);

    const handlePress = (itemId) => {
        setEditItem(editItem != null ? null : editItem)
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <FlockItem
            item={item}
            isExpanded={expandedItemId === item.id}
            onPress={() => handlePress(item.id)}
            editItem={editItem}
            setEditItem={setEditItem}
            onRefreshOnChange={onRefreshOnChange}
            setSuccessModalVisible={setSuccessModalVisible}
            setFailureModalVisible={setFailureModalVisible}
            setSubmitModalVisible={setSubmitModalVisible}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={listHeaderComponent}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={expandedItemId}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing} // Make sure refreshing is set correctly
                    onRefresh={onRefresh}   // Trigger refresh when pulled down
                />
            } />
    );
};

export default FlockList;
