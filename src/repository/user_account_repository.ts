// @ts-ignore
const psql = require('../config/db')

class UserRepository {
  static find_by_id(id: number) {
    return psql`
      select * from UserAccount
      where id = ${id}
      `
  }

  static find_by_username(username: string) {
    return psql`
      select * from UserAccount
      where username = ${username}
    `
  }

  static create({ username, password }: { username: string; password: string }) {
    /* TODO: password should be encrypted */
    return psql`
        insert into UserAccount (username, password)
        values (${username}, ${password})
        returning id, username
      `
  }

  static update(id: number, dto: { username: string; password: string }) {
    return psql`
        update UserAccount set ${psql(dto, 'username', 'password')}
        where id = ${id}
        returning id, username
      `
  }

  static delete(id: number) {
    return psql`
      delete from UserAccount where id = ${id}
    `
  }

  static authenticate({ username, password }: { username: string; password: string }) {
    return psql`
      select id, username from UserAccount
      where username = ${username} and password = ${password}
    `
  }
}

module.exports = UserRepository
