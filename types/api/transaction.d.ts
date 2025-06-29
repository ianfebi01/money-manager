export interface IBodyTransaction {
  date: string
  amount: number
  type: 'expense' | 'income'
  description: string
  mm_category: number | null
}
