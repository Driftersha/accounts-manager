import { defineStore } from 'pinia'

export type AccountType = 'LDAP' | 'Локальная'

export interface Account {
  id: number
  labels: { text: string }[]
  type: AccountType
  login: string
  password: string | null
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
    nextId: 1,
  }),
  actions: {
    addAccount() {
      this.accounts.push({
        id: this.nextId++,
        labels: [],
        type: 'Локальная',
        login: '',
        password: null,
      })
    },

    updateAccount(account: Account) {
      const index = this.accounts.findIndex(a => a.id === account.id)
      if (index !== -1) {
        if (account.type === 'LDAP') {
          account.password = null
        }
        this.accounts[index] = { ...account }
      }
    },

    removeAccount(id: number) {
      this.accounts = this.accounts.filter(acc => acc.id !== id)
    },
  },
  persist: true,
})


