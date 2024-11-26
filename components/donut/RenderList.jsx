import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import RenderItem from './RenderItem';

const RenderList = ({ listHeaderComponent, data, goTo, refreshing, onRefresh }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItemId, setEditItemId] = useState(null); // Use id instead of the entire object

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item, index }) => (
        <RenderItem
            item={item}
            key={index}
            index={index}
            goTo={goTo}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={listHeaderComponent}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.name.toString()}
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

export default RenderList;
