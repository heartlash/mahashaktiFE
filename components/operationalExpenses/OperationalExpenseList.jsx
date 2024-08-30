import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import OperationalExpenseItem from './OperationalExpenseItem';

const OperationalExpenseList = ({ operationalExpensesData, operationalExpenseItems, listHeaderComponent, onRefreshOnChange, onRefresh, refreshing }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <OperationalExpenseItem
            item={item}
            isExpanded={expandedItemId === item.id}
            onPress={() => handlePress(item.id)}
            editItem={editItem}
            setEditItem={setEditItem}
            onRefreshOnChange={onRefreshOnChange}
            operationalExpenseItems={operationalExpenseItems}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={listHeaderComponent}
            data={operationalExpensesData}
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

export default OperationalExpenseList;
