import { useState, useEffect } from 'react'
import './App.css'
import './properties.css'
import LeftSection from './components/LeftSection'
import RightSection from './components/RightSection'
import Footer from './components/Footer'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [activitiesData, setActivitiesData] = useState([])
  const [forecastData, setForecastData] = useState([])

  useEffect(() => {
    const baseURL = 'https://dtnl-frontend-case.vercel.app/api'
    
    // Fetch weather data
    fetch(`${baseURL}/get-weather`)
      .then(response => response.json())
      .then(data => setWeatherData(data))
      .catch(error => console.error('Error fetching weather:', error))

    // Fetch activities data
    fetch(`${baseURL}/get-things-to-do`)
      .then(response => response.json())
      .then(data => setActivitiesData(data.activities || []))
      .catch(error => console.error('Error fetching activities:', error))

    // Fetch forecast data
    fetch(`${baseURL}/get-forecast`)
      .then(response => response.json())
      .then(data => setForecastData(data.forecast || []))
      .catch(error => console.error('Error fetching forecast:', error))
  }, [])

  return (
    <div className="app">
      <div className="content-wrapper">
        <div className="grid-container">
          <LeftSection forecastData={forecastData} weatherData={weatherData} />
          <RightSection weatherData={weatherData} activitiesData={activitiesData} />
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App