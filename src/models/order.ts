import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '../middlewares/order-status'
import { ProductDoc } from './product'

export { OrderStatus }

export interface OrderAttrs {
  userId: string
  version: number
  status: OrderStatus
  price: number
  expiresAt: Date
  product: ProductDoc
}

interface OrderDoc extends mongoose.Document {
  version: number
  price: number
  userId: string
  status: OrderStatus
  expiresAt: Date
  product: ProductDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    version: attrs.version,
    price: attrs.price,
    expiresAt: attrs.expiresAt,
    userId: attrs.userId,
    status: attrs.status,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
