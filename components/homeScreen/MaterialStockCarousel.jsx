import React, { useRef, useState, useEffect } from "react";
import { FlatList, View, Dimensions, ImageBackground, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { getMaterialStock } from "@/lib/materialStock";
import { router } from 'expo-router';
import { getUserInfo } from "@/lib/auth";

const MaterialStockCarousel = ({ refreshTrigger }) => {
  const flatlistRef = useRef();
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth; // Each item takes the full screen width
  const [activeIndex, setActiveIndex] = useState(0);
  const [materialStockData, setMaterialStockData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMaterialStock = async () => {
      const result = await getMaterialStock();
      if (result.errorMessage == null) {
        setMaterialStockData(result.data);
        setLoading(false);
      } else {
        setLoading(true);
      }
    };

    fetchMaterialStock();
  }, [refreshTrigger]);

  useEffect(() => {
    if (!materialStockData || materialStockData.length === 0) {
      return; // Exit the useEffect if materialStockData is empty or null
    }
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % materialStockData.length;
        flatlistRef.current.scrollToIndex({ index: newIndex, animated: true });
        return newIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [materialStockData, refreshTrigger]);

  const getItemLayout = (data, index) => ({
    length: itemWidth,
    offset: itemWidth * index,
    index,
  });

  const renderItem = ({ item }) => (
    <View style={{ width: itemWidth, height: "100%" }} className="px-2">

      <TouchableOpacity onPress={() => router.push('/material')} className="bg-cyan-200 rounded-3xl">
        <View className="flex-none h-full flex-row">
          <View className="basis-1/2 pl-5">
            <Text className="text-left font-bold text-black text-xl pt-7 pb-3">{item.material}</Text>
            <Text className="text-left font-bold text-black">Stock</Text>
          </View>
          <View className="basis-1/2 pr-5">
            <Text className="text-black text-xl font-bold text-right pt-7 pb-3">{item.quantity} {item.unit}</Text>
            <Text className="text-black font-bold text-right">{item.wouldLastFor} Days</Text>
          </View>
        </View>
      </TouchableOpacity>

    </View>
  );

  const handleScroll = (event) => {
    // Get the scroll position
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Calculate the index of the currently visible item
    const index = Math.floor(scrollPosition / itemWidth);
    // Update the index
    setActiveIndex(index);
  };

  if (loading) {
    return <View className="pt-12"><ActivityIndicator size="small" color="#0000ff" /></View>
  }

  return (
    <View style={{ height: '25%', width: '100%' }}>
      <FlatList
        data={materialStockData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default MaterialStockCarousel;

