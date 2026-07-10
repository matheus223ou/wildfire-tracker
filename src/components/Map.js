import { useState, useMemo } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import LocationMarker from './LocationMarker'
import LocationInfoBox from './LocationInfoBox'

const Map = ({ eventData, center = [20, 0], zoom = 3 }) => {
  const [locationInfo, setLocationInfo] = useState(null)

  const markers = useMemo(() => eventData ? eventData.map((ev, i) => {
    const latitude = parseFloat(ev.latitude)
    const longitude = parseFloat(ev.longitude)
    return (
      <LocationMarker
        key={i}
        position={[latitude, longitude]}
        onClick={() => setLocationInfo({
          latitude,
          longitude,
          date: ev.acq_date,
          time: ev.acq_time,
          confidence: ev.confidence,
          satellite: ev.satellite,
          frp: ev.frp,
        })}
      />
    )
  }) : [], [eventData])

  return (
    <div className='map'>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        preferCanvas={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
          {markers}
        </MarkerClusterGroup>
      </MapContainer>
      {locationInfo !== null && <LocationInfoBox info={locationInfo} />}
    </div>
  )
}

export default Map
