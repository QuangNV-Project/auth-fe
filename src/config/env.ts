const ENV = {
  BACK_END_URL: import.meta.env.VITE_BACK_END_URL as string,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  TENANT_CODE: import.meta.env.VITE_TENANT_CODE as string,
}

export { ENV }
