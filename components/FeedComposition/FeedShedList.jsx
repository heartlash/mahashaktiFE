import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import FeedShedItem from './FeedShedItem';

const FeedShedList = ({ data, listHeaderComponent, onRefreshOnChange, onRefresh, refreshing, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItemId, setEditItemId] = useState(null); // Use id instead of the entire object

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <FeedShedItem
            item={item}
            isExpanded={expandedItemId === item.id}
            isEditing={editItemId === item.id}
            onPress={() => handlePress(item.id)}
            setEditItemId={setEditItemId}
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
            }
        />

    );
};

export default FeedShedList;
