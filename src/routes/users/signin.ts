import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../../models/user'
import jwt from 'jsonwebtoken'

import { Password } from '../../services/password'
import { BadRequestError } from '../../errors/bad-request-error'
import { validateRequest } from '../../middlewares/validate-request'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials')
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password,
    )
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      'asdf',
    )

    // Store it on session object
    res.cookie('jwt', userJwt, { maxAge: 60000 * 60 })

    res.status(201).send(existingUser)
  },
)

export { router as signinRouter }
