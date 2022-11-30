import { Response } from 'express'
import { AuthRequest } from '../helper/types'

const PlaidService = require('../service/plaid_api_service')

// eslint-disable-next-line new-cap
const plaid_api_router = require('express').Router()

plaid_api_router.route('/link_token').post(async (req: AuthRequest, res: Response) => {
  const link_token = await PlaidService.createLinkToken(req.user.username)
  console.log(link_token)
  res.status(201).json(link_token)
})

plaid_api_router.route('/access_token').post(async (req: AuthRequest, res: Response) => {
  await PlaidService.exchangeToken({ ...req.body, user_id: req.user.id })
  res.status(201).json({ 'msg': 'Token is successfully verified and saved for further usage.' })
})

plaid_api_router.route('/transactions/:id').get(async (req: AuthRequest, res: Response) => {
  // Maybe using GET method
  const count: number = typeof req.query.count === 'string' ? parseInt(req.query.count) : 50
  const transactions = await PlaidService.getTransaction({
    id: parseInt(req.params.id),
    count: count,
    user_id: req.user.id,
  })
  res.status(201).json(transactions)
})

plaid_api_router.route('/balance/:id').get(async (req: AuthRequest, res: Response) => {
  const balance = await PlaidService.getBalance({ id: parseInt(req.params.id), user_id: req.user.id })
  res.status(201).json(balance)
})

module.exports = plaid_api_router
