import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, admin } from '../middlewares/auth.js'

const router = Router()

// Rutas públicas
router.get('/', (req, res) => getProducts(req, res)) // se usará con ?type=product
router.get('/:id', getProductById)

// Rutas de admin
router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router