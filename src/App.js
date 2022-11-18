import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';    
import {clear, cloudy, fog, freezing, rain, thunderstorm, snow} from "./assets/index";
import { WiDaySunny, WiCloud, WiFog, WiSnowflakeCold, WiRaindrops, WiThunderstorm, WiSnow } from "react-icons/wi";
import { BsSearch, BsMenuButtonWide, BsArrowReturnLeft} from "react-icons/bs";
import { LazyLoadComponent  } from 'react-lazy-load-image-component';


// axios to fetch cordinantes based on city using geocoding api
// axios to fetch weather based on city using open meteo api  
// lazy load component to handle lazy loading

function App() {

  function handleCityChange(event) {
    const {name, value} = event.target;
    setTempCity(value);
  }

  const [city, setCity] = useState("Tbilisi");
  const [tempCity, setTempCity] = useState();
  const [weather, setWeather] = useState();
  const [image, setImage] = useState(clear);
  const [icon, setIcon] = useState(<WiCloud />);
  const [zip, setZip] = useState([]);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.title = 'the.weather | Weather Forecast';
    getCordinates(city, setWeather, setImage, setIcon);
  }, [city]);


  useEffect(() => {
    if(weather !== undefined) {
      let zipped = weather.hourly.time.map((x, i) => [x, weather.hourly.temperature_2m[i]]);
      setZip(zipped);
    }
  }, [weather])

  console.log(menu);


  return (
    <LazyLoadComponent>
      <div className="App" style={{ background: `url(${image}) no-repeat center center/cover`}}>
        <div className='current-weather'>
          <h1>the.weather</h1>
          {
            weather !== undefined &&         
            <div className='data'>
              <h2 className='current-temp'>{weather.current_weather.temperature.toFixed(0)}°</h2>
              <div className='current-location'>
                <h2 className='city'>{city}</h2>
                <h3 className='time'>{outputTime(weather.current_weather.time)}</h3>
              </div>
              <div className='current-weather-data'>
                {icon}
                <h3 className='weatherType'>{weatherCode(weather.current_weather.weathercode)}</h3>
              </div>
            </div>
          }
        </div>
        {
          weather !== undefined &&
          <div className='weather-div'>
            <div className='change-city'> 
              <input className="city-input" type="text" name="top" placeholder='Another Location' value={tempCity} onChange={handleCityChange}/>
              <div className='search' onClick={() => setCity(tempCity)}>
                <BsSearch />
              </div>
            </div>
            <div className='default'> 
              <div className='default-cities' onClick={() => setCity("Tbilisi")}>Tbilisi</div>
              <div className='default-cities' onClick={() => setCity("Amsterdam")}>Amsterdam</div>
              <div className='default-cities' onClick={() => setCity("New York")}>New York</div>
              <div className='default-cities' onClick={() => setCity("Tokyo")}>Tokyo</div>
              <div className='default-cities' onClick={() => setCity("Shanghai")}>Shanghai</div>
            </div>
            <hr></hr>
            <div className='weather-details'>
              <h3 className='details-header'>Weather Details</h3>
              <div className='wind-speed detail'>
                <div>Wind</div>
                <h3>{weather.current_weather.windspeed}km/h</h3>
              </div>
              <div className='wind-direction detail'>
                <div>Wind Direction</div>
                <h3>{weather.current_weather.winddirection}°</h3>
              </div>
              <div className='weather-code detail'>
                <div>Weather Code</div>
                <h3>{weather.current_weather.weathercode}</h3>
              </div>
            </div>
            <hr></hr>
            <div className='hourly'>
              <h3 className='details-header'>Hourly Forecast</h3>
                {zip.map((item) => {
                  return (
                    <div className='single-forecast detail'>
                      <div className='time'>{outputTime(item[0])}</div>
                      <div className='forecast'>{item[1]}°</div>
                    </div>
                  )
                })}
            </div>
          </div>
        }
      </div>
      {/* visible only on mobile and tablets */}
      {
        !menu && 
          <div className='menu' onClick={() => setMenu(!menu)}> 
            <BsMenuButtonWide />
          </div>
      }
      {menu && weather !== undefined && 
        <div className='overlay'>
            <div className='change-city'> 
              <input className="city-input" type="text" name="top" placeholder='Another Location' value={tempCity} onChange={handleCityChange}/>
              <div className='search' onClick={() => setCity(tempCity)}>
                <BsSearch />
              </div>
            </div>
            <div className='default'> 
              <div className='default-cities' onClick={() => setCity("Tbilisi")}>Tbilisi</div>
              <div className='default-cities' onClick={() => setCity("Amsterdam")}>Amsterdam</div>
              <div className='default-cities' onClick={() => setCity("New York")}>New York</div>
              <div className='default-cities' onClick={() => setCity("Tokyo")}>Tokyo</div>
              <div className='default-cities' onClick={() => setCity("Shanghai")}>Shanghai</div>
            </div>
            <hr></hr>
            <div className='weather-details'>
              <h3 className='details-header'>Weather Details</h3>
              <div className='wind-speed detail'>
                <div>Wind</div>
                <h3>{weather.current_weather.windspeed}km/h</h3>
              </div>
              <div className='wind-direction detail'>
                <div>Wind Direction</div>
                <h3>{weather.current_weather.winddirection}°</h3>
              </div>
              <div className='weather-code detail'>
                <div>Weather Code</div>
                <h3>{weather.current_weather.weathercode}</h3>
              </div>
            </div>
            <hr></hr>
            <div className='hourly'>
              <h3 className='details-header'>Hourly Forecast</h3>
                {zip.map((item) => {
                  return (
                    <div className='single-forecast detail'>
                      <div className='time'>{outputTime(item[0])}</div>
                      <div className='forecast'>{item[1]}°</div>
                    </div>
                  )
                })}
            </div>
            <div className='menu-overlay' onClick={() => setMenu(!menu)}> 
              <BsArrowReturnLeft />
            </div>
        </div>
      }
    </LazyLoadComponent>
  );
}

