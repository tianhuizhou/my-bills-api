// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const BankCredentialRepository = require('../repository/bank_credential_repository')

class BankCredentialService {
  static async getAllBankCredentials(user_id: number) {
    const bank_list = await BankCredentialRepository.find_all_by_user(user_id)
    return {
      'data': bank_list.map((bank: { 'id': number; 'bank_name': string; created_name: string }) => {
        return { 'id': bank.id, 'created_at': bank.created_name, 'bank_name': bank.bank_name }
      }),
    }
  }
}

module.exports = BankCredentialService
