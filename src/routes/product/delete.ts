import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../../middlewares/validate-request'
import { NotFoundError } from '../../errors/not-found-error'
import { NotAuthorizedError } from '../../errors/not-authorized-error'
import { Product } from '../../models/product'
import { currentUser } from '../../middlewares/current-user'

const router = express.Router()

router.delete(
  '/api/products/:id',
  currentUser,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
      throw new NotFoundError()
    }

    if (product.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    await product.deleteOne()

    res.send('Product successfully deleted.')
  },
)

export { router as deleteProductRouter }
