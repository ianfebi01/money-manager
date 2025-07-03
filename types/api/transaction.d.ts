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
  category_name?: string
  amount: number
  description: string
  date: string
  type: 'expense' | 'income'
  created_at: string
}
