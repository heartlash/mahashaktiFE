import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import MaterialStockItem from './MaterialStockItem'

const MaterialStockList = ({ materialStockData, listHeaderComponent, onRefreshOnChange, onRefresh, refreshing }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <MaterialStockItem
            item={item}
            isExpanded={expandedItemId === item.id}
            onPress={() => handlePress(item.id)}
            onRefreshOnChange={onRefreshOnChange}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={listHeaderComponent}
            data={materialStockData}
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

export default MaterialStockList;
