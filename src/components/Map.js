import { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import LocationMarker from './LocationMarker'
import LocationInfoBox from './LocationInfoBox'

const Map = ({ eventData, center = [42.265, -122.875], zoom = 6 }) => {
  const [locationInfo, setLocationInfo] = useState(null)

  const wildfires = eventData ? eventData.filter(ev => ev.categories.some(c => c.id === 8)) : []

  const markers = wildfires.map(ev => {
    if(ev.geometries.length > 0) {
      const [longitude, latitude] = ev.geometries[0].coordinates
      return (
        <LocationMarker
          key={ev.id}
          position={[latitude, longitude]}
          onClick={() => setLocationInfo({ id: ev.id, title: ev.title, latitude, longitude })}
        />
      )
    }
    return null
  })

  return (
    <div className='map'>
      <MapContainer 
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {markers}
      </MapContainer>
      {locationInfo !== null && <LocationInfoBox info={locationInfo} />}
    </div>
  )
}

export default Map