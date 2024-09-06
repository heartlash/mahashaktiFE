import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import MaterialPurchaseHistoryItem from './MaterialPurchaseHistoryItem';

const MaterialPurchaseHistoryList = ({ materialPurchaseHistoryData, onRefreshOnChange, onRefresh, refreshing, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <MaterialPurchaseHistoryItem
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
            data={materialPurchaseHistoryData.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate))}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={expandedItemId}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing} // Make sure refreshing is set correctly
                    onRefresh={onRefresh}   // Trigger refresh when pulled down
                />
            }
        />
    );
};

export default MaterialPurchaseHistoryList;
