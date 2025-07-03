export interface IBodyTransaction {
  date: string
  amount: number
  type: 'expense' | 'income'
  description: string
  category: number
}
export interface ITransaction {
  id: number
  user_id: number
  category_id: number
  amount: string
  description: string
  date: string
  type: 'expense' | 'income'
  created_at: string
}
