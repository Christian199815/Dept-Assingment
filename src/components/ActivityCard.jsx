function ActivityCard({ activity, onClick }) {
  return (
    <div 
      className="activity-card"
      onClick={() => onClick(activity)}
    >
      <div className="activity-image">
        <img 
          src={activity.mainImageUrl || activity.mainImage || '/placeholder-activity.jpg'} 
          alt={activity.title}
        />
      </div>
      <div className="activity-content">
        <h5 className="activity-name">{activity.title}</h5>
        <p className="activity-description">{activity.shortDescription}</p>
        <hr />
      </div>
    </div>
  )
}

export default ActivityCard