import { useState, useEffect, useMemo } from 'react'
import ActivitiesList from './ActivitiesList'
import ActivityModal from './ActivityModal'

function RightSection({ weatherData, activitiesData }) {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showAllSuitable, setShowAllSuitable] = useState(false)
  const [showAllNotSuitable, setShowAllNotSuitable] = useState(false)
  const [randomSeed, setRandomSeed] = useState(0)

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
  )
}

export default RightSection