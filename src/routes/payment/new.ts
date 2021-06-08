import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { currentUser } from '../../middlewares/current-user'
import { validateRequest } from '../../middlewares/validate-request'
import { BadRequestError } from '../../errors/bad-request-error'
import { NotAuthorizedError } from '../../errors/not-authorized-error'
import { NotFoundError } from '../../errors/not-found-error'
import { OrderStatus } from '../../middlewares/order-status'
import { stripe } from '../../stripe'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'

const router = express.Router()

router.post(
  '/api/payments',
  currentUser,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order')
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    })
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    })
    await payment.save()

    res.status(201).send({ id: payment.id })
  },
)

export { router as createChargeRouter }
