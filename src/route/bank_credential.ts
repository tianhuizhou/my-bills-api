import { Response } from 'express'
import { AuthRequest } from '../helper/types'

const BankCredentialService = require('../service/bank_credential_service')
// eslint-disable-next-line new-cap
const bank_credential_router = require('express').Router()

bank_credential_router.route('/').get(async (req: AuthRequest, res: Response) => {
  const bank_list = await BankCredentialService.getAllBankCredentials(req.user.id)
  res.status(201).json(bank_list)
})

module.exports = bank_credential_router
