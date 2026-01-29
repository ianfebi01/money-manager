export interface IParsedTransaction {
  description: string
  amount: number
  type: 'expense' | 'income'
  category_id: number | null
  category_name: string
}

export interface IParseTransactionResponse {
  transactions: IParsedTransaction[]
}
