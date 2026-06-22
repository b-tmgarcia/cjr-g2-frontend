import api from "./api";

export interface ImagemProdutoAPI {
  id: number;
  url_imagem: string;
  ordem: number;
}

export interface ProdutoAPI {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria_id?: number;
  imagens_produto?: ImagemProdutoAPI[];
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
  descricao?: string;
  logo_url?: string;
  banner_url?: string;
  sticker_url?: string;
  usuario: { id: number; nome: string; email: string };
  produtos: ProdutoAPI[];
  avaliacoes_loja: AvaliacaoLojaAPI[];
}

export async function getLoja(id: number): Promise<LojaAPI> {
  const response = await api.get<LojaAPI>(`/lojas/${id}`);
  return response.data;
}