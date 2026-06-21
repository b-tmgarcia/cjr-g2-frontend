'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LuLogOut } from 'react-icons/lu';
import { IoPersonSharp } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { SecaoProdutos } from '@/app/components/SecaoProdutos';
import { ProdutoCard } from '@/app/components/ProdutoCard';
import { SearchBar } from '@/app/components/SearchBar';
import api from '@/app/services/api';

// Tipos substituindo os imports quebrados
export type Produto = {
  id?: number | string;
  src: string;
  nome: string;
  preco: string;
  disponivel: boolean;
  unidade?: string;
};

export type Loja = {
  id?: string | number;
  src: string;
  nome: string;
  categoria: string;
};

const mockProdutos = [
  { src: '/images/prod_limpador_facial.png', nome: 'Limpador Facial', preco: 'R$74,99',  disponivel: true  },
  { src: '/images/prod_blush.png',           nome: 'Blush',           preco: 'R$199,99', disponivel: false },
  { src: '/images/prod_serum.png',           nome: 'Sérum Facial',    preco: 'R$99,90',  disponivel: true  },
  { src: '/images/prod_iluminador.png',      nome: 'Iluminador',      preco: 'R$249,90', disponivel: true  },
  { src: '/images/prod_body_splash.png',     nome: 'Body Splash',     preco: 'R$179,99', disponivel: false },
  { src: '/images/prod_saia.png',          nome: 'Saia',        preco: 'R$75,99',  disponivel: true  },
  { src: '/images/prod_new_balance.png',   nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png',          nome: 'Bota',        preco: 'R$115,90', disponivel: true  },
  { src: '/images/prod_bolsa.png',         nome: 'Bolsa',       preco: 'R$349,90', disponivel: true  },
  { src: '/images/prod_saia.png',          nome: 'Saia Jeans',  preco: 'R$159,99', disponivel: false },
];

const mockLojas = [
  { src: '/images/lojas_cjr.png',         nome: 'CJR',           categoria: 'mercado'      },
  { src: '/images/lojas_rare_beauty.png',  nome: 'Rare Beauty',   categoria: 'beleza'       },
  { src: '/images/lojas_the_croc.png',    nome: 'The Croc Brew', categoria: 'mercado'      },
  { src: '/images/lojas_mini_reno.png',    nome: 'Mini Reno',     categoria: 'casa'         },
  { src: '/images/lojas_amoca.png',       nome: 'amoca',         categoria: 'moda'         },
  { src: '/images/lojas_repliit.png',      nome: 'Repiit',        categoria: 'eletrônicos'  },
  { src: '/images/lojas_electree.png',     nome: 'electree',      categoria: 'eletrônicos'  },
  { src: '/images/lojas_abtec.png',        nome: 'abtec',         categoria: 'eletrônicos'  },
];

import { useRouter } from 'next/navigation';

export default function CategoriaEspecificaPage() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');
  
  // Controle de Paginação Interativa
  const [pagina, setPagina] = useState(1);

  // Verifica login
  useEffect(() => {
    setIsLogged(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Estados dos dados
  const [nomeCategoria, setNomeCategoria] = useState('O universo da tecnologia');
  const [pilulasCategorias, setPilulasCategorias] = useState<string[]>([]);
  const [produtosExibidos, setProdutosExibidos] = useState<Produto[]>([]);
  const [maisPopulares, setMaisPopulares] = useState<Produto[]>([]);
  const [recemAdicionados, setRecemAdicionados] = useState<Produto[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);

  // Carrega infos da categoria, destaques e lojas
  useEffect(() => {
    async function carregarDadosIniciais() {
      const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

      if (useMocks) {
        setNomeCategoria('O universo da tecnologia (Mock)');
        setPilulasCategorias(['Smartphones', 'Notebooks', 'Fones', 'Periféricos']);
        setMaisPopulares(mockProdutos.slice(0, 5).map((p, i) => ({ ...p, id: i + 1 })));
        setRecemAdicionados(mockProdutos.slice(-5).map((p, i) => ({ ...p, id: i + 6 })));
        setLojas(mockLojas.map((l, i) => ({ ...l, id: i + 1 })));
        return;
      }

      try {
        const [catRes, prodRes, lojasRes] = await Promise.allSettled([
          api.get('/categorias/1'), // ID fixo como exemplo
          api.get('/produtos'),
          api.get('/lojas')
        ]);

        if (catRes.status === 'fulfilled' && catRes.value.data) {
          setNomeCategoria(catRes.value.data.nome);
          // Caso a API tenha subcategorias
          if (catRes.value.data.subcategorias) {
            setPilulasCategorias(catRes.value.data.subcategorias.map((sub: any) => sub.nome));
          } else {
             setPilulasCategorias(['Smartphones', 'Notebooks', 'Fones', 'Periféricos']); // Fallback visual
          }
        }

        const formatarProduto = (p: any): Produto => ({
          id: p.id,
          src: p.imagens_produto?.[0]?.url_imagem || '/images/prod_Comp_Lenovo_Repiit.png',
          nome: p.nome || 'Produto Sem Nome',
          preco: `R$ ${p.preco ? Number(p.preco).toFixed(2) : '0.00'}`,
          disponivel: p.estoque > 0,
        });

        const formatarLoja = (l: any): Loja => ({
          id: l.id,
          src: l.logo_url || '/images/lojas_cjr.png',
          nome: l.nome,
          categoria: l.categoria?.nome || 'Tecnologia'
        });

        if (prodRes.status === 'fulfilled' && prodRes.value.data) {
          const produtosFormatados = prodRes.value.data.map(formatarProduto);
          // Simulando mais populares e recem adicionados localmente usando slice
          setMaisPopulares(produtosFormatados.slice(0, 5));
          setRecemAdicionados(produtosFormatados.slice(-5));
        }

        if (lojasRes.status === 'fulfilled' && lojasRes.value.data) {
          setLojas(lojasRes.value.data.map(formatarLoja));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da categoria:", error);
      }
    }
    carregarDadosIniciais();
  }, []);

  // Carrega produtos da grid paginada
  useEffect(() => {
    async function carregarProdutosDaPagina() {
      const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
      if (useMocks) {
        const mocked = mockProdutos.map((p, i) => ({ ...p, id: i + 1 }));
        setProdutosExibidos(mocked);
        setTodosProdutos(mocked);
        return;
      }

      try {
        // Busca todos e divide por paginas no front (15 por pagina)
        const response = await api.get('/produtos');
        if (response.data) {
          const produtosFormatados = response.data.map((p: any) => ({
            id: p.id,
            src: p.imagens_produto?.[0]?.url_imagem || '/images/prod_Comp_Lenovo_Repiit.png',
            nome: p.nome || 'Produto Sem Nome',
            preco: `R$ ${p.preco ? Number(p.preco).toFixed(2) : '0.00'}`,
            disponivel: p.estoque > 0,
          }));
          
          const itensPorPagina = 15;
          const inicio = (pagina - 1) * itensPorPagina;
          const fim = inicio + itensPorPagina;
          setProdutosExibidos(produtosFormatados.slice(inicio, fim));
          setTodosProdutos(produtosFormatados);
        }
      } catch (error) {
        console.error(`Erro ao carregar produtos da página ${pagina}:`, error);
      }
    }
    carregarProdutosDaPagina();
  }, [pagina]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════
          TOPO DO SITE - ÁREA PRETA — 1440×539px 
      ══════════════════════════════════════════════════════ */}
      <section style={{
        backgroundColor: '#000',
        width: '1440px', height: '539px',
        position: 'relative', overflow: 'visible',
        margin: '0 auto',
      }}>
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '1440px', height: '92px',
          boxSizing: 'border-box', position: 'relative',
        }}>
          <div style={{ paddingLeft: '80px' }}>
            <Image src="/images/logo_feed.png" alt="Stock.io" width={240} height={52}
              style={{ objectFit: 'contain', objectPosition: 'left' }} priority />
          </div>
          <div style={{ position: 'absolute', top: '30px', right: '65px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {isLogged ? (
              <>
                <button aria-label="Perfil" onClick={() => router.push('/preview/profile/1')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IoPersonSharp style={{ width: '35px', height: '35px' }} />
                </button>
                <button aria-label="Sair" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', width: '28.75px', height: '27.5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuLogOut style={{ width: '28.75px', height: '27.5px' }} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => router.push('/login')} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontFamily: 'League Spartan, sans-serif', fontWeight: 600, fontSize: '17.58px', lineHeight: '100%', textAlign: 'center' }}
                >
                  LOGIN
                </button>
                <button 
                  onClick={() => router.push('/cadastro')} 
                  style={{ background: '#6A38F3', border: 'none', cursor: 'pointer', color: 'white', fontFamily: 'League Spartan, sans-serif', fontWeight: 600, fontSize: '17.58px', lineHeight: '100%', textAlign: 'center', borderRadius: '52.64px', width: '166px', height: '29.09px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  CADASTRE-SE
                </button>
              </>
            )}
          </div>
        </nav>

        <div style={{ position: 'absolute', width: '1440px', height: '864px' }}>
          <div style={{
            position: 'absolute', top: '122px', left: '111px',
            width: '720px', height: '142px', textAlign: 'right',
          }}>
            <h1 style={{ color: 'white', fontWeight: 1100, fontSize: '3.35rem', lineHeight: 1.0, margin: 0 }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap', fontWeight: 700 }}>O universo da tecnologia</span>
              <span style={{ display: 'block', fontWeight: 600 }}>em um só lugar</span>
            </h1>
          </div>

          <div style={{
            position: 'absolute', top: '0px', left: '757px',
            width: '572px', height: '780px',
            zIndex: 0, pointerEvents: 'none',
          }}>
            <Image src="/images/mascote_categorias.png" alt="Mascote Stock.io" width={572} height={780}
              style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: '100%' }} priority />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CORPO BEGE — Figma Absolute Bounds
      ══════════════════════════════════════════════════════ */}
      <div style={{ width: '1440px', margin: '0 auto', backgroundColor: '#F6F3E4', position: 'relative', zIndex: 1, minHeight: '1200px' }}>

        {/* Campo de Busca */}
        <section style={{ paddingTop: '20px', paddingLeft: '90px', paddingRight: '65px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.75rem', marginLeft: '615px' }}>
            <SearchBar produtos={todosProdutos} />
          </div>
        </section>

        {/* Subcategorias */}
        <div style={{
          position: 'absolute', top: '90px', left: '119px', width: '728px', height: '36.81px',
          display: 'flex', gap: '25.1px',
        }}>
          {pilulasCategorias.map((cat, i) => (
            <div key={i} style={{
              width: '120.83px', height: '36.81px', borderRadius: '17.67px',
              backgroundColor: '#FFFFFF', color: '#6A38F3',
              fontFamily: 'League Spartan, sans-serif', fontWeight: 400, fontSize: '17.67px',
              lineHeight: '36.81px', textAlign: 'center', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
            }}>
              {cat}
            </div>
          ))}
        </div>

        {/* Caixa Customizada "Ordenar Por" */}
        <div style={{
          position: 'absolute', top: '86px', left: '858px', width: '467.15px',
          backgroundColor: 'white', borderRadius: dropdownAberto ? '30px' : '9999px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', zIndex: 50, transition: 'all 0.2s ease-in-out',
          overflow: 'hidden', height: dropdownAberto ? 'auto' : '43.68px', paddingBottom: dropdownAberto ? '20px' : '0px',
        }}>
          <button onClick={() => setDropdownAberto(!dropdownAberto)} style={{ width: '100%', height: '43.68px', background: 'none', border: 'none', textAlign: 'left', padding: '0 29px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontFamily: 'League Spartan, sans-serif', fontWeight: 300, fontSize: '33.27px', color: '#6A38F3', lineHeight: '100%' }}>ordenar por</span>
            {dropdownAberto ? <IoIosArrowUp size={24} color="#6A38F3" /> : <IoIosArrowDown size={24} color="#6A38F3" />}
          </button>

          {dropdownAberto && (
            <div style={{ padding: '10px 29px 0 29px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Padrão', 'Preço', 'Avaliação', 'Mais Recente'].map((opcao) => (
                <label key={opcao} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'League Spartan, sans-serif', fontSize: '22px', color: '#6A38F3', cursor: 'pointer' }}>
                  <input type="checkbox" checked={opcaoSelecionada === opcao} onChange={() => setOpcaoSelecionada(opcao)} style={{ width: '20px', height: '20px', accentColor: '#6A38F3', cursor: 'pointer' }} />
                  {opcao}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Grid de 15 Produtos */}
        <div style={{ marginLeft: '114px', marginTop: '90px', width: '1211.39px', height: '1035px', position: 'relative' }}>
          <div style={{
            width: '1211.39px', height: '964px', display: 'grid',
            gridTemplateColumns: 'repeat(5, 228.68px)', rowGap: '17px', columnGap: '17px',
          }}>
            {produtosExibidos && produtosExibidos.map((prod, index) => (
              <ProdutoCard key={index} src={prod.src} nome={prod.nome} preco={prod.preco} disponivel={prod.disponivel} />
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════
              CONTROLE DE PAGINAÇÃO — Coordenadas Absolutas do Figma
          ══════════════════════════════════════════════════════ */}
          
          {/* Seta Esquerda (<) */}
          <div 
            onClick={() => setPagina(p => Math.max(1, p - 1))} 
            style={{ 
              position: 'absolute', top: '1000px', left: '395px',
              width: '18.23px', height: '24.75px',
              cursor: 'pointer', opacity: pagina === 1 ? 0.3 : 1, userSelect: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Image src="/images/Vector112.png" alt="Anterior" width={14} height={24} style={{ objectFit: 'contain' }} />
          </div>
          
          {/* Botão Página 1 */}
          <div
            onClick={() => setPagina(1)}
            style={{
              position: 'absolute', top: '994px', left: '457px', // Calculado baseado na proporção de gap
              width: '24px', height: '41px',
              borderBottom: pagina === 1 ? '3px solid #141414' : '3px solid transparent',
              cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Image src="/images/1.png" alt="Página 1" width={18} height={25} style={{ objectFit: 'contain', opacity: pagina === 1 ? 1 : 0.5 }} />
          </div>

          {/* Botão Página 2 */}
          <div
            onClick={() => setPagina(2)}
            style={{
              position: 'absolute', top: '994px', left: '519px',
              width: '24px', height: '41px',
              borderBottom: pagina === 2 ? '3px solid #141414' : '3px solid transparent',
              cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Image src="/images/2.png" alt="Página 2" width={18} height={25} style={{ objectFit: 'contain', opacity: pagina === 2 ? 1 : 0.5 }} />
          </div>

          {/* Botão Página 3 */}
          <div
            onClick={() => setPagina(3)}
            style={{
              position: 'absolute', top: '994px', left: '581px',
              width: '24px', height: '41px',
              borderBottom: pagina === 3 ? '3px solid #141414' : '3px solid transparent',
              cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Image src="/images/3.png" alt="Página 3" width={18} height={25} style={{ objectFit: 'contain', opacity: pagina === 3 ? 1 : 0.5 }} />
          </div>

          {/* Botão Página 4 */}
          <div
            onClick={() => setPagina(4)}
            style={{
              position: 'absolute', top: '994px', left: '643px',
              width: '24px', height: '41px',
              borderBottom: pagina === 4 ? '3px solid #141414' : '3px solid transparent',
              cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Image src="/images/4.png" alt="Página 4" width={18} height={25} style={{ objectFit: 'contain', opacity: pagina === 4 ? 1 : 0.5 }} />
          </div>

          {/* Botão Página 5 */}
          <div
            onClick={() => setPagina(5)}
            style={{
              position: 'absolute', top: '994px', left: '705px',
              width: '24px', height: '41px',
              borderBottom: pagina === 5 ? '3px solid #141414' : '3px solid transparent',
              cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Image src="/images/5.png" alt="Página 5" width={18} height={25} style={{ objectFit: 'contain', opacity: pagina === 5 ? 1 : 0.5 }} />
          </div>

          {/* Seta Direita (>) */}
          <div 
            onClick={() => setPagina(p => Math.min(5, p + 1))} 
            style={{ 
              position: 'absolute', top: '1000px', left: '767px',
              width: '18.23px', height: '24.75px',
              cursor: 'pointer', opacity: pagina === 5 ? 0.3 : 1, userSelect: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Image src="/images/Vector113.png" alt="Próximo" width={14} height={24} style={{ objectFit: 'contain' }} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            ÁREA PRETA DAS LOJAS — 1440px x 430px
        ══════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: '#000', width: '1440px', height: '430px', marginTop: '80px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50px', left: '114px', width: '1212px', height: '318px' }}>
            <h2 style={{ width: '285px', height: '34px', fontFamily: 'League Spartan, sans-serif', fontWeight: 500, fontSize: '36.25px', lineHeight: '100%', color: '#F6F3E4', margin: '0 0 40px 0' }}>Principais Lojas</h2>
            <div style={{ display: 'flex', gap: '30px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {lojas.map((loja, idx) => (
                <div key={loja.nome} 
                  onClick={() => router.push(`/preview/tela-de-loja?id=${loja.id || idx + 1}`)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', minWidth: '161px' }}>
                  <div style={{ width: '130px', height: '130px', borderRadius: '9999px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Image src={loja.src} alt={loja.nome} width={130} height={130} style={{ objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#F6F3E4', textAlign: 'center' }}>{loja.nome}</span>
                  <span style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 500 }}>{loja.categoria}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Barras de Rolagem Horizontais Inferiores */}
        <div style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <SecaoProdutos titulo="Mais populares" subtitulo=" " produtos={maisPopulares} />
          <SecaoProdutos titulo="Recém Adicionados" subtitulo=" " produtos={recemAdicionados} />
        </div>

      </div>
    </div>
  );
}
