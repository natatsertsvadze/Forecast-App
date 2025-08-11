const express = require('express')
const path = require('path')
const app = express()

// Serve static files from the correct directory
app.use(express.static(path.join(__dirname, 'dist', 'forecast-app', 'browser')))

// Handle all routes by sending index.html from the correct directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'forecast-app', 'browser', 'index.html'))
})

// Start the server
const port = process.env.PORT || 4200
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
})
