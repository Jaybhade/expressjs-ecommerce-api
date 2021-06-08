import express, { Request, Response } from 'express'
import { currentUser } from '../../middlewares/current-user'
import { NotFoundError } from '../../errors/not-found-error'
import { NotAuthorizedError } from '../../errors/not-authorized-error'
import { Order, OrderStatus } from '../../models/order'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  currentUser,
  async (req: Request, res: Response) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    order.status = OrderStatus.Cancelled
    await order.save()

    // publishing an event saying this was cancelled!

    res.status(204).send(order)
  },
)

export { router as deleteOrderRouter }
