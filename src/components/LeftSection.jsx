import { useState, useEffect, useMemo } from 'react'
import ActivitiesList from './ActivitiesList'
import ActivityModal from './ActivityModal'
import ForecastItem from './ForecastItem'

function LeftSection({ forecastData, weatherData, activitiesData }) {
  const [showReadMore, setShowReadMore] = useState(false)
  const [email, setEmail] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showAllSuitable, setShowAllSuitable] = useState(false)
  const [showAllNotSuitable, setShowAllNotSuitable] = useState(false)
  const [randomSeed, setRandomSeed] = useState(0)

  const toggleReadMore = () => {
    setShowReadMore(!showReadMore)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Signup with email:', email)
    setEmail('')
  }

  const openModal = (activity) => {
    setSelectedActivity(activity)
  }

  const closeModal = () => {
    setSelectedActivity(null)
  }

  // Seeded random function for consistent randomization
  const seededRandom = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Shuffle array with seeded random
  const shuffleWithSeed = (array, seed) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Update random seed when temperature changes
  useEffect(() => {
    if (weatherData?.temperature) {
      const currentTemp = weatherData.temperature?.temp || weatherData.temperature
      const tempInCelsius = weatherData.temperature?.metric === 'FAHRENHEIT' 
        ? Math.round((currentTemp - 32) * 5/9) 
        : currentTemp
      setRandomSeed(tempInCelsius * 137) // Use temperature as seed multiplier
      setShowAllSuitable(false)
      setShowAllNotSuitable(false)
    }
  }, [weatherData?.temperature])

  // Filter and randomize activities based on current temperature
  const { allSuitable, allNotSuitable, displaySuitable, displayNotSuitable } = useMemo(() => {
    if (!weatherData || !activitiesData.length) {
      return { allSuitable: [], allNotSuitable: [], displaySuitable: [], displayNotSuitable: [] }
    }

    const currentTemp = weatherData.temperature?.temp || weatherData.temperature
    const tempInCelsius = weatherData.temperature?.metric === 'FAHRENHEIT' 
      ? Math.round((currentTemp - 32) * 5/9) 
      : currentTemp
    const suitable = []
    const notSuitable = []

    activitiesData.forEach(activity => {
      const { minTemp, maxTemp } = activity
      
      // If min or max is null, temperature doesn't matter for that bound
      const minOk = minTemp === null || tempInCelsius >= minTemp
      const maxOk = maxTemp === null || tempInCelsius <= maxTemp
      
      if (minOk && maxOk) {
        suitable.push(activity)
      } else {
        notSuitable.push(activity)
      }
    })

    // Randomize arrays with temperature-based seed
    const randomizedSuitable = shuffleWithSeed(suitable, randomSeed)
    const randomizedNotSuitable = shuffleWithSeed(notSuitable, randomSeed + 100)

    return {
      allSuitable: randomizedSuitable,
      allNotSuitable: randomizedNotSuitable,
      displaySuitable: showAllSuitable ? randomizedSuitable : randomizedSuitable.slice(0, 3),
      displayNotSuitable: showAllNotSuitable ? randomizedNotSuitable : randomizedNotSuitable.slice(0, 3)
    }
  }, [weatherData, activitiesData, randomSeed, showAllSuitable, showAllNotSuitable])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    
    return `${dayName} ${day}${getOrdinalSuffix(day)} ${month}`
  }

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd' 
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const convertTemp = (temp, metric) => {
    if (metric === 'FAHRENHEIT') {
      return Math.round((temp - 32) * 5/9)
    }
    return temp
  }

  const getWeatherIcon = (iconName) => {
    const iconMap = {
      'heavy-rain': '/cloudy-icon.svg',
      'hail': '/cloudy-icon.svg',
      'thunderstorm': '/cloudy-icon.svg',
      'fog': '/cloudy-icon.svg',
      'sunny': '/sun-icon.svg',
      'cloudy': '/cloudy-icon.svg'
    }
    return iconMap[iconName] || '/sun-icon.svg'
  }

  const getWindRotation = (direction) => {
    const rotationMap = {
      'N': 0,
      'NE': 45,
      'E': 90,  
      'SE': 135,
      'S': 180,
      'SW': 225,
      'W': 270,
      'NW': 315
    }
    return rotationMap[direction] || 0
  }

  const getCurrentWeatherDescription = () => {
    if (!weatherData) return null
    
    const currentTemp = weatherData.temperature?.temp || weatherData.temperature
    const tempInCelsius = weatherData.temperature?.metric === 'FAHRENHEIT' 
      ? Math.round((currentTemp - 32) * 5/9) 
      : currentTemp

    const weatherInfo = weatherData.weatherInfo?.find(info => {
      const minTemp = info.minTemp
      const maxTemp = info.maxTemp
      return (minTemp === null || tempInCelsius >= minTemp) && 
             (maxTemp === null || tempInCelsius <= maxTemp)
    })

    return {
      temp: tempInCelsius,
      title: weatherInfo?.title?.replace('{{ CELCIUS }}', tempInCelsius),
      description: weatherInfo?.description
    }
  }

  const currentWeather = getCurrentWeatherDescription()

  return (
    <>
      {/* Purple Section - Grid position 1,1 */}
      <div className="purple-section">
        <div className="logo-container">
          <img src="/dept-logo.svg" alt="DEPT" className="dept-logo" />
        </div>
        
        <div className="content-container">
          <div className="main-title">
            <div className="title-line-1">
              <img src="/dept-logo.svg" alt="DEPT" className="title-logo" />
              <h1>weather</h1>
            </div>
            <h1 className="title-line-2">planner</h1>
          </div>
          
          <div className="paragraphs-container">
            <p className="first-paragraph">
              Picture this: an application that doesn't just tell you the weather, but also 
              helps you plan your activities around it. Imagine knowing exactly the perfect 
              day to plan that hike, or when to avoid the outdoor concert due to an 
              unexpected shower. That's exactly what the Dept Weather Planner offers 
              you.
            </p>
            
            {showReadMore && (
              <p className="second-paragraph">
                Built with cutting-edge technologies, our weather planner brings you 
                accurate, real-time weather data with a slick and user-friendly interface. But 
                it's not just a weather app; it's an intuitive daily planner that syncs with the 
                weather. With a range of activities to choose from, it suggests the best 
                options based on current and forecasted weather conditions.
              </p>
            )}
            
            <button className="read-more-btn" onClick={toggleReadMore}>
              {showReadMore ? 'Read less' : 'Read more'}
            </button>
          </div>
        </div>
      </div>

      {/* Rose Section - Grid position 1,2 */}
      <div className="rose-section">
        {/* Forecast Section */}
        <div className="forecast-section">
          <h6 className="forecast-title">Upcoming 5 days</h6>
          <div className="forecast-list">
            {forecastData.slice(0, 5).map((day, index) => (
              <ForecastItem 
                key={index}
                day={day}
                formatDate={formatDate}
                convertTemp={convertTemp}
                getWeatherIcon={getWeatherIcon}
                getWindRotation={getWindRotation}
              />
            ))}
          </div>
        </div>

        {/* Daily Forecast Signup */}
        <div className="signup-section">
          <h6 className="signup-title">Want to get a daily forecast?</h6>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="email"
              placeholder="Enter your e-mailaddress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              required
            />
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* White Section - Grid position 2,1 spanning full height */}
      <div className="white-section">
        {currentWeather && (
          <div className="current-weather">
            <div className="weather-temp">
              <span className="temp-number">{currentWeather.temp}°</span>
            </div>
            <div className="weather-info">
              <h3 className="weather-title">{currentWeather.title}</h3>
              <p className="weather-description">{currentWeather.description}</p>
            </div>
          </div>
        )}

        <div className="activities-container">
          <div className="activity-section">
            <ActivitiesList 
              title="Some things you could do:"
              activities={displaySuitable}
              onActivityClick={openModal}
            />
            {allSuitable.length > 3 && (
              <button 
                className="see-more-btn"
                onClick={() => setShowAllSuitable(!showAllSuitable)}
              >
                {showAllSuitable ? 'see less activities' : 'see more activities'}
              </button>
            )}
          </div>
          
          <div className="activity-section">
            <ActivitiesList 
              title="Some things you should not do:"
              activities={displayNotSuitable}
              onActivityClick={openModal}
            />
            {allNotSuitable.length > 3 && (
              <button 
                className="see-more-btn"
                onClick={() => setShowAllNotSuitable(!showAllNotSuitable)}
              >
                {showAllNotSuitable ? 'see less activities' : 'see more activities'}
              </button>
            )}
          </div>
        </div>

        {selectedActivity && (
          <ActivityModal 
            activity={selectedActivity} 
            onClose={closeModal} 
          />
        )}
      </div>

      {/* Footer Section - Grid position 3, spanning full width */}
      <div className="footer-section">
        <h2 className="footer-text">
          DEPT. × <span className="fdnd">CMD</span>
        </h2>
      </div>
    </>
  )
}

export default LeftSection