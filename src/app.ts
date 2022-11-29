import 'express-async-errors'
import { Request, Response } from 'express'
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 8000
const app = express()

app.use(cors())
app.use(express.json())

// Health Check endpoint without requiring JWT
app.get('/api/__healthcheck', (_: Request, response: Response) => response.status(200).end(''))

// Auth middleware
const auth_middleware = require('./helper/auth_middleware')

// Routes
const user_account_public_router = require('./route/user_account').user_account_public_router
const user_account_protected_router = require('./route/user_account').user_account_protected_router
const plaid_api_router = require('./route/plaid_api')
const bank_credential_router = require('./route/bank_credential')

app.use('/api', user_account_public_router)
app.use('/api', auth_middleware, user_account_protected_router)
app.use('/api/plaid', auth_middleware, plaid_api_router)
app.use('/api/bank_credential', auth_middleware, bank_credential_router)

// Error handler middleware
const error_handler = require('./helper/error_handler')
app.use(error_handler)

app.listen(port, () => {
  console.log(`My-bill app listening on port ${port}`)
})
