import { Response } from 'express'
import { JwtStore } from '../config/jwt_store'
import { AuthRequest, User } from './types'

const JWT = require('jsonwebtoken')
const TokenStore = JwtStore.getInstance()

const tokenValidation = (req: AuthRequest, res: Response, next: () => void) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error(
      'No JWT token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
    )
    res.status(403).send('Unauthorized')
    return
  }

  // Ignore cookie for now
  let user_token = null
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header')
    // Read the ID Token from the Authorization header.
    user_token = req.headers.authorization.split('Bearer ')[1]
  } else {
    res.status(403).send('Unauthorized')
    return
  }

  // JWT validation
  JWT.verify(
    user_token,
    process.env.JWT_SECRET,
    (err: { name: string; message: string; expiredAt: number }, { data: user }: { data: User }) => {
      if (err || !TokenStore.getToken(user.username)) {
        res.status(403).send('Invalid JWT Token')
        return
      }
      req.user = user
      next()
      return
    },
  )
}

module.exports = tokenValidation
