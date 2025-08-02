function WeatherInfo({ weatherData }) {
  if (!weatherData) {
    return (
      <div className="weather-info">
        <div className="weather-loading">Loading weather...</div>
      </div>
    )
  }

  // Handle the temperature object structure {temp: number, metric: string}
  const temperature = weatherData.temperature?.temp || weatherData.temperature

  return (
    <div className="weather-info">
      <div className="temperature-display">
        <span className="temperature">{temperature}°</span>
      </div>
      <div className="weather-description">
        <p className="weather-text">
          It's currently around {temperature}° in the Netherlands
        </p>
        <p className="weather-subtext">
          {weatherData.description || weatherData.weather?.[0]?.description || 'Very sunny, and very unusual for in the Netherlands. But we should enjoy it as long as it lasts.'}
        </p>
      </div>
    </div>
  )
}

export default WeatherInfo