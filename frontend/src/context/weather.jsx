import { createContext, useContext, useState } from "react";

const WeatherContext = createContext(null);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within WeatherProvider");
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = "https://api.weatherapi.com/v1/current.json?key=";
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY; 

  const getWeatherDataForCity = async (city) => {
    try {
      const response = await fetch(`${baseURL}${apiKey}&q=${city}&aqi=no`);
      if (!response.ok) throw new Error("City not found");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const getWeatherDataForLocation = async (lat, lon) => {
    try {
      const response = await fetch(`${baseURL}${apiKey}&q=${lat},${lon}&aqi=no`);
      if (!response.ok) throw new Error("Location not found");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const fetchData = async () => {
    if (!searchCity.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getWeatherDataForCity(searchCity);
      setData(response);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserLocationData = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherDataForLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          setData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  // Add this alongside getWeatherDataForCity and getWeatherDataForLocation

const getWeatherForecastForCity = async (city) => {
  try {
    const forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&hour=12&aqi=no`;
    const response = await fetch(forecastURL);
    if (!response.ok) throw new Error("City not found");
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};


  return (
    <WeatherContext.Provider
      value={{
        searchCity,
        data,
        loading,
        error,
        setSearchCity,
        fetchData,
        fetchCurrentUserLocationData,
        getWeatherForecastForCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};