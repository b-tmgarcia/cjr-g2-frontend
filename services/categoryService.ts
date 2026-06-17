import api from './api';
import { categoriasMock, pilulasCategoriasBackup } from '@/mocks/categories';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const getCategorias = async () => {
  if (USE_MOCK) return categoriasMock;
  
  try {
    const { data } = await api.get('/categorias');
    // Mapeia o campo 'nome' do backend para o 'label' do frontend
    // Como o backend não envia ícones, mantemos um fallback ou mapeamos por nome
    return data.map((cat: any) => ({
      label: cat.nome,
      icon: categoriasMock.find(m => m.label === cat.nome)?.icon || categoriasMock[0].icon
    }));
  } catch (error) {
    console.error("Erro ao buscar categorias reais:", error);
    return categoriasMock;
  }
};

export const getCategoriaInfo = async (id: string) => {
  if (USE_MOCK) {
    return {
      nome: 'O universo da tecnologia',
      subcategorias: pilulasCategoriasBackup.map(nome => ({ nome }))
    };
  }
  
  try {
    const { data } = await api.get(`/categorias/${id}`);
    return {
      nome: data.nome,
      subcategorias: data.subcategorias || []
    };
  } catch (error) {
    console.error(`Erro ao buscar info da categoria ${id}:`, error);
    return null;
  }
};
