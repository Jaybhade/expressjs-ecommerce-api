import express, { Request, Response } from 'express'
import { User } from '../../models/user'

const router = express.Router()

router.delete('/api/users', async (req: Request, res: Response) => {
  const users = await User.deleteMany({})
  res.send('Successfully deleted all users.')
})

export { router as deleteAllUserRouter }
