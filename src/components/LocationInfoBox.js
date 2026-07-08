const LocationInfoBox = ({ info }) => {
  return (
    <div className='location-info'>
      <h2>Event Location Info</h2>
      <ul>
        <li>ID: <strong>{info.id}</strong></li>
        <li>TITLE: <strong>{info.title}</strong></li>
        <li>LATITUDE: <strong>{info.latitude}</strong></li>
        <li>LONGITUDE: <strong>{info.longitude}</strong></li>
      </ul>
    </div>
  )
}

export default LocationInfoBox