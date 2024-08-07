import { View, Text, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getWeatherData } from '@/lib/weather';

const weatherImageBg = {
    Snow: require("../../assets/images/Snow.png"),
    Atmosphere: require("../../assets/images/Atmosphere.png"),
    Drizzle: require("../../assets/images/Drizzle.png"),
    Clouds: require("../../assets/images/Clouds.png"),
    Rain: require("../../assets/images/Rain.png"),
    Clear: require("../../assets/images/Clear.png"),
    Thunderstorm: require("../../assets/images/Thunderstorm.png"),
}



const WeatherGrid = () => {
  const [index, setIndex] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true)
 
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
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % 6);
    }, 3000);



    const loadWeatherData = async() => {
      var weatherData = await getWeatherData();
      console.log("see the weatherData: ", weatherData);
      if(weatherData) {
        setWeatherData(weatherData);
        setLoading(false)
      }
  };
  loadWeatherData();
  return () => clearInterval(interval);

  }, []);

  if (loading) {
    // Show loading component while data is being fetched
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
        numColumns={1}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="mx-1"
        renderItem={({ item }) => {
          return (

          <TouchableOpacity 
            className="bg-secondary rounded-2xl flex-none mx-1"
            activeOpacity={0.7}
          >
             <ImageBackground
                source={weatherImageBg[item.mood]}
                style={{ height: "100%", width: "100%" }}
                imageStyle={{ borderRadius: 10 }}>

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
          )
        }}
      />
    </View>
  );
}

export default WeatherGrid;