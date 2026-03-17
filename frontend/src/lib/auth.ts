import Cookies from "js-cookie";

export function setTokens(accessToken: string, refreshToken: string) {
  Cookies.set("access_token", accessToken, { expires: 1, secure: true, sameSite: "lax" });
  Cookies.set("refresh_token", refreshToken, { expires: 30, secure: true, sameSite: "lax" });
}

export function clearTokens() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
}

export function getAccessToken(): string | undefined {
  return Cookies.get("access_token");
}

export function isAuthenticated(): boolean {
  return !!Cookies.get("access_token");
}
