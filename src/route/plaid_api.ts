import { Response } from 'express'
import { AuthRequest } from '../helper/types'

const PlaidService = require('../service/plaid_api_service')

// eslint-disable-next-line new-cap
const plaid_api_router = require('express').Router()

plaid_api_router.route('/link_token').post(async (req: AuthRequest, res: Response) => {
  const link_token = await PlaidService.createLinkToken(req.body)
  res.status(201).json(link_token)
})

plaid_api_router.route('/access_token').post(async (req: AuthRequest, res: Response) => {
  await PlaidService.exchangeToken({ ...req.body, user_id: req.user.id })
  res.status(201).json({ 'msg': 'Token is successfully verified and saved for further usage.' })
})

plaid_api_router.route('/transactions').post(async (req: AuthRequest, res: Response) => {
  // Maybe using GET method
  const transactions = await PlaidService.getTransaction({ ...req.body, user_id: req.user.id })
  res.status(201).json(transactions)
})

plaid_api_router.route('/balance').post(async (req: AuthRequest, res: Response) => {
  const balance = await PlaidService.getBalance({ ...req.body, user_id: req.user.id })
  res.status(201).json(balance)
})

module.exports = plaid_api_router
