// JWT store (Singleton pattern)
// Each user account should only have at most 1 activate JWT,
// JWT will be kicked out of the store either it is expired(Lazy updating) and Logout functionality

class JwtStore {
  private static instance: JwtStore
  private readonly token_pool: { [key: string]: string }

  private constructor() {
    this.token_pool = {}
  }

  static getInstance(): JwtStore {
    if (JwtStore.instance) return this.instance
    this.instance = new JwtStore()
    return this.instance
  }

  getToken(username: string): string {
    return this.token_pool[username] ?? ''
  }

  set addToken({ username, token }: { username: string; token: string }) {
    this.token_pool[username] = token
  }

  set deleteToken(username: string) {
    delete this.token_pool[username]
  }
}

export { JwtStore }
