import { useState } from 'react'
import ActivitiesList from './ActivitiesList'
import ActivityModal from './ActivityModal'

function RightSection({ weatherData, activitiesData }) {
  const [selectedActivity, setSelectedActivity] = useState(null)

  const openModal = (activity) => {
    setSelectedActivity(activity)
  }

  const closeModal = () => {
    setSelectedActivity(null)
  }

  // Filter activities based on current temperature
  const filterActivities = () => {
    if (!weatherData || !activitiesData.length) {
      return { suitable: [], notSuitable: [] }
    }

    const currentTemp = weatherData.temperature?.temp || weatherData.temperature
    const suitable = []
    const notSuitable = []

    activitiesData.forEach(activity => {
      const { minTemp, maxTemp } = activity
      
      // If min or max is null, temperature doesn't matter for that bound
      const minOk = minTemp === null || currentTemp >= minTemp
      const maxOk = maxTemp === null || currentTemp <= maxTemp
      
      if (minOk && maxOk) {
        suitable.push(activity)
      } else {
        notSuitable.push(activity)
      }
    })

    return { suitable, notSuitable }
  }

  const { suitable, notSuitable } = filterActivities()

  return (
    <div className="right-section">
      <div className="activities-container">
        <ActivitiesList 
          title="Some things you could do:"
          activities={suitable}
          onActivityClick={openModal}
        />
        
        <ActivitiesList 
          title="Some things you should not do:"
          activities={notSuitable}
          onActivityClick={openModal}
        />
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