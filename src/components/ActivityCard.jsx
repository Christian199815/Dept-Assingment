/**
 * ActivityCard component - Clickable card displaying activity preview
 * Supports keyboard navigation and focus management
 */
function ActivityCard({ activity, onClick, tabIndex = 100 }) {
  return (
    <div 
      className="activity-card focus-outline"
      onClick={() => onClick(activity)}
      tabIndex={tabIndex}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(activity);
        }
      }}
      aria-label={`View details for ${activity.title}`}
    >
      <div className="activity-image">
        <img 
          src={activity.mainImageUrl || activity.mainImage || '/placeholder-activity.jpg'} 
          alt={activity.title}
        />
      </div>
      <div className="activity-content">
        <div className="activity-text">
          <h5 className="activity-name">{activity.title}</h5>
          <p className="activity-description">{activity.shortDescription}</p>
        </div>
        <hr />
      </div>
    </div>
  )
}

export default ActivityCard