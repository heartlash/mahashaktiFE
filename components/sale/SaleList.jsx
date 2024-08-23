import { FlatList, View, Text, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import SaleItem from './SaleItem';
import { groupSalesByDate } from '@/lib/sale';

const SaleList = ({ saleData, setSaleData, listHeaderComponent, vendorData, onRefreshOnChange, onRefresh, refreshing }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const groupedSales = groupSalesByDate(saleData);
  
    const handlePress = (itemId) => {
      setExpandedItemId(itemId === expandedItemId ? null : itemId);
    };
  
    return (
      <FlatList
        ListHeaderComponent={listHeaderComponent}
        data={Object.keys(groupedSales)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View>
                <Text className="text-lg font-bold text-gray-800 mb-2 mx-3">{date}</Text>
            {groupedSales[date].map((sale) => (
              <SaleItem
                key={sale.id}
                item={sale}
                isExpanded={sale.id === expandedItemId}
                onPress={() => handlePress(sale.id)}
                editItem={editItem}
                setEditItem={setEditItem}
                setSaleData={setSaleData}
                vendorData={vendorData}
                onRefreshOnChange={onRefreshOnChange}
              />
            ))}
          </View>
        )}
        refreshControl={
          <RefreshControl
              refreshing={refreshing} // Make sure refreshing is set correctly
              onRefresh={onRefresh}   // Trigger refresh when pulled down
          />
      }
      />
    );
  };
  
  export default SaleList;
