import Product from '../models/Product.js'
import { z } from 'zod'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

const productSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  price: z.number().positive('Precio debe ser positivo'),
  currency: z.enum(['CUP', 'USD']).optional(),
  stock: z.number().int().min(0).optional(),
  whatsapp: z.string().optional(),
  image: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  description: z.string().optional(),
  type: z.enum(['product', 'service']).optional(),
  active: z.boolean().optional(),
})

// @desc    Obtener productos
// @route   GET /api/products?page=1&limit=20&type=product
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const type = req.query.type || 'product'

  const query = { type, active: true }
  const count = await Product.countDocuments(query)
  const totalPages = Math.ceil(count / limit)
  const products = await Product.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })

  res.json({
    success: true,
    data: {
      products,
      page,
      totalPages,
      total: count,
    },
  })
})

// @desc    Obtener producto por ID
// @route   GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new AppError('Producto no encontrado', 404)
  }
  res.json({ success: true, data: product })
})

// @desc    Crear producto
// @route   POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body)
  const product = await Product.create(data)
  res.status(201).json({ success: true, data: product })
})

// @desc    Actualizar producto
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new AppError('Producto no encontrado', 404)
  }

  const data = productSchema.partial().parse(req.body)
  Object.assign(product, data)
  const updated = await product.save()
  res.json({ success: true, data: updated })
})

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new AppError('Producto no encontrado', 404)
  }
  await product.deleteOne()
  res.json({ success: true, message: 'Producto eliminado' })
})