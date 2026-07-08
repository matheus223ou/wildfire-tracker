import { Marker } from 'react-leaflet'
import L from 'leaflet'

const fireIcon = L.divIcon({
  className: 'fire-marker',
  iconSize: [10, 10],
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
