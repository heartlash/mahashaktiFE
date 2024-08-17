import { FlatList } from 'react-native';
import React, { useState } from 'react';
import MaterialConsumptionHistoryItem from './MaterialConsumptionHistoryItem';

const MaterialConsumptionHistoryList = ({ materialConsumptionHistoryData, setMaterialConsumptionHistoryData }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <MaterialConsumptionHistoryItem
            item={item}
            isExpanded={expandedItemId === item.id}
            onPress={() => handlePress(item.id)}
            editItem={editItem}
            setEditItem={setEditItem}
            setMaterialConsumptionHistoryData={setMaterialConsumptionHistoryData}
        />
    );

    return (
        <FlatList
            data={materialConsumptionHistoryData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={expandedItemId}
        />
    );
};

export default MaterialConsumptionHistoryList;
