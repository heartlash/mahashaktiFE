import { FlatList } from 'react-native';
import React, { useState } from 'react';
import MaterialPurchaseHistoryItem from './MaterialPurchaseHistoryItem';

const MaterialPurchaseHistoryList = ({ materialPurchaseHistoryData, setMaterialPurchaseHistoryData }) => {
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
            setMaterialPurchaseHistoryData={setMaterialPurchaseHistoryData}
        />
    );

    return (
        <FlatList
            data={materialPurchaseHistoryData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={expandedItemId}
        />
    );
};

export default MaterialPurchaseHistoryList;
