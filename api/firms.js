const FIRMS_URL = 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_24h.csv'

export default async function handler(req, res) {
  const firmsRes = await fetch(FIRMS_URL)
  const csv = await firmsRes.text()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/csv')
  res.status(200).send(csv)
}
