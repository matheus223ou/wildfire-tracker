const LocationInfoBox = ({ info }) => {
  return (
    <div className='location-info'>
      <h2>Fire Detection Info</h2>
      <ul>
        <li>LATITUDE: <strong>{info.latitude}</strong></li>
        <li>LONGITUDE: <strong>{info.longitude}</strong></li>
        <li>DATE: <strong>{info.date} {info.time}</strong></li>
        <li>CONFIDENCE: <strong>{info.confidence}</strong></li>
        <li>SATELLITE: <strong>{info.satellite}</strong></li>
        <li>FIRE RADIATIVE POWER: <strong>{info.frp} MW</strong></li>
      </ul>
    </div>
  )
}

export default LocationInfoBox
