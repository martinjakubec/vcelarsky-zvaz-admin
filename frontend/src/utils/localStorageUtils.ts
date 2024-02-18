export function setLoginToken(token: string) {
  localStorage.setItem(import.meta.env.VITE_LOGIN_TOKEN_NAME, token);
}

export function getLoginToken() {
  return localStorage.getItem(import.meta.env.VITE_LOGIN_TOKEN_NAME);
}

export function removeLoginToken() {
  localStorage.removeItem(import.meta.env.VITE_LOGIN_TOKEN_NAME);
}
