import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'

interface ProductAttrs {
  title: string
  price: number
  userId: string
}

export interface ProductDoc extends mongoose.Document {
  title: number
  price: number
  userId: string
  isReserved(): Promise<boolean>
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: String,
      required: true,
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

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs)
}
productSchema.methods.isReserved = async function () {
  // this === the product document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    id: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}

const Product = mongoose.model<ProductDoc, ProductModel>(
  'product',
  productSchema,
)

export { Product }
