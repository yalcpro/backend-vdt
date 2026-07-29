import AppError from '../utils/AppError.js'

const handleZodError = (err) => {
  const message = err.errors.map((e) => e.message).join('. ')
  return new AppError(message, 400)
}

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message)
  return new AppError(messages.join('. '), 400)
}

const errorMiddleware = (err, req, res, next) => {
  let error = err

  // Log mínimo sin datos sensibles
  console.error(`[ERROR] ${req.method} ${req.originalUrl}: ${err.message}`)

  if (err.name === 'ZodError') {
    error = handleZodError(err)
  } else if (err.name === 'ValidationError') {
    error = handleValidationError(err)
  } else if (err.code === 11000) {
    error = new AppError('El recurso ya existe (duplicado)', 400)
  } else if (err.name === 'CastError') {
    error = new AppError('ID no válido', 400)
  } else if (!(err instanceof AppError)) {
    error = new AppError('Error interno del servidor', 500)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
}

export default errorMiddleware