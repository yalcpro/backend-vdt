import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import { z } from 'zod'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(6, 'Nueva contraseña: mínimo 6 caracteres'),
})

// @desc    Registrar usuario
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body)
  const { name, email, password } = data

  const exists = await User.findOne({ email })
  if (exists) {
    throw new AppError('El usuario ya existe', 400)
  }

  const user = await User.create({ name, email, password })
  const token = generateToken(user)

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  })
})

// @desc    Iniciar sesión
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body)
  const { email, password } = data

  const user = await User.findOne({ email })
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Credenciales inválidas', 401)
  }

  const token = generateToken(user)
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  })
})

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
  const user = await User.findById(req.user._id)

  if (!user || !(await user.matchPassword(currentPassword))) {
    throw new AppError('Contraseña actual incorrecta', 401)
  }

  user.password = newPassword
  await user.save()

  res.json({ success: true, message: 'Contraseña actualizada' })
})