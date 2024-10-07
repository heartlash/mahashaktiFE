import axios from "axios";
import { convertTimestampToReadableDate } from "./util";


  
export const getWeatherData = async() => {
    

    var weatherDataList = [];
    var weatherData  = {
        date: "",
        minTemp: "",
        currentTemp: "",
        maxTemp: "",
        humidity: "",
        summary: "",
        wind: "",
        mood: ""
    }
    try {
    const response = await axios.get("https://api.openweathermap.org/data/3.0/onecall?lat=26.6572726&lon=91.91236640000001&exclude=hourly,minutely,alerts&appid=d60be069eaf8b5112a449607a02fd559"); 
    
    var index = 0;
    var currentTemp = null;
    var day = null;
    var mood = null;
    for(var daily of response.data.daily) {
        
        if(index == 0) {
            currentTemp = (response.data.current.temp/10).toFixed(1);
            day = "Today"
            mood = response.data.current.weather[0].main;
        } else {
            currentTemp = null;
            day = convertTimestampToReadableDate(daily.dt)
            mood = daily.weather[0].main
        }
        weatherDataList.push({
            id: index,
            date: day,
            minTemp: (daily.temp.min/10).toFixed(1),
            maxTemp: (daily.temp.max/10).toFixed(1),
            currentTemp: currentTemp,
            humidity: daily.humidity,
            summary: daily.summary,
            wind: daily.wind_speed,
            mood: mood
        })
        index++;
    }

    return weatherDataList;
    } catch(error) {
        console.log(error);
        return null;
    }


}