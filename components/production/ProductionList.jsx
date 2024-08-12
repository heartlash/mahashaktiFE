import { FlatList } from 'react-native';
import React, { useState } from 'react';
import ProductionItem from '@/components/production/ProductionItem';

const ProductionList = ({ productionData, setProductionData }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);

    const handlePress = (itemId) => {
        setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
    };

    const renderItem = ({ item }) => (
        <ProductionItem
            item={item}
            isExpanded={expandedItemId === item.id}
            onPress={() => handlePress(item.id)}
            editItem={editItem}
            setEditItem={setEditItem}
            setProductionData={setProductionData}
        />
    );

    return (
        <FlatList
            data={productionData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={expandedItemId}
        />
    );
};

export default ProductionList;
