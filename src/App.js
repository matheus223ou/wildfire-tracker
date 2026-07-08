import { useState, useEffect } from 'react'
import Map from './components/Map'

const parseCSV = (text) => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const row = {}
    headers.forEach((h, i) => { row[h] = values[i] })
    return row
  })
}

function App() {
  const [eventData, setEventData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const res = await fetch('/api/firms')
      const text = await res.text()
      const rows = parseCSV(text)
      const wildfires = rows.filter(r => r.confidence !== 'low')

      setEventData(wildfires)
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
