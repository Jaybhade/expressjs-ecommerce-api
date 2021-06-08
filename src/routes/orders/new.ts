import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { validateRequest } from '../../middlewares/validate-request'
import { currentUser } from '../../middlewares/current-user'
import { NotFoundError } from '../../errors/not-found-error'
import { OrderStatus } from '../../middlewares/order-status'
import { BadRequestError } from '../../errors/bad-request-error'
import { body } from 'express-validator'
import { Product } from '../../models/product'
import { Order } from '../../models/order'

function changeTimezone(date: Date) {
  var invdate = new Date(
    date.toLocaleString(undefined, {
      timeZone: 'Asia/Kolkata',
    }),
  )

  var diff = date.getTime() - invdate.getTime()

  return new Date(date.getTime() - diff)
}

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post(
  '/api/orders',
  currentUser,
  [
    body('productId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ProductId must be provided.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { productId } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      throw new NotFoundError()
    }

    const isReserved = await product.isReserved()
    if (isReserved) {
      throw new BadRequestError('Product is already reserved')
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: changeTimezone(expiration),
      version: 0,
      price: product.price,
      product,
    })
    await order.save()

    res.status(201).send(order)
  },
)

export { router as newOrderRouter }
