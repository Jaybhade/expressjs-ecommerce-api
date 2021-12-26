import mongoose from 'mongoose'

const dotenv = require('dotenv')

dotenv.config()

import { app } from './app'

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected to MongoDb')
  } catch (err) {
    console.error(err)
  }

  app.listen(process.env.PORT || 4000, () => {
    console.log('Listening!!!!!!!!')
  })
}

start()
