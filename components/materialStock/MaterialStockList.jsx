import { FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialStockItem from './MaterialStockItem'
import { checkAllowedToExpand } from '@/lib/auth';

const MaterialStockList = ({ materialStockData, listHeaderComponent, onRefreshOnChange, onRefresh, refreshing, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {
    
    const [expandedItemId, setExpandedItemId] = useState(null);

    const [allowedToExpand, setAllowedToExpand] = useState(false);

    useEffect(() => {
        const fetchAllowedToExpand = async () => {
            const result = await checkAllowedToExpand();
            setAllowedToExpand(result);
        };

        fetchAllowedToExpand();
    }, []); // Empty array means it runs only on mount

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <MaterialStockItem
            item={item}
            isExpanded={expandedItemId === item.id && allowedToExpand}
            onPress={() => handlePress(item.id)}
            onRefreshOnChange={onRefreshOnChange}
            setSuccessModalVisible={setSuccessModalVisible}
            setFailureModalVisible={setFailureModalVisible}
            setSubmitModalVisible={setSubmitModalVisible}
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
