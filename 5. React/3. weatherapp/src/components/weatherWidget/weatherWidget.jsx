import "./weatherWidget.css";

const WeatherCard = ({ weatherData }) => {
  return (
    <div className="card">
      city name: {weatherData?.name}
      <br />
      country: {weatherData?.sys?.country}
      <br />
      <div className="temp">{weatherData?.main?.temp}°C</div>
      <br />
      humidity: {weatherData?.main?.humidity}
      <br />
      wind speed: {weatherData?.wind?.speed}
      <br />
      weather: {weatherData?.weather[0]?.description}
    </div>
  );
};

export default WeatherCard;
