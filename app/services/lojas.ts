import api from "./api";

export interface ProdutoAPI {
  id: number;
  nome: string;
  preco: number;
  disponivel: boolean;
  imagem: string;
}

export interface AvaliacaoLojaAPI {
  id: number;
  nota: number;
  comentario: string;
  usuario?: { id: number; nome: string; avatar?: string };
}

export interface LojaAPI {
  id: number;
  nome: string;
  categoria: string;
  banner: string;
  usuario: { id: number; nome: string; email: string };
  produtos: ProdutoAPI[];
  avaliacoes_loja: AvaliacaoLojaAPI[];
}

export async function getLoja(id: number): Promise<LojaAPI> {
  const response = await api.get<LojaAPI>(`/lojas/${id}`);
  return response.data;
}