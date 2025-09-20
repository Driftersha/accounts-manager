export type AccountType = 'Локальная' | 'LDAP';

export interface Account {
  id: number;
  type: AccountType;
  login: string;
  password: string;
  labels: { text: string }[];
}
