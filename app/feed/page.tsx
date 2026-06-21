'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LuLogOut } from 'react-icons/lu';
import { IoPersonSharp } from 'react-icons/io5';
import { CiSearch, CiShoppingBasket } from 'react-icons/ci';
import { BsCapsulePill } from 'react-icons/bs';
import { GiLipstick } from 'react-icons/gi';
import { PiDress, PiHouseLight } from 'react-icons/pi';
import { MdOutlineComputer } from 'react-icons/md';
import { IoGameControllerOutline } from 'react-icons/io5';
import { TbHorseToy } from 'react-icons/tb';
import { SecaoProdutos } from '@/app/components/SecaoProdutos';
import api from '@/app/services/api';

const mockCategorias: { label: string; icon: React.ReactNode }[] = [
  { label: 'Mercado',     icon: <CiShoppingBasket size={28} /> },
  { label: 'Farmácia',    icon: <BsCapsulePill size={24} /> },
  { label: 'Beleza',      icon: <GiLipstick size={24} /> },
  { label: 'Moda',        icon: <PiDress size={40} /> },
  { label: 'Eletrônicos', icon: <MdOutlineComputer size={26} /> },
  { label: 'Jogos',       icon: <IoGameControllerOutline size={26} /> },
  { label: 'Brinquedos',  icon: <TbHorseToy size={26} /> },
  { label: 'Casa',        icon: <PiHouseLight size={26} /> },
];

const mockProdutosMelhoresAvaliados = [
  { src: '/images/prod_brownie_meio.png', nome: 'Brownie Meio A.',  preco: 'R$4,70',  disponivel: true  },
  { src: '/images/prod_brownie_trad.png', nome: 'Brownie Trad.',    preco: 'R$3,80',  disponivel: false },
  { src: '/images/prod_nozes.png',        nome: 'Nozes',            preco: 'R$29,99', disponivel: true,  unidade: '/kg' },
  { src: '/images/prod_banana.png',       nome: 'Banana',           preco: 'R$3,99',  disponivel: true,  unidade: '/kg' },
  { src: '/images/prod_limao.png',        nome: 'Limão Siciliano',  preco: 'R$17,99', disponivel: false, unidade: '/kg' },
];

const mockProdutosMaisBaratos = [
  { src: '/images/prod_limpador_facial.png', nome: 'Limpador Facial', preco: 'R$74,99',  disponivel: true  },
  { src: '/images/prod_blush.png',           nome: 'Blush',           preco: 'R$199,99', disponivel: false },
  { src: '/images/prod_serum.png',           nome: 'Sérum Facial',    preco: 'R$99,90',  disponivel: true  },
  { src: '/images/prod_iluminador.png',      nome: 'Iluminador',      preco: 'R$249,90', disponivel: true  },
  { src: '/images/prod_body_splash.png',     nome: 'Body Splash',     preco: 'R$179,99', disponivel: false },
];

