import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import PriceRecommendationDataItem from './PriceRecommendationDataItem';

const PriceRecommendationDataList = ({ data, listHeaderComponent, listFooterComponent, onRefresh, refreshing }) => {

    const renderItem = ({ item }) => (
        <PriceRecommendationDataItem
            item={item}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={listHeaderComponent}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.region.toString()}
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
