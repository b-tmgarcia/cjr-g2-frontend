import api from './api';
import { lojasFeedMock, lojasCategoriaMock } from '@/mocks/stores';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const getLojasFeed = async () => {
  if (USE_MOCK) return lojasFeedMock;
  
  try {
    const { data } = await api.get('/lojas');
    return data.map((loja: any) => ({
      src: loja.logo_url || '/images/lojas_cjr.png', // Fallback se não tiver imagem
      nome: loja.nome,
      categoria: 'Loja' // O backend atual não parece ter o campo categoria string, podemos fixar ou buscar de outro lugar
    }));
  } catch (error) {
    console.error("Erro ao buscar lojas reais:", error);
    return lojasFeedMock;
  }
};

export const getLojasCategoria = async () => {
  if (USE_MOCK) return lojasCategoriaMock;
  
  try {
    const { data } = await api.get('/lojas');
    return data.map((loja: any) => ({
      src: loja.logo_url || '/images/lojas_cjr.png',
      nome: loja.nome,
      categoria: 'Eletrônicos'
    }));
  } catch (error) {
    console.error("Erro ao buscar lojas da categoria:", error);
    return lojasCategoriaMock;
  }
};