const mockProdutosModa = [
  { src: '/images/prod_saia.png',          nome: 'Saia',        preco: 'R$75,99',  disponivel: true  },
  { src: '/images/prod_new_balance.png',   nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png',          nome: 'Bota',        preco: 'R$115,90', disponivel: true  },
  { src: '/images/prod_bolsa.png',         nome: 'Bolsa',       preco: 'R$349,90', disponivel: true  },
  { src: '/images/prod_saia.png',          nome: 'Saia Jeans',  preco: 'R$159,99', disponivel: false },
];

const mockProdutosRecentementeAdicionados = [
  { src: '/images/prod_bolsa.png',         nome: 'Bolsa',       preco: 'R$349,90', disponivel: true  },
  { src: '/images/prod_blush.png',         nome: 'Blush',       preco: 'R$159,99', disponivel: false },
  { src: '/images/prod_saia.png',          nome: 'Saia',        preco: 'R$75,99',  disponivel: true  },
  { src: '/images/prod_new_balance.png',   nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png',          nome: 'Bota',        preco: 'R$115,90', disponivel: true  },
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

// ─── Página ───────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [categorias, setCategorias] = useState<{ label: string; icon: React.ReactNode }[]>([]);
  const [produtosMelhoresAvaliados, setProdutosMelhoresAvaliados] = useState<any[]>([]);
  const [produtosMaisBaratos, setProdutosMaisBaratos] = useState<any[]>([]);
  const [produtosModa, setProdutosModa] = useState<any[]>([]);
  const [produtosRecentementeAdicionados, setProdutosRecentementeAdicionados] = useState<any[]>([]);
  const [lojas, setLojas] = useState<any[]>([]);

  useEffect(() => {
    setIsLogged(!!localStorage.getItem('token'));
    
    const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
    if (useMocks) {
      setCategorias(mockCategorias);
      setProdutosMelhoresAvaliados(mockProdutosMelhoresAvaliados.map((p, i) => ({ ...p, id: i + 1 })));
      setProdutosMaisBaratos(mockProdutosMaisBaratos.map((p, i) => ({ ...p, id: i + 6 })));
      setProdutosModa(mockProdutosModa.map((p, i) => ({ ...p, id: i + 11 })));
      setProdutosRecentementeAdicionados(mockProdutosRecentementeAdicionados.map((p, i) => ({ ...p, id: i + 16 })));
      setLojas(mockLojas.map((l, i) => ({ ...l, id: i + 1 })));
    } else {
      async function fetchDadosReais() {
        try {
          const [catRes, prodRes, lojasRes] = await Promise.allSettled([
            api.get('/categorias'),
            api.get('/produtos'),
            api.get('/lojas')
          ]);

          if (catRes.status === 'fulfilled' && catRes.value.data) {
            setCategorias(catRes.value.data.map((c: any) => ({
              label: c.nome,
              icon: <CiShoppingBasket size={28} /> // fallback icon for dynamic categories
            })));
          } else {
            setCategorias([]);
          }

          if (prodRes.status === 'fulfilled' && prodRes.value.data) {
            const produtosFormatados = prodRes.value.data.map((p: any) => ({
              id: p.id,
              src: p.imagens_produto?.[0]?.url_imagem || '/images/prod_Comp_Lenovo_Repiit.png',
              nome: p.nome || 'Produto',
              preco: `R$ ${p.preco ? Number(p.preco).toFixed(2) : '0.00'}`,
              disponivel: p.estoque > 0,
            }));
            
            // Distribute real products across the 4 sections
            setProdutosMelhoresAvaliados(produtosFormatados.slice(0, 5));
            setProdutosMaisBaratos(produtosFormatados.slice(5, 10));
            setProdutosModa(produtosFormatados.slice(10, 15));
            setProdutosRecentementeAdicionados(produtosFormatados.slice(-5));
          } else {
            setProdutosMelhoresAvaliados([]);
            setProdutosMaisBaratos([]);
            setProdutosModa([]);
            setProdutosRecentementeAdicionados([]);
          }

          if (lojasRes.status === 'fulfilled' && lojasRes.value.data) {
            setLojas(lojasRes.value.data.map((l: any) => ({
              id: l.id,
              src: l.logo_url || '/images/lojas_cjr.png',
              nome: l.nome,
              categoria: l.categoria?.nome || 'Diversos'
            })));
          } else {
            setLojas([]);
          }
        } catch (error) {
          console.error("Erro ao buscar dados reais do feed", error);
        }
      }
      fetchDadosReais();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════
          HERO — 1440×539px
      ══════════════════════════════════════════════════════ */}
      <section style={{
        backgroundColor: '#000',
        width: '1440px', height: '539px',
        position: 'relative', overflow: 'visible',
        margin: '0 auto',
      }}>

        {/* Navbar: 1440×92px */}
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

          {/* Frase */}
          <div style={{
            position: 'absolute', top: '122px', left: '111px',
            width: '720px', height: '142px', textAlign: 'right',
          }}>
            <h1 style={{ color: 'white', fontWeight: 1100, fontSize: '3.35rem', lineHeight: 1.0, margin: 0 }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap', fontWeight: 700 }}>Do CAOS à organização,</span>
              <span style={{ display: 'block', fontWeight: 600 }}>em alguns cliques</span>
            </h1>
          </div>

          {/* Mascote */}
          <div style={{
            position: 'absolute', top: '0px', left: '757px',
            width: '572px', height: '780px',
            zIndex: 0, pointerEvents: 'none',
          }}>
            <Image src="/images/mascote_feed.png" alt="Mascote Stock.io" width={572} height={780}
              style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: '100%' }} priority />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CORPO BEGE
      ══════════════════════════════════════════════════════ */}
      <div style={{ width: '1440px', margin: '0 auto', backgroundColor: '#F6F3E4', position: 'relative', zIndex: 1 }}>

        {/* ── Busca + Categorias ─────────────────────────────── */}
        <section style={{ paddingTop: '20px', paddingLeft: '90px', paddingRight: '65px', paddingBottom: '0rem' }}>

          {/* Busca */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.75rem', marginLeft: '615px' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              backgroundColor: 'white', borderRadius: '9999px',
              padding: '0.65rem 1.25rem', width: '603px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <input type="text" placeholder="Procurar por..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#6A38F3', fontSize: '1rem' }} />
              <CiSearch style={{ color: '#6A38F3', marginLeft: '0.5rem', fontSize: '1.2rem' }} />
            </div>
          </div>

          {/* Categorias */}
          <div style={{ width: '1211px', height: '210px', position: 'relative' }}>
            <h2 style={{
              position: 'absolute', top: '0px', left: 0,
              width: '163px', height: '34px',
              fontSize: '2rem', fontWeight: 600, color: '#111827', margin: 0, lineHeight: '34px',
            }}>Categoria</h2>

            <div style={{
              position: 'absolute', top: '50px', left: 0,
              width: '1263px', height: '155px',
              display: 'flex', gap: '18px', overflowX: 'auto',
              paddingTop: '20px', scrollbarWidth: 'none', boxSizing: 'border-box',
            }}>
              {categorias.map((cat, idx) => (
                <div key={idx} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '0.4rem', cursor: 'pointer',
                  minWidth: '1px', width: '130px', height: '130px', flexShrink: 0,
                }}>
                  <div style={{
                    width: '111px', height: '111px', borderRadius: '20px',
                    backgroundColor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6A38F3',
                  }}>
                    {cat.icon}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500, textAlign: 'center' }}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ── Seções de Produtos ─────────────────────────────── */}
        <SecaoProdutos titulo="Produtos" subtitulo="melhores avaliados"  produtos={produtosMelhoresAvaliados} />
        <SecaoProdutos titulo="Produtos" subtitulo="mais baratos"        produtos={produtosMaisBaratos} />
        <SecaoProdutos titulo="Produtos" subtitulo="moda"                produtos={produtosModa} />
        <SecaoProdutos titulo="Produtos" subtitulo="recém adicionados"   produtos={produtosRecentementeAdicionados} />

        {/* ── Lojas ──────────────────────────────────────────── */}
        <section style={{ paddingTop: '2rem', paddingBottom: '90px', width: '1300px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingLeft: '115px', paddingRight: '65px', marginBottom: '1.25rem',
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>Lojas</h2>
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid #d1d5db', borderRadius: '9999px',
              padding: '0.5rem 1.5rem', minWidth: '220px',
              fontSize: '0.9rem', color: '#a78bfa',
              backgroundColor: 'transparent', cursor: 'pointer',
            }}>
              filtros <span style={{ color: '#9ca3af' }}>▼</span>
            </button>
          </div>

          <div style={{
            display: 'flex', gap: '30px', overflowX: 'auto',
            paddingLeft: '130px', paddingRight: '65px',
            height: '254px', paddingTop: '27px', paddingBottom: '27px',
            scrollbarWidth: 'none', boxSizing: 'border-box',
          }}>
            {lojas.map((loja, idx) => (
              <div key={idx} 
                onClick={() => router.push(`/preview/tela-de-loja?id=${loja.id || idx + 1}`)}
                style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.4rem', cursor: 'pointer',
                minWidth: '161px', width: '161px', height: '199px', flexShrink: 0,
              }}>
                <div style={{
                  width: '130px', height: '130px', borderRadius: '9999px',
                  backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  <Image src={loja.src} alt={loja.nome} width={130} height={130} style={{ objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', textAlign: 'center' }}>{loja.nome}</span>
                <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 500 }}>{loja.categoria}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}