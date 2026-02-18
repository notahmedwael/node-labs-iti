import { Router } from 'express'
import * as ctrl from '../controllers/productController.js'
import { validateProduct, validateStockAndUpdates } from '../middlewares/validator.js'

const router = Router()

router.get('/', ctrl.getProducts)
router.get('/:id', ctrl.getOne)
router.post('/', validateProduct, ctrl.create)
router.patch('/:id', validateStockAndUpdates, ctrl.patchProduct)
router.delete('/:id', ctrl.deleteProduct)

export default router
