import { Router } from 'express'
import { getProducts } from '../controllers/productController.js'

const router = Router()

// Endpoint para servicios (filtra type=service)
router.get('/', (req, res) => {
  req.query.type = 'service'
  return getProducts(req, res)
})

export default router