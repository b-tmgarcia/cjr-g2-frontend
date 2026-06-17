import api from "./api";

interface LoginResponse {
  access_token: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/login", { email, senha: password });
  return res.data;
}

export async function getProfile() {
  const res = await api.get("/me");
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await api.post<ForgotPasswordResponse>("/forgot-password", { email });
  return res.data;
}