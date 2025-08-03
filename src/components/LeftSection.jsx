import { useState, useEffect, useRef } from 'react'
import ForecastItem from './ForecastItem'

/**
 * LeftSection component - Contains purple section (intro) and rose section (forecast + signup)
 * Handles email subscription and displays weather forecast
 */
function LeftSection({ forecastData, weatherData }) {
  // UI state
  const [showReadMore, setShowReadMore] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const popupButtonRef = useRef(null)

  /** Toggle read more/less text visibility */
  const toggleReadMore = () => {
    setShowReadMore(!showReadMore)
  }

  /** Auto-focus popup button when success modal appears for accessibility */
  useEffect(() => {
    if (showSuccessPopup && popupButtonRef.current) {
      popupButtonRef.current.focus()
    }
  }, [showSuccessPopup])

  /**
   * Handle email subscription form submission
   * Shows success popup on 200, error messages on other statuses
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    
    console.log('Submitting email:', email) // Debug log
    
    try {
      const response = await fetch('https://dtnl-frontend-case.vercel.app/api/post-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      })
      
      console.log('Response status:', response.status) // Debug log
      
      const responseData = await response.json().catch(() => null)
      console.log('Response data:', responseData) // Debug log
      
      if (response.status === 200) {
        console.log('Success! Showing popup') // Debug log
        setShowSuccessPopup(true)
        setEmail('')
      } else if (response.status === 400) {
        setSubmitMessage('Invalid email address. Please try again.')
      } else {
        setSubmitMessage(`Something went wrong. Status: ${response.status}`)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setSubmitMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
      // Auto-clear error messages after 3 seconds
      setTimeout(() => setSubmitMessage(''), 3000)
    }
  }

  /** Update email input value */
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  /** Format date string to readable format: "Monday 3rd Jan" */
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    
    return `${dayName} ${day}${getOrdinalSuffix(day)} ${month}`
  }

  /** Get ordinal suffix for day numbers (1st, 2nd, 3rd, 4th, etc.) */
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th' // Special case for 11th, 12th, 13th
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd' 
      case 3: return 'rd'
      default: return 'th'
    }
  }

  /** Convert Fahrenheit to Celsius if needed */
  const convertTemp = (temp, metric) => {
    if (metric === 'FAHRENHEIT') {
      return Math.round((temp - 32) * 5/9)
    }
    return temp
  }

  /** Map weather condition names to icon file paths */
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

  /** Calculate rotation degrees for wind direction icon (icon defaults to pointing north) */
  const getWindRotation = (direction) => {
    const rotationMap = {
      'N': 0,     // North: point up (no rotation needed)
      'NE': 45,   // Northeast: point up-right (45° from up)
      'E': 90,    // East: point right (90° from up)
      'SE': 135,  // Southeast: point down-right (135° from up)
      'S': 180,   // South: point down (180° from up)
      'SW': 225,  // Southwest: point down-left (225° from up)
      'W': 270,   // West: point left (270° from up)
      'NW': 315   // Northwest: point up-left (315° from up)
    }
    return rotationMap[direction] || 0
  }


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
            
            <button className="read-more-btn focus-outline" onClick={toggleReadMore} tabIndex={1}>
              {showReadMore ? 'Read less' : 'Read more'}
            </button>
          </div>
        </div>
      </div>

      {/* Grey Section - Grid position 1,2 */}
      <div className="grey-section">
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
              onChange={handleEmailChange}
              className="email-input focus-outline"
              tabIndex={200}
              required
              disabled={isSubmitting}
            />
            <button type="submit" className="submit-btn focus-outline" tabIndex={201} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          {submitMessage && (
            <p className="submit-message error">
              {submitMessage}
            </p>
          )}
        </div>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <div className="popup-icon">✓</div>
            <h3 className="popup-title">Successfully Subscribed!</h3>
            <p className="popup-message">
              You're all set! You'll receive daily weather forecasts at your email address.
            </p>
            <button 
              ref={popupButtonRef}
              className="popup-close-btn focus-outline"
              onClick={() => setShowSuccessPopup(false)}
              tabIndex={202}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowSuccessPopup(false);
                }
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default LeftSection