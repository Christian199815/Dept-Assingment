import ActivityCard from './ActivityCard'

function ActivitiesList({ title, activities, onActivityClick }) {
  return (
    <div className="activities-list">
      <h5 className="activities-title">{title}</h5>
      <div className="activities-grid">
        {activities.map((activity, index) => (
          <ActivityCard 
            key={index}
            activity={activity}
            onClick={onActivityClick}
          />
        ))}
      </div>
    </div>
  )
}

export default ActivitiesList