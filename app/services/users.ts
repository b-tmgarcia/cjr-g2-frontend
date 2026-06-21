import api from "./api";

export interface CadastroData {
  fullName: string;
  username: string;
  email: string;
  password?: string;
}

export interface UpdateUserData {
  fullName?: string;
  username?: string;
  email?: string;
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

export const getUser = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

export const updateUser = async (id: number, dados: UpdateUserData) => {
  try {
    const response = await api.patch(`/users/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};