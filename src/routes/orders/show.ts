import express, { Request, Response } from 'express'
import { currentUser } from '../../middlewares/current-user'
import { NotFoundError } from '../../errors/not-found-error'
import { NotAuthorizedError } from '../../errors/not-authorized-error'
import { Order } from '../../models/order'

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  currentUser,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    res.send(order)
  },
)

export { router as showOrderRouter }
