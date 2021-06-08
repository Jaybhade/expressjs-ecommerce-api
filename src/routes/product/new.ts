import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../../middlewares/validate-request'
import { currentUser } from '../../middlewares/current-user'
import { Product } from '../../models/product'

const router = express.Router()

router.post(
  '/api/products',
  currentUser,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    console.log(req.currentUser!.id)

    const product = Product.build({
      title,
      price,
      userId: req.currentUser!.id,
    })
    await product.save()
    console.log('Product created')

    res.status(201).send(product)
  },
)

export { router as createProductRouter }
