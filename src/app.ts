import { Request, Response } from 'express'
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

// Health Check
app.get('/api/__healthcheck', (_: Request, response: Response) => response.status(200).end(''))

app.listen(port, () => {
  console.log(`What-todo app listening on port ${port}`)
})
