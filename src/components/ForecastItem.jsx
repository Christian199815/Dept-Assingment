function ForecastItem({ day, formatDate, convertTemp, getWeatherIcon, getWindRotation }) {
  return (
    <div className="forecast-item">
      <div className="forecast-content">
      <p className="forecast-date">
        {formatDate(day.date)}
      </p>
      <div className="forecast-details">
          <img className="forecast-icon"
            src={getWeatherIcon(day.condition?.icon)} 
            alt={day.condition?.description || 'Weather icon'}
            width="20" 
            height="20"
          />
        <p className="forecast-temps">
          {convertTemp(day.minTemp, day.metric)}° / {convertTemp(day.maxTemp, day.metric)}°
        </p>
        <img className="forecast-precipitation-icon"
            src="/rain-icon.svg" 
            alt="Precipitation" 
            width="16" 
            height="16"
        />
        <p className="forecast-precipitation">
          {day.precipitation}mm
        </p>
        <p className="forecast-wind">
          {day.windDirection}
         
        </p>
        <img className="forecast-wind-icon"
            src="/direction-icon.svg" 
            alt="Wind direction" 
            width="16" 
            height="16"
            style={{transform: `rotate(${getWindRotation(day.windDirection)}deg)`}}
        />
      </div>
      </div>
      <hr />
    </div>
  )
}

export default ForecastItem