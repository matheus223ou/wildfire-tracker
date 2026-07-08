const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api/firms',
    createProxyMiddleware({
      target: 'https://firms.modaps.eosdis.nasa.gov',
      changeOrigin: true,
      pathRewrite: {
        '^/api/firms': '/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_24h.csv',
      },
    })
  )
}
