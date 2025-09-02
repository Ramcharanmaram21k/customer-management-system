const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// Import routes
const customerRoutes = require('./routes/customerRoutes')
const addressRoutes = require('./routes/addressRoutes')

// Initialize database
const initializeDatabase = require('./database/database')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS Configuration - THIS IS THE KEY CHANGE
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

// Middleware
app.use(cors(corsOptions))  // Updated this line
app.use(express.json())

// Initialize Database
initializeDatabase()

// Routes
app.use('/api/customers', customerRoutes)
app.use('/api/addresses', addressRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully!' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  })
})

const dashboardRoutes = require('./routes/dashboardRoutes')
app.use('/api', dashboardRoutes)


// 404 handler — Express v5 friendly (avoid bare '*')
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

const start = async () => {
  const basePort = Number(process.env.PORT || 5000)
  let port = basePort

  const tryListen = () =>
    new Promise((resolve, reject) => {
      const server = app
        .listen(port, () => {
          console.log(`Server is running on port ${port}`)
          resolve(server)
        })
        .on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} in use, trying ${port + 1}...`)
            port += 1
            setImmediate(() => tryListen().then(resolve).catch(reject))
          } else {
            reject(err)
          }
        })
    })

  try {
    await tryListen()
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()

module.exports = app
