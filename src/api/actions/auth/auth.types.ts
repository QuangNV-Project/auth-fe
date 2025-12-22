export type LoginMutationArguments = {
  token?: string
  userName?: string
  password?: string
  redirectTo: string
  state: string
}

export type CredentialLoginMutationArguments = {
  idToken: string
}

export type LoginMutationResponse = {
  code: string
  redirectTo: string
  state: string
}

export type AuthMutationResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user?: UserDto;
}

export type UserDto = {
    id: number
    email: string
    username: string
    firstName: string
    lastName: string
    role: string
    balance: number
    avatar: string
}

export type GoogleLoginReturn = {
  clientId: string
  credential: string
  select_by: string
}

export type GetMeQueryResponse = {
  firstName: string
  lastName: string
  userName: string
}

export type User = {
  id: string
  name: string
}

export type GetUsersResponse = {
  users: User[]
  nextPage?: number | null
}

export type GetUsersInfiniteArgs = {
  count?: string
}

export type GetUsersListArgs = {
  page?: string
}

export type RefreshTokenMutationResponse = {
  accessToken: string
  refreshToken: string
}

export type RegisterMutationArguments = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export type RegisterMutationResponse = {
  userId: string
  email: string
  username: string
  message: string
}

export type LogoutMutationRequest = {
  accessToken: string
}

// API_ACTION_TYPES
