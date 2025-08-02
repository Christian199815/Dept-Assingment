import { useState } from 'react'
import ForecastItem from './ForecastItem'

function LeftSection({ forecastData, weatherData }) {
  const [showReadMore, setShowReadMore] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [inputWidth, setInputWidth] = useState(300)

  const toggleReadMore = () => {
    setShowReadMore(!showReadMore)
  }

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
        setInputWidth(300) // Reset width
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
      // Clear error message after 3 seconds
      setTimeout(() => setSubmitMessage(''), 3000)
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    
    // Calculate width based on content
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = '16px Lato, sans-serif' // Match the font from CSS
    const textWidth = context.measureText(value || 'Enter your e-mailaddress').width
    const newWidth = Math.max(300, Math.min(500, textWidth + 100)) // Add more padding
    console.log('Text:', value, 'Width:', textWidth, 'New Width:', newWidth) // Debug log
    setInputWidth(newWidth)
  }

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
              onChange={handleEmailChange}
              className="email-input"
              style={{ width: `${inputWidth}px` }}
              required
              disabled={isSubmitting}
            />
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
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
              className="popup-close-btn"
              onClick={() => setShowSuccessPopup(false)}
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