import { useState, useEffect } from 'react'
import Map from './components/Map'

function App() {
  const [eventData, setEventData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const res = await fetch('https://eonet.gsfc.nasa.gov/api/v2.1/events?category=8&days=30')
      const { events } = await res.json()

      setEventData(events)
      setLoading(false)
    }

    fetchEvents()
  }, [])

  return (
    <div>
      <header className='app-header'>
        <h1>🔥 Wildfire Tracker (Powered By NASA)</h1>
      </header>
      { !loading ? <Map eventData={eventData} /> : <p>Fetching Data...</p> }
    </div>
  )
}

export default App