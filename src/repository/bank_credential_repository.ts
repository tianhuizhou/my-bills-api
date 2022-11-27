// @ts-ignore
const psql = require('../config/db')

class BankCredentialRepository {
  static find_by_id(id: number) {
    return psql`
      select * from BankCredential 
      where id = ${id}
      `
  }

  static find_all_by_user(user_id: number) {
    return psql`
      select * from BankCredential
      where user_id = ${user_id}
    `
  }

  static create({ bank_name, access_token, user_id }: { bank_name: string; access_token: string; user_id: number }) {
    return psql`
        insert into BankCredential (bank_name, access_token, user_id)
        values (${bank_name}, ${access_token}, ${user_id})
        returning id, bank_name
      `
  }

  static delete(id: number) {
    return psql`
      delete from BankCredential where id = ${id}
    `
  }
}

module.exports = BankCredentialRepository
