import { Marker } from 'react-leaflet'
import L from 'leaflet'

const fireIcon = L.divIcon({
  html: `<span style="font-size: 2rem; color: red;">
    <iconify-icon icon="mdi:fire-alert"></iconify-icon>
  </span>`,
  className: 'location-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
})

const LocationMarker = ({ position, onClick }) => {
  return (
    <Marker 
      position={position} 
      icon={fireIcon}
      eventHandlers={{ click: onClick }}
    />
  )
}

export default LocationMarker