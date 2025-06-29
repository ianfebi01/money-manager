export interface IAuth {
  jwt: string
  user: IUser
}

export interface IUser {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
}

export interface IRefreshToken {
  token: string
}

export interface IBodyLogin {
  email: string
  password: string
}

export interface IBodyRegister {
  email: string
  password: string
  username: string
}

export type TBodyChangePassword = {
  token: string
  password: string
  confirm_password: string
}