// gets cordinants using api from the city name
function getCordinates(city, setWeather, setImage, setIcon) {
  axios.get(`https://api.myptv.com/geocoding/v1/locations/by-text?searchText=%20${city}%20&apiKey=RVVfZmViODk5MDdjMjcwNGUwM2E5NzcyYWE1MTY2ZmY1MTU6MGRhMGNiNzAtNTgyOC00ODcwLWIwZDQtODU4MDM4NzMwZjhl`).then((response) => {
    const cordinantes = response.data.locations[0].referencePosition;
    getWeather(cordinantes, setWeather, setImage, setIcon);
  })
}

// gets weather while setting weather state and changing image
function getWeather(cordinantes, setWeather, setImage, setIcon) {
  axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cordinantes.latitude}&longitude=${cordinantes.longitude}&hourly=temperature_2m,relativehumidity_2m,rain,showers,snowfall,visibility,windspeed_10m&current_weather=true&timezone=auto`).then((response) => {
    setWeather(response.data);
    changeImage(setImage, weatherCode(response.data.current_weather.weathercode), setIcon);
  })
}

function outputTime(string) {
  let split = string.split("T");
  const first = split[0];
  const second = split[1];
  const newString = first + " " + second;
  return newString;
}

// sets weather state based on the code provided by API
function weatherCode(code) {
  let weatherType;
  switch (code) {
    case 0:
      weatherType = "Clear sky";
      break;
    case 1: 
    case 2: 
    case 3:
      weatherType = "Cloudy";
      break;
    case 45:
    case 48:
      weatherType = "Fog";
      break;
    case 56:
    case 57:
      weatherType = "Freezing";
      break;
    case 61: 
    case 63: 
    case 65: 
    case 66:
    case 67:
    case 80: 
    case 81: 
    case 82:
    case 51:
    case 53:
    case 55:
      weatherType = "Rain";
      break;
    case 95: 
    case 96:
    case 99:
      weatherType = "ThunderStorm";
      break;
    case 71: 
    case 73: 
    case 75: 
    case 77:
    case 85:
    case 86:
      weatherType = "Snow";
  }
  return weatherType;
}


// changes image based on the weather
function changeImage(setImage, weather, setIcon) {
  let image;
  let icon;
  switch(weather) {
    case "Clear sky":
      image = clear;
      icon = <WiDaySunny />;
      break;
    case "Cloudy":
      image = cloudy;
      icon = <WiCloud />;
      break;
    case "Fog":
      image = fog;
      icon = <WiFog />;
      break;
    case "Freezing":
      image = freezing;
      icon = <WiSnowflakeCold />;
      break;
    case "Rain":
      image = rain;
      icon = <WiRaindrops />;
      break;
    case "ThunderStorm":
      image = thunderstorm;
      icon = <WiThunderstorm />;
      break;
    case "Snow":
      image = snow;
      icon = <WiSnow />;
  }
  setImage(image);
  setIcon(icon);
}


export default App;
