import { useState, useRef, useEffect } from "react";
import axios from "axios";
import WeatherCard from "../weatherWidget/weatherWidget";

const Home = () => {
  // not recommended
  // const [cityName, setCityName] = useState("");

  const [weatherData, setWeatherData] = useState([]);
  const cityNameRef = useRef(null);

  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    
    const controller = new AbortController();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (location) => {
        console.log("location: ", location);

        try {
          let API_KEY = "e0f99c494c2ce394a18cc2fd3f100543";
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&units=metric`,
            {
              signal: controller.signal,
            }
          );
          console.log(response.data);

          setCurrentLocationWeather(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error.data);
          setIsLoading(false);
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    return () => {
      // cleanup function
      controller.abort();
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("cityName: ", cityNameRef.current.value);

    let API_KEY = "e0f99c494c2ce394a18cc2fd3f100543";
    try {
      setIsLoading(true);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityNameRef.current.value}&appid=${API_KEY}&units=metric`
      );

      console.log(response.data);
      setWeatherData([response.data, ...weatherData]);
      setIsLoading(false);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="cityNameInput"> City Name:</label>
        <input
          id="cityNameInput"
          type="text"
          required
          minLength={2}
          maxLength={20}
          //   onChange={(e) => setCityName(e.target.value)}
          ref={cityNameRef}
        />
        <br />
        <button type="submit">Get Weather</button>
      </form>

      <hr />

      {isLoading ? <div>Loading...</div> : null}

      {weatherData.length || currentLocationWeather || isLoading ? null : <div>No Data</div>}

      {weatherData.map((eachWeatherData, index) => {
        return <WeatherCard key={index} weatherData={eachWeatherData} />;
      })}

      {currentLocationWeather ? <WeatherCard weatherData={currentLocationWeather} /> : null}
    </div>
  );
};

export default Home;
