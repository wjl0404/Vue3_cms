import myRequest from '../index'

import { Account, LoginInfo } from './types'

enum LoginAPI {
  AccountLogin = '/login',
  UserInfo = '/users/',
  UserMenus = '/role/'
}

export function accountLoginRequest(account: Account) {
  return myRequest.post<LoginInfo>({
    url: LoginAPI.AccountLogin,
    data: account
  })
}

export function getUserById(id: number) {
  return myRequest.get({
    url: LoginAPI.UserInfo + id
  })
}

export function getUserMenus(id: number) {
  return myRequest.get({
    url: LoginAPI.UserMenus + id + '/menu'
  })
}
