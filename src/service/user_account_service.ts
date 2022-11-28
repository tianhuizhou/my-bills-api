import { NotFoundRestException, BadRequestRestException } from '../helper/error_exceptions'
import { JwtStore } from '../config/jwt_store'
import { User } from '../helper/types'

const JWT = require('jsonwebtoken')
const TokenStore = JwtStore.getInstance()
const _pick = require('lodash/pick')

const UserRepository = require('../repository/user_account_repository')

class UserService {
  static async getUserById(id: number) {
    const user = (await UserRepository.find_by_id(id))[0] ?? null
    if (!user) throw new NotFoundRestException(`User ID ${id}`)
    return user
  }

  static async getUserByUsername(username: string) {
    const user = (await UserRepository.find_by_username(username))[0] ?? null
    if (!user) throw new NotFoundRestException(`Username ${username}`)
    return user
  }

  static async login({ username, password }: { username: string; password: string }) {
    const user = (await UserRepository.authenticate({ username, password }))[0] ?? null
    if (!user) throw new BadRequestRestException('Username or password is incorrect')

    let auth_token = null
    if (TokenStore.getToken(username)) {
      JWT.verify(
        TokenStore.getToken(username),
        process.env.JWT_SECRET,
        (err: { name: string; message: string; expiredAt: number }) => {
          if (!err) auth_token = TokenStore.getToken(username)
          else TokenStore.deleteToken = username
        },
      )
    }
    if (!auth_token) {
      auth_token = JWT.sign({ data: user }, process.env.JWT_SECRET, { expiresIn: '4h' })
      TokenStore.addToken = { 'username': username, 'token': auth_token }
    }

    return {
      ..._pick(user, ['id', 'username']),
      auth_token,
    }
  }

  static async logout(user: User) {
    if (!user.username || !TokenStore.getToken(user.username)) {
      throw new BadRequestRestException('Invalid action, please try again.')
    }
    TokenStore.deleteToken = user.username
  }

  static async createUserAccount({ username, password }: { username: string; password: string }) {
    const is_exist = (await UserRepository.find_by_username(username))[0] ?? null
    if (is_exist) throw new BadRequestRestException('Username is already taken')

    const new_user = (await UserRepository.create({ username, password }))[0] ?? {}

    return {
      ..._pick(new_user, ['id', 'username']),
    }
  }

  static async updateUserAccount(id: number, { password }: { password: string }) {
    const user = await UserService.getUserById(id)
    const updated_user = (await UserRepository.update(user.id, { username: user.username, password }))[0]
    console.log(updated_user)
    return {
      ..._pick(updated_user, ['id', 'username']),
    }
  }

  static async deleteUserAccount(id: number) {
    const user = await UserService.getUserById(id)
    await UserRepository.delete(user.id)
  }
}

module.exports = UserService
