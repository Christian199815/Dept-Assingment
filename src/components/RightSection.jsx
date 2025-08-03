import { useState, useEffect, useMemo, useRef } from 'react'
import ActivitiesList from './ActivitiesList'
import ActivityModal from './ActivityModal'

/**
 * RightSection component - White section showing current weather and activities
 * Filters activities based on weather conditions and manages activity modal
 */
function RightSection({ weatherData, activitiesData }) {
  // Modal and UI state
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showAllSuitable, setShowAllSuitable] = useState(false)
  const [showAllNotSuitable, setShowAllNotSuitable] = useState(false)
  const [randomSeed, setRandomSeed] = useState(0)
  const suitableListRef = useRef(null)
  const notSuitableListRef = useRef(null)

  /** Open activity modal with selected activity */
  const openModal = (activity) => {
    setSelectedActivity(activity)
  }

  /** Close activity modal */
  const closeModal = () => {
    setSelectedActivity(null)
  }

  /** Focus the 3rd activity card for accessibility when expanding lists */
  const focusThirdItem = (listRef) => {
    setTimeout(() => {
      if (listRef.current) {
        const activityCards = listRef.current.querySelectorAll('.activity-card')
        if (activityCards.length >= 3) {
          activityCards[2].focus() // Focus on the 3rd item (index 2)
        }
      }
    }, 100)
  }

  /** Toggle suitable activities list and focus 3rd item when expanding */
  const handleSuitableToggle = () => {
    const wasShowingAll = showAllSuitable
    setShowAllSuitable(!showAllSuitable)
    if (!wasShowingAll) {
      focusThirdItem(suitableListRef)
    }
  }

  /** Toggle not suitable activities list and focus 3rd item when expanding */
  const handleNotSuitableToggle = () => {
    const wasShowingAll = showAllNotSuitable
    setShowAllNotSuitable(!showAllNotSuitable)
    if (!wasShowingAll) {
      focusThirdItem(notSuitableListRef)
    }
  }

  /** Seeded random function for consistent randomization across renders */
  const seededRandom = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /** Shuffle array with seeded random to maintain consistent order */
  const shuffleWithSeed = (array, seed) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /** Update random seed when temperature changes to re-shuffle activities */
  useEffect(() => {
    if (weatherData?.temperature) {
      const currentTemp = weatherData.temperature?.temp || weatherData.temperature
      const tempInCelsius = weatherData.temperature?.metric === 'FAHRENHEIT' 
        ? Math.round((currentTemp - 32) * 5/9) 
        : currentTemp
      setRandomSeed(tempInCelsius * 137) // Use temperature as seed multiplier for consistency
      setShowAllSuitable(false)
      setShowAllNotSuitable(false)
    }
  }, [weatherData?.temperature])

  /** Filter and randomize activities based on current temperature */
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
        <div className="activity-section" ref={suitableListRef}>
          <ActivitiesList 
            title="Some things you could do:"
            activities={displaySuitable}
            onActivityClick={openModal}
            startTabIndex={100}
          />
          {allSuitable.length > 3 && (
            <h6 
              className="see-more-btn focus-outline"
              onClick={handleSuitableToggle}
              tabIndex={150}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSuitableToggle();
                }
              }}
            >
              {showAllSuitable ? 'See less activities' : 'See more activities'}
            </h6>
          )}
        </div>
        
        <div className="activity-section" ref={notSuitableListRef}>
          <ActivitiesList 
            title="Some things you should not do:"
            activities={displayNotSuitable}
            onActivityClick={openModal}
            startTabIndex={160}
          />
          {allNotSuitable.length > 3 && (
            <h6 
              className="see-more-btn focus-outline"
              onClick={handleNotSuitableToggle}
              tabIndex={190}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNotSuitableToggle();
                }
              }}
            >
              {showAllNotSuitable ? 'See less activities' : 'See more activities'}
            </h6>
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