import React, { useRef, useState, useEffect } from "react";
import { FlatList, View, Dimensions, ImageBackground, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { getMaterialStock } from "@/lib/materialStock";
import { router } from 'expo-router';


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
  }, [refreshTrigger]); // Empty dependency array to run this effect only once on mount

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
    <View style={{ width: itemWidth, height: "100%" }}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" className="pt-5" />
      ) : (
        <TouchableOpacity onPress={() => router.push('/materialstock')}>
          <ImageBackground
            source={item.image}
            style={{ height: "100%", width: "100%" }}
            imageStyle={{ borderRadius: 10 }}
          >
            <View className="flex-none h-full flex-row">
              <View className="basis-1/2 pl-3">
                <Text className="text-left font-bold text-black text-xl pt-3 pb-2">{item.material}</Text>
                <Text className="text-left font-psemibold text-black">Stock</Text>
              </View>
              <View className="basis-1/2 pr-3">
                <Text className="text-black text-xl font-bold text-right pt-3 pb-2">{item.quantity} {item.unit}</Text>
                <Text className="text-black font-bold text-right">10 Days</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}
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

  return (
    <View className="mx-2" style={{ height: '25%', width: '100%' }}>
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

