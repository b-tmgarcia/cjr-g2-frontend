import api from './api';
import { 
  produtosMelhoresAvaliadosMock, 
  produtosMaisBaratosMock, 
  produtosModaMock, 
  produtosRecentementeAdicionadosMock,
  produtosPorPaginaMock,
  maisPopularesMock,
  recemAdicionadosMock
} from '@/mocks/products';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const getProdutosMelhoresAvaliados = async () => {
  if (USE_MOCK) return produtosMelhoresAvaliadosMock;
  const { data } = await api.get('/products/top-rated');
  return data;
};

export const getProdutosMaisBaratos = async () => {
  if (USE_MOCK) return produtosMaisBaratosMock;
  const { data } = await api.get('/products/cheapest');
  return data;
};

export const getProdutosModa = async () => {
  if (USE_MOCK) return produtosModaMock;
  const { data } = await api.get('/products/fashion');
  return data;
};

export const getProdutosRecentementeAdicionados = async () => {
  if (USE_MOCK) return produtosRecentementeAdicionadosMock;
  const { data } = await api.get('/products/recent');
  return data;
};

export const getProdutosPorPagina = async (pagina: number) => {
  if (USE_MOCK) return produtosPorPaginaMock[pagina] || produtosPorPaginaMock[1];
  const { data } = await api.get(`/products?page=${pagina}`);
  return data;
};

export const getMaisPopulares = async () => {
  if (USE_MOCK) return maisPopularesMock;
  const { data } = await api.get('/products/popular');
  return data;
};

export const getRecemAdicionados = async () => {
  if (USE_MOCK) return recemAdicionadosMock;
  const { data } = await api.get('/products/new');
  return data;
};
