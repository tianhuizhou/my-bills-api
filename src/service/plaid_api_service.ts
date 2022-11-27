/* Plaid Workflow - new user create connection with bank by using Plaid api
 * 1. Client requests for a Link token from Server to Plaid
 * 2. Server Send back the Link token to Client
 * 3. Client calls the Link ... and user signs in with Plaid
 * 4. Plaid sends back a temporary token
 * 5. Client sends the public token to your app server ASAP
 * 6. App server sends the public token to Plaid to verify
 * 7. Plaid sends back an Access-token for future usage(Store it securely)
 */
import { BadRequestRestException, NotFoundRestException } from '../helper/error_exceptions'
import { CountryCode, LinkTokenCreateRequest } from 'plaid/api'

// const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID
// const PLAID_SECRET = process.env.PLAID_SECRET
// const PLAID_ENV = process.env.PLAID_ENV || 'sandbox'

const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',')
const PLAID_COUNTRY_CODES: Array<CountryCode> = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
) as Array<CountryCode>
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || ''
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || ''

const PlaidClient = require('../config/plaid')
const BankCredentialRepository = require('../repository/bank_credential_repository')

class PlaidApiService {
  // Create a link token with configs which we can then use to initialize Plaid Link client-side
  static async createLinkToken(username: string) {
    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: username,
      },
      client_name: 'Plaid - Bob dev',
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
    }

    if (PLAID_REDIRECT_URI !== '') {
      configs.redirect_uri = PLAID_REDIRECT_URI
    }

    if (PLAID_ANDROID_PACKAGE_NAME !== '') {
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME
    }
    return await PlaidClient.linkTokenCreate(configs)
  }

  //  Exchange token flow - exchange a Link public_token for access token
  static async exchangeToken({
    public_token,
    user_id,
    bank_name,
  }: {
    public_token: string
    user_id: number
    bank_name: string
  }) {
    const plaid_response = await PlaidClient.itemPublicTokenExchange({
      public_token: public_token,
    })

    const access_token = plaid_response.data.access_token
    const item_id = plaid_response.data.item_id
    console.log(item_id)
    // if (PLAID_PRODUCTS.includes(Products.Transfer)) {
    //   TRANSFER_ID = await authorizeAndCreateTransfer(ACCESS_TOKEN)
    // }
    await BankCredentialRepository.create({ bank_name, access_token, user_id })
  }

  private static async getCredential({ id, user_id }: { id: number; user_id: number }) {
    const credential = (await BankCredentialRepository.find_by_id(id))[0] ?? null
    if (!credential || !credential.access_token)
      throw new NotFoundRestException('Item not found, please try link your bank account again!')
    if (credential.user_id !== user_id)
      throw new BadRequestRestException('Access denied, you only can access your own account')

    return credential
  }

  static async getTransaction({ id, user_id, count }: { id: number; user_id: number; count?: number }) {
    const credential = await PlaidApiService.getCredential({ id, user_id })

    // retrieve recent 50 records
    const request: { access_token: string; 'count': number } = {
      'access_token': credential.access_token,
      'count': count || 50,
    }
    const response = await PlaidClient.transactionsSync(request)
    const data = response.data
    return {
      'recently_added': [...data.added].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }
  }

  static async getBalance({ id, user_id }: { id: number; user_id: number }) {
    const credential = await PlaidApiService.getCredential({ id, user_id })
    const response = await PlaidClient.accountsBalanceGet({ 'access_token': credential.access_token })
    return response.data
  }
}

module.exports = PlaidApiService
