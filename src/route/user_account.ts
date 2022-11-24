/* User account Management service
 * it should be isolated as a microservice for handling User account authentication
 * routes would be split as two types protected and public
 * Protected: Logout, ChangePassword, Security questions, Delete
 * Public: Login, Register
 * */
import { Request, Response } from 'express'
import { AuthRequest } from '../helper/types'

const UserService = require('../service/user_service')

// eslint-disable-next-line new-cap
const user_account_public_router = require('express').Router()
// eslint-disable-next-line new-cap
const user_account_protected_router = require('express').Router()

// Create/Register
user_account_public_router.route('/register').post(async (req: Request, res: Response) => {
  const new_user = await UserService.createUserAccount(req.body)
  res.status(201).json(new_user)
})

// Login
user_account_public_router.route('/login').post(async (req: Request, res: Response) => {
  const login_user = await UserService.login(req.body)
  res.status(201).json(login_user)
})

// Logout
user_account_protected_router.route('/logout').post(async (req: AuthRequest, res: Response) => {
  await UserService.logout(req.user, req.body)
  res.status(201).json({ 'msg': 'User logged out successfully' })
})

// Update
user_account_protected_router.route('/user/:id').put(async (req: Request, res: Response) => {
  const user_id: number = parseInt(req.params.id)
  const updated_user = await UserService.updateUserAccount(user_id, req.body)
  res.status(201).json(updated_user)
})

// Delete
user_account_protected_router.route('/user/:id').delete(async (req: Request, res: Response) => {
  const user_id: number = parseInt(req.params.id)
  await UserService.deleteUserAccount(user_id)
  res.status(204).json({ 'msg': 'User account deleted successfully' })
})

export { user_account_public_router, user_account_protected_router }
