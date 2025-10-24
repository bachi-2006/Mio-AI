export const auth0Config = {
  domain: "dev-z2jf7uzzciuxplvw.us.auth0.com",
  clientId: "HkQ31hDP1HYCdHMtBHHEGtZ8CGMX8HJv",
  redirectUri: typeof window !== "undefined" ? `${window.location.origin}/callback` : "",
  scope: "openid profile email",
  audience: undefined,
  responseType: "code",
  cacheLocation: "localstorage",
}
