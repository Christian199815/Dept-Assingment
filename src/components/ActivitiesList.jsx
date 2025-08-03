import ActivityCard from './ActivityCard'

/**
 * ActivitiesList component - Renders grid of activity cards with title
 * Manages tab indexing for keyboard navigation
 */
function ActivitiesList({ title, activities, onActivityClick, startTabIndex = 100 }) {
  return (
    <div className="activities-list">
      <h5 className="activities-title">{title}</h5>
      <div className="activities-grid">
        {activities.map((activity, index) => (
          <ActivityCard 
            key={index}
            activity={activity}
            onClick={onActivityClick}
            tabIndex={startTabIndex + index}
          />
        ))}
      </div>
    </div>
  )
}

export default ActivitiesList