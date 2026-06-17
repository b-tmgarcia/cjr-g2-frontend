import { stores } from "../mocks/stores";

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
  const loja = stores.find((s) => s.id === id);
  if (!loja) throw new Error("Loja não encontrada");
  return loja as LojaAPI;
}