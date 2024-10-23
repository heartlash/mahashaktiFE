import { View, Text, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getWeatherData } from '@/lib/weather';

const weatherImageBg = {
    Snow: require("../../assets/images/Snow.png"),
    Drizzle: require("../../assets/images/Drizzle.png"),
    Clouds: require("../../assets/images/Clouds.png"),
    Rain: require("../../assets/images/Rain.png"),
    Clear: require("../../assets/images/Clear.png"),
    Thunderstorm: require("../../assets/images/Thunderstorm.png"),
}
/*
    date: day,
            minTemp: daily.temp.min,
            maxTemp: daily.temp.max,
            currentTemp: currentTemp,
            humidity: daily.humidity,
            summary: daily.summary,
            wind: daily.wind_speed,
            mood: daily.weather[0].main
  */


const WeatherGrid = ({refreshTrigger}) => {
  const [index, setIndex] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % 6);
    }, 3000);

    const loadWeatherData = async () => {
      var weatherData = await getWeatherData();
      if (weatherData) {
        setWeatherData(weatherData);
        setLoading(false);
      }
    };
    loadWeatherData();
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-none pb-2" style={{ height: '15%' }}>
      <FlatList
        data={weatherData.slice(index, index + 1)}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="rounded-3xl flex-none px-2"
            activeOpacity={0.7}
            style={{ width: screenWidth }}
          >
            <ImageBackground
              source={weatherImageBg[item.mood]}
              style={{ height: "100%", width: "100%" }}
              imageStyle={{ borderRadius: 10 }}
            >
              <View className="flex-none h-full flex-row">
                <View className="basis-2/3 pl-3">
                  <Text className="text-left font-bold text-white text-xl pt-2">{item.date}</Text>
                  <Text className="text-left font-psemibold text-white">{item.summary}</Text>
                </View>
                <View className="basis-1/3 pr-3">
                  <Text className="text-white font-bold text-right pt-2">{item.currentTemp}</Text>
                  <Text className="text-white font-bold text-right">Min {item.minTemp}</Text>
                  <Text className="text-white font-bold text-right">Max {item.maxTemp}</Text>
                  <Text className="text-white font-bold text-right">Humidity {item.humidity}</Text>
                  <Text className="text-white font-bold text-right">Wind {item.wind}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WeatherGrid;