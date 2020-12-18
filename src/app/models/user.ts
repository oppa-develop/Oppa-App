export interface User {

  firstname: string
  lastname: string
  email?: string
  birthdate: Date
  password?: string
  role: string
  avatar: string
  credit: number
  accountType: string
  elders: any[],
  location?: any,
  token?: string
  
}
