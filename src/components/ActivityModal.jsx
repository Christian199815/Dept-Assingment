import { useState, useEffect, useRef } from 'react'

/**
 * ActivityModal component - Modal displaying detailed activity information
 * Features image carousel, focus trapping, and keyboard navigation
 */
function ActivityModal({ activity, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const modalRef = useRef(null)
  const previouslyFocusedElement = useRef(null)
  
  // Ensure we have images array, fallback to single image or placeholder
  const images = activity.images || (activity.mainImage ? [activity.mainImage] : ['/placeholder-activity.jpg'])

  /** Navigate to next image in carousel */
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  /** Navigate to previous image in carousel */
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  /** Handle escape key and focus trapping for modal accessibility */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      // Focus trapping - keep tab navigation within modal
      if (event.key === 'Tab') {
        const modal = modalRef.current
        if (!modal) return

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    // Store the previously focused element for restoration on close
    previouslyFocusedElement.current = document.activeElement

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden' // Prevent background scroll

    // Focus the first focusable element when modal opens
    setTimeout(() => {
      const modal = modalRef.current
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length > 0) {
          focusableElements[0].focus()
        }
      }
    }, 100)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
      
      // Restore focus to the previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus()
      }
    }
  }, [onClose])

  /** Close modal when clicking outside the modal content */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" ref={modalRef}>
        <button 
          className="modal-close focus-outline" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M33 11L11 33" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11 11L33 33" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div className="image-carousel">
          <div className="carousel-container">
            <img 
              src={images[currentImageIndex]} 
              alt={`${activity.title} - Image ${currentImageIndex + 1}`}
              className="carousel-image"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  className="carousel-btn carousel-prev focus-outline" 
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
                    <path d="M14 18L8 12L14 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button 
                  className="carousel-btn carousel-next focus-outline" 
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                
                {/* <div className="carousel-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div> */}
              </>
            )}
          </div>
        </div>

        <div className="modal-body">
          <h3 id="modal-title" className="modal-title">{activity.title}</h3>
          
          <p className="activity-status-badge">
            You can do this event
          </p>

          <p className="temperature-info">
            You can do this activity between {activity.minTemp !== null ? `${activity.minTemp}°` : 'any temp'} and {activity.maxTemp !== null ? `${activity.maxTemp}°` : 'any temp'} in Amsterdam
          </p>

          <div className="modal-description">
            <p>{activity.description}</p>
          </div>

          <button className="view-event-btn focus-outline">
            View event
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActivityModal