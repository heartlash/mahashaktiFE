import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import PriceRecommendationDataItem from './PriceRecommendationDataItem';

const PriceRecommendationDataList = ({ data, listHeaderComponent, listFooterComponent, onRefresh, refreshing }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);

    const renderItem = ({ item }) => (
        <PriceRecommendationDataItem
            item={item}
            isExpanded={expandedItemId === item.id}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={listHeaderComponent}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.region.toString()}
            extraData={expandedItemId}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing} // Make sure refreshing is set correctly
                    onRefresh={onRefresh}   // Trigger refresh when pulled down
                />
            }
            ListFooterComponent={listFooterComponent}
        />

    );
};

export default PriceRecommendationDataList;
