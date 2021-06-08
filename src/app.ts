import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
//import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// auth
import { currentUserRouter } from './routes/users/current-user'
import { signinRouter } from './routes/users/signin'
import { signoutRouter } from './routes/users/signout'
import { signupRouter } from './routes/users/signup'
import { listUserRouter } from './routes/users/users'
// product
import { createProductRouter } from './routes/product/new'
import { showProductRouter } from './routes/product/show'
import { indexProductRouter } from './routes/product/index'
import { updateProductRouter } from './routes/product/update'
import { deleteProductRouter } from './routes/product/delete'
// orders
import { deleteOrderRouter } from './routes/orders/delete'
import { indexOrderRouter } from './routes/orders/index'
import { newOrderRouter } from './routes/orders/new'
import { showOrderRouter } from './routes/orders/show'
// payment
import { createChargeRouter } from './routes/payment/new'
// errors
import { NotFoundError } from './errors/not-found-error'
// middleware
import { errorHandler } from './middlewares/error-handler'
import { currentUser } from './middlewares/current-user'

const app = express()
app.use(cors())
app.use(cookieParser('my secret here'))
app.use(json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'localhost')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

// auth
app.use(listUserRouter)
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
// product
app.use(createProductRouter)
app.use(showProductRouter)
app.use(indexProductRouter)
app.use(updateProductRouter)
app.use(deleteProductRouter)
// order
app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
// payment
app.use(createChargeRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)
app.use(currentUser)

export { app }
