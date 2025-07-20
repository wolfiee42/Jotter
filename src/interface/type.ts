export type User = {
  email: string
  permissions: string[]
  roles: Role[]
}

export type Role = {
  id: string
  key: string
  name: string
}
