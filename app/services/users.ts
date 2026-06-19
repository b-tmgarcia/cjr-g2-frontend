import api from "./api";

export interface CadastroData {
  fullName: string;
  username: string;
  email: string;
  password?: string;
}

export const createCadastro = async (dados: CadastroData) => {
  try {
    const response = await api.post("/users", dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário no back-end:", error);
    throw error;
  }
};
export const getCadastro = async () => {
  try {
    const response = await api.get("/users"); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cadastros:", error);
    throw error;
  }
};