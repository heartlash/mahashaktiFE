import { FlatList, View, Text } from 'react-native';
import React, { useState } from 'react';
import SaleItem from './SaleItem';
import { groupSalesByDate } from '@/lib/sale';

const SaleList = ({ saleData, setSaleData }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const groupedSales = groupSalesByDate(saleData);
  
    const handlePress = (itemId) => {
      setExpandedItemId(itemId === expandedItemId ? null : itemId);
    };
  
    return (
      <FlatList
        data={Object.keys(groupedSales)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View>
            <Text className="text-xl font-bold mt-4">{date}</Text>
            {groupedSales[date].map((sale) => (
              <SaleItem
                key={sale.id}
                item={sale}
                isExpanded={sale.id === expandedItemId}
                onPress={() => handlePress(sale.id)}
                editItem={editItem}
                setEditItem={setEditItem}
                setSaleData={setSaleData}
              />
            ))}
          </View>
        )}
      />
    );
  };
  
  export default SaleList;
