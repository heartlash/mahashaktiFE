import React, { useRef, useState, useEffect } from "react";
import { FlatList, View, Dimensions, ImageBackground, Text } from "react-native";

const StockCarousel = () => {
  const flatlistRef = useRef();
  // Get Dimensions
  const screenHeight = Dimensions.get("window").height;
  const itemHeight = screenHeight / 4; // Each item takes 25% of the screen height
  const [activeIndex, setActiveIndex] = useState(0);

  // Data for carousel
  const carouselData = [
    {
      id: "01",
      image: require("../../assets/images/thumbnail.png"),
    },
    {
      id: "02",
      image: require("../../assets/images/logo.png"),
    },
    {
      id: "03",
      image: require("../../assets/images/profile.png"),
    },
    {
      id: "04",
      image: require("../../assets/images/logo.png"),
    }
  ];

  // Auto Scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % carouselData.length;
        flatlistRef.current.scrollToIndex({ index: newIndex, animated: true });
        return newIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getItemLayout = (data, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  const renderItem = ({ item }) => (
    <View style={{ height: itemHeight, width: "100%" }}>
      <ImageBackground
        source={item.image}
        style={{ height: "100%", width: "100%" }}
        imageStyle={{ borderRadius: 10 }}
      >
        <View className="bg-opacity-70 rounded-2xl px-4 py-2">
          <Text className="text-white text-lg font-bold">Material Stock</Text>
        </View>
      </ImageBackground>
    </View>
  );

  const handleScroll = (event) => {
    // Get the scroll position
    const scrollPosition = event.nativeEvent.contentOffset.y;
    // Calculate the index of the currently visible item
    const index = Math.floor(scrollPosition / itemHeight);
    // Update the index
    setActiveIndex(index);
  };

  return (
    <View className="mx-2" style={{ height: '25%' }}>
      <FlatList
        data={carouselData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        vertical={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default StockCarousel;
