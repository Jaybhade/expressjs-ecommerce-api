import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies?.jwt) {
    return next()
  }

  try {
    const payload = jwt.verify(req.cookies.jwt, 'asdf') as UserPayload
    req.currentUser = payload
  } catch (err) {}

  next()
}
