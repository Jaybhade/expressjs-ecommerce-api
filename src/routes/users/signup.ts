import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../../models/user'
import jwt from 'jsonwebtoken'
//error validator
import { validateRequest } from '../../middlewares/validate-request'
import { BadRequestError } from '../../errors/bad-request-error'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email in use')
    }

    const user = User.build({
      email,
      password,
    })
    await user.save()

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      'asdf',
    )

    // Store it on session object
    res.cookie('jwt', userJwt, { maxAge: 60000 * 10 })

    res.status(201).send(user)
  },
)

export { router as signupRouter }
