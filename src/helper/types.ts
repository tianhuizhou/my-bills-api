import { Request } from 'express'

export interface User {
  id: number
  username: string
  password: string
}

export interface AuthRequest extends Request {
  user: User
}
