import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import serviceRoutes from './routes/services.js'
import errorMiddleware from './middlewares/errorMiddleware.js'

dotenv.config()
connectDB()

const app = express()

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/services', serviceRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API de Venta de to\' funcionando' })
})

// Middleware de manejo de errores (SIEMPRE al final)
app.use(errorMiddleware)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`\n✓ Servidor corriendo en http://localhost:${PORT}\n`)
})