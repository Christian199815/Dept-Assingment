import { useState, useEffect } from 'react'
import './App.css'
import './properties.css'
import LeftSection from './components/LeftSection'
import RightSection from './components/RightSection'
import Footer from './components/Footer'

/**
 * Main App component - Weather planner application
 * Fetches weather, activities, and forecast data from API on mount
 */
function App() {
  // State for API data
  const [weatherData, setWeatherData] = useState(null)
  const [activitiesData, setActivitiesData] = useState([])
  const [forecastData, setForecastData] = useState([])

  /**
   * Fetch all required data from API on component mount
   * Makes parallel requests for weather, activities, and forecast data
   */
  useEffect(() => {
    const baseURL = 'https://dtnl-frontend-case.vercel.app/api'
    
    // Fetch current weather data
    fetch(`${baseURL}/get-weather`)
      .then(response => response.json())
      .then(data => setWeatherData(data))
      .catch(error => console.error('Error fetching weather:', error))

    // Fetch activities data with fallback to empty array
    fetch(`${baseURL}/get-things-to-do`)
      .then(response => response.json())
      .then(data => setActivitiesData(data.activities || []))
      .catch(error => console.error('Error fetching activities:', error))

    // Fetch 5-day forecast data with fallback to empty array
    fetch(`${baseURL}/get-forecast`)
      .then(response => response.json())
      .then(data => setForecastData(data.forecast || []))
      .catch(error => console.error('Error fetching forecast:', error))
  }, [])

  return (
    <div className="app">
      <div className="content-wrapper">
        {/* Grid layout: Left sections (purple/rose) | Right section (white) | Footer (full width) */}
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