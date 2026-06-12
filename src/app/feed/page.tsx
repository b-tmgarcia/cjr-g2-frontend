'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login, forgotPassword } from '@/services/auth';
import { LuLogOut } from 'react-icons/lu';
import { IoPersonSharp } from 'react-icons/io5';
import { CiSearch, CiShoppingBasket } from 'react-icons/ci';
import { BsCapsulePill } from 'react-icons/bs';
import { GiLipstick } from 'react-icons/gi';
import { PiDress, PiHouseLight } from 'react-icons/pi';
import { MdOutlineComputer } from 'react-icons/md';
import { IoGameControllerOutline } from 'react-icons/io5';
import { TbHorseToy } from 'react-icons/tb';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const categorias: { label: string; icon: React.ReactNode }[] = [
  { label: 'Mercado',     icon: <CiShoppingBasket size={28} /> },
  { label: 'Farmácia',    icon: <BsCapsulePill size={24} /> },
  { label: 'Beleza',      icon: <GiLipstick size={24} /> },
  { label: 'Moda',        icon: <PiDress size={40} /> },
  { label: 'Eletrônicos', icon: <MdOutlineComputer size={26} /> },
  { label: 'Jogos',       icon: <IoGameControllerOutline size={26} /> },
  { label: 'Brinquedos',  icon: <TbHorseToy size={26} /> },
  { label: 'Casa',        icon: <PiHouseLight size={26} /> },
  
];

const produtosMelhoresAvaliados = [
  { src: '/images/prod_brownie_meio.png', nome: 'Brownie Meio A.',  preco: 'R$4,70',  disponivel: true  },
  { src: '/images/prod_brownie_trad.png', nome: 'Brownie Trad.',    preco: 'R$3,80',  disponivel: false },
  { src: '/images/prod_nozes.png',        nome: 'Nozes',            preco: 'R$29,99', disponivel: true,  unidade: '/kg' },
  { src: '/images/prod_banana.png',       nome: 'Banana',           preco: 'R$3,99',  disponivel: true,  unidade: '/kg' },
  { src: '/images/prod_limao.png',        nome: 'Limão Siciliano',  preco: 'R$17,99', disponivel: false, unidade: '/kg' },
];

const produtosMaisBaratos = [
  { src: '/images/prod_limpador_facial.png', nome: 'Limpador Facial', preco: 'R$74,99',  disponivel: true  },
  { src: '/images/prod_blush.png',    nome: 'Blush',           preco: 'R$199,99', disponivel: false },
  { src: '/images/prod_serum.png',    nome: 'Sérum Facial',    preco: 'R$99,90',  disponivel: true  },
  { src: '/images/prod_iluminador.png',     nome: 'Iluminador',      preco: 'R$249,90', disponivel: true  },
  { src: '/images/prod_body_splash.png',     nome: 'Body Splash',     preco: 'R$179,99', disponivel: false },
];

const produtosModa = [
  { src: '/images/prod_saia.png',  nome: 'Saia',        preco: 'R$75,99',  disponivel: true  },
  { src: '/images/prod_new_balance.png',    nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png',  nome: 'Bota',        preco: 'R$115,90', disponivel: true  },
  { src: '/images/prod_bolsa.png', nome: 'Bolsa',       preco: 'R$349,90', disponivel: true  },
  { src: '/images/prod_saia.png', nome: 'Saia Jeans', preco: 'R$159,99', disponivel: false },
];

// Seção recém adicionados — adicione os produtos reais aqui futuramente
const produtosRecentementeAdicionados = [
  { src: '/images/prod_bolsa.png',  nome: 'Bolsa',       preco: 'R$349,90', disponivel: true  },
  { src: '/images/prod_blush.png',  nome: 'Blush', preco: 'R$159,99', disponivel: false },
  { src: '/images/prod_saia.png',   nome: 'Saia',        preco: 'R$75,99',  disponivel: true  },
  { src: '/images/prod_new_balance.png',     nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png',   nome: 'Bota',        preco: 'R$115,90', disponivel: true  },
];

const lojas = [
  { src: '/images/lojas_cjr.png',        nome: 'CJR',           categoria: 'mercado'     },
  { src: '/images/lojas_rare_beauty.png', nome: 'Rare Beauty',   categoria: 'beleza'      },
  { src: '/images/lojas_the_croc.png',   nome: 'The Croc Brew', categoria: 'mercado'     },
  { src: '/images/lojas_mini_reno.png',   nome: 'Mini Reno',     categoria: 'casa'        },
  { src: '/images/lojas_amoca.png',      nome: 'amoca',         categoria: 'moda'        },
  { src: '/images/lojas_repliit.png',     nome: 'Repiit',        categoria: 'eletrônicos' },
  { src: '/images/lojas_electree.png',        nome: 'electree',           categoria: 'eletrônicos'     },
  { src: '/images/lojas_abtec.png',        nome: 'abtec',           categoria: 'eletrônicos'     },
];

// ─── Card de produto ─────────────────────────────────────────────────────────
function ProdutoCard({ src, nome, preco, disponivel, unidade }: {
  src: string; nome: string; preco: string; disponivel: boolean; unidade?: string;
}) {
  return (
    <div style={{
      position: 'relative',
      minWidth: '228.68px', maxWidth: '228.68px', flexShrink: 0,
      width: '228.68px',
      height: '310px',
      borderRadius: '35px', backgroundColor: 'white',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    }}>
      {/* Imagem */}
      <div style={{
        position: 'absolute',
        top: '7px',
        left: '19px',
        width: '190.24px',
        height: '190.24px',
        borderRadius: '12.81px',
        backgroundColor: 'white',
        overflow: 'hidden',
      }}>
        <Image src={src} alt={nome} width={190} height={190} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
      </div>

      {/* Nome */}
      <p style={{
        position: 'absolute',
        top: '187px',
        left: '22px',
        width: '190px',
        height: '25px',
        fontWeight: 700,
        color: '#111827',
        fontSize: '0.95rem',
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {nome}
      </p>

      {/* Preço */}
      <p style={{
        position: 'absolute',
        top: '220px',
        left: '22.09px',
        width: '83px',
        height: '19px',
        fontWeight: 600,
        color: '#1f2937',
        fontSize: '0.9rem',
        margin: 0,
      }}>
        {preco}
        {unidade && <span style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 400, marginLeft: '3px' }}>{unidade}</span>}
      </p>

      {/* Disponível/Indisponível */}
      <p style={{
        position: 'absolute',
        top: '247px',
        left: '22.09px',
        width: '82.85px',
        height: '13px',
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: disponivel ? '#22c55e' : '#ca8a04',
        margin: 0,
      }}>
        {disponivel ? 'Disponível' : 'Indisponível'}
      </p>
    </div>
  );
}

// ─── Seção de produtos ────────────────────────────────────────────────────────
// Figma: área total width 1211, height 397
// Scroll interno: width 1211, height 333, top 1196.56px (relativo ao body bege)
// Fila de cards: width 2068, height 310, top 12px dentro do scroll, gap 32px
function SecaoProdutos({ titulo, subtitulo, produtos }: {
  titulo: string; subtitulo: string; produtos: typeof produtosMelhoresAvaliados;
}) {
  return (
    // Área total da seção: width 1300, height 397
    <section style={{ paddingTop: '1rem', width: '1300px' }}>
      {/* Título */}
      <div style={{ paddingLeft: '100px', paddingRight: '65px', marginBottom: '1.25rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: 0 }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>{titulo}</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#6A38F3' }}>{subtitulo}</span>
        </h2>
      </div>
      {/*
        Scroll container: height 333px conforme Figma.
        Fila de cards começa top: 12px dentro do scroll (padding-top).
        gap: 32px conforme Figma.
      */}
      <div style={{
        display: 'flex', gap: '32px', overflowX: 'auto',
        paddingLeft: '100px', paddingRight: '65px',
        height: '333px',
        paddingTop: '12px',
        paddingBottom: '12px',
        scrollbarWidth: 'none',
        boxSizing: 'border-box',
      }}>
        {produtos.map((p) => <ProdutoCard key={p.nome} {...p} />)}
      </div>
    </section>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const data = await login(values.email, values.password);
      localStorage.setItem('token', data.token);
      toast.success('Login bem-sucedido! Redirecionando...');
      setTimeout(() => { router.push('/'); }, 2500);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string | string[] } } };
      const message = axiosError.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Erro ao fazer login');
    } finally { setLoading(false); }
  };

  const handleForgot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetEmail) { toast.error('Por favor insira seu email.'); return; }
    try {
      const data = await forgotPassword(resetEmail);
      toast.success(data.message || 'Email de recuperação enviado!');
      setShowResetModal(false); setResetEmail('');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Erro ao enviar email de recuperação');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════
          HERO — 1440×539px
      ══════════════════════════════════════════════════════ */}
      <section style={{
        backgroundColor: '#000',
        width: '1440px',
        height: '539px',
        position: 'relative',
        overflow: 'visible',
        margin: '0 auto',
      }}>

        {/* Navbar: 1440×92px */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '1440px',
          height: '92px',
          boxSizing: 'border-box',
          position: 'relative',
        }}>
          <div style={{ paddingLeft: '80px' }}>
            <Image
              src="/images/logo_feed.png"
              alt="Stock.io"
              width={240}
              height={52}
              style={{ objectFit: 'contain', objectPosition: 'left' }}
              priority
            />
          </div>
          <div style={{ position: 'absolute', top: '30px', right: '65px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button aria-label="Perfil" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoPersonSharp style={{ width: '35px', height: '35px' }} /></button>
            <button aria-label="Sair"   style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', width: '28.75px', height: '27.5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LuLogOut style={{ width: '28.75px', height: '27.5px' }} /></button>
          </div>
        </nav>

        {/*
          Container da frase + mascote.
          Figma: width 1440, height 884 (maior que a hero pois o mascote vaza).
          É relativo, os filhos usam posicionamento absoluto com as coordenadas do Figma.
        */}
        <div style={{
          position: 'absolute',
          width: '1440px',
          height: '864px',
        }}>

          {/*
            FRASE DO CAOS
            Figma: width 731, height 142, top 220px, left 111px
            MUDANÇA PEDIDA:
              - "top" mantido em 220px (já estava no código anterior)
              - "em alguns cliques" alinhada à DIREITA em relação à linha acima
                → textAlign: 'right' no container da frase
          */}
          <div style={{
            position: 'absolute',
            top: '122px',   // coordenada Figma: top 220px (relativo ao container, não à navbar)
            left: '111px',  // coordenada Figma: left 111px
            width: '720px', // coordenada Figma: width 731
            height: '142px',// coordenada Figma: height 142
            textAlign: 'right', // MUDANÇA: alinha "em alguns cliques" à direita do bloco
          }}>
            <h1 style={{
              color: 'white',
              fontWeight: 1100,
              fontSize: '3.35rem',
              lineHeight: 1.0,
              margin: 0,
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap', fontWeight: 700 }}>Do CAOS à organização,</span>
              <span style={{ display: 'block', fontWeight: 600 }}>em alguns cliques</span>
            </h1>
          </div>
          {/*
            MASCOTE
            Figma: width 572, height 801, top 83px, left 757px
            Não alterado — mantidas as coordenadas exatas do Figma.
            O mascote começa em top: 83px (acima da frase em top: 220px),
            vaza além dos 539px da hero (83 + 801 = 884px).
          */}
          <div style={{
            position: 'absolute',
            top: '0px',
            left: '757px',
            width: '572px',
            height: '780px',
            zIndex: 0,
            pointerEvents: 'none',
          }}>
            <Image
              src="/images/mascote_feed.png"
              alt="Mascote Stock.io"
              width={572}
              height={780}
              style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: '100%' }}
              priority
            />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CORPO BEGE — começa em top 539px no Figma
          O mascote vaza sobre esta área (z-index maior).
      ══════════════════════════════════════════════════════ */}
      <div style={{ width: '1440px', margin: '0 auto', backgroundColor: '#F6F3E4', position: 'relative', zIndex: 1 }}>

        {/* ── Busca + Categorias ─────────────────────────────── */}
        <section style={{ paddingTop: '20px', paddingLeft: '90px', paddingRight: '65px', paddingBottom: '0rem' }}>

          {/*
            BUSCA
            Figma: left 608px, width 603px
            marginLeft: 608 - 104 (padding já aplicado) = 504px
          */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.75rem', marginLeft: '615px' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              backgroundColor: 'white', borderRadius: '9999px',
              padding: '0.65rem 1.25rem',
              width: '603px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <input
                type="text"
                placeholder="Procurar por..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#6A38F3', fontSize: '1rem' }}
              />
              <CiSearch style={{ color: '#6A38F3', marginLeft: '0.5rem', fontSize: '1.2rem' }} />
            </div>
          </div>

          {/*
            CATEGORIA
            Figma caixa total: width 1211, height 254
            Título "Categoria": width 163, height 34, top 58px
            Área de rolagem: width 1211, height 132, top 122.19px
            Área rente aos itens: width 1263, height 115, top 7.81px dentro do scroll
            Item sozinho: width 115, height 115

            paddingTop: 58px → posiciona o título em top 58px dentro da caixa.
            A área de rolagem começa em top 122.19px → marginTop entre título e scroll:
              122.19 - 58 - 34 (altura do h2) = ~30px
          */}
          <div style={{ width: '1211px', height: '210px', position: 'relative' }}>

            {/* Título: top 58px, width 163, height 34 */}
            <h2 style={{
              position: 'absolute',
              top: '0px',
              left: 0,
              width: '163px',
              height: '34px',
              fontSize: '2rem', fontWeight: 600, color: '#111827', margin: 0,
              lineHeight: '34px',
            }}>Categoria</h2>

            {/*
              Scroll de categorias: top 122.19px, height 132px
              Área rente aos itens: top 7.81px dentro do scroll → paddingTop: 8px
              gap entre itens: (1263 - 8×115) / 7 ≈ 18px
            */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: 0,
              width: '1263px',
              height: '155px',
              display: 'flex',
              gap: '18px',
              overflowX: 'auto',
              paddingTop: '20px',
              scrollbarWidth: 'none',
              boxSizing: 'border-box',
            }}>
              {categorias.map((cat) => (
                // Item: width 115, height 115
                <div key={cat.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '0.4rem',
                  cursor: 'pointer',
                  minWidth: '1px', width: '130px', height: '130px',
                  flexShrink: 0,
                }}>
                  {/* Quadrado branco com ícone react */}
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
        <SecaoProdutos titulo="Produtos" subtitulo="melhores avaliados" produtos={produtosMelhoresAvaliados} />
        <SecaoProdutos titulo="Produtos" subtitulo="mais baratos"       produtos={produtosMaisBaratos} />
        <SecaoProdutos titulo="Produtos" subtitulo="moda"               produtos={produtosModa} />

        {/*
          SEÇÃO: Produtos recém adicionados
          Figma área total: width 1211, height 397
          Scroll: width 1211, height 333, top 1196.56px (relativo ao body bege)
          Fila de cards: width 2068, height 310, top 12px, gap 32px
          — mesma estrutura das outras seções de produtos
        */}
        <SecaoProdutos titulo="Produtos" subtitulo="recém adicionados" produtos={produtosRecentementeAdicionados} />

        {/* ── Lojas ──────────────────────────────────────────── */}
        {/*
          Figma área total: width 1211, height 408, gap 30px, padding-bottom 90px
          Scroll: width 1211, height 254
          Fila de elementos: width 2646, height 199, top 27.44px, gap 30px
          Cada elemento: width 161, height 199
        */}
        <section style={{ paddingTop: '2rem', paddingBottom: '90px', width: '1300px' }}>

          {/* Título + filtros */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingLeft: '115px', paddingRight: '65px',
            marginBottom: '1.25rem',
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

          {/*
            Scroll de lojas: height 254px
            Fila de elementos começa top: 27.44px → paddingTop: 27px
            gap: 30px
            Cada elemento: width 161px, height 199px
          */}
          <div style={{
            display: 'flex', gap: '30px', overflowX: 'auto',
            paddingLeft: '130px', paddingRight: '65px',
            height: '254px',
            paddingTop: '27px',
            paddingBottom: '27px',
            scrollbarWidth: 'none',
            boxSizing: 'border-box',
          }}>
            {lojas.map((loja) => (
              // Cada elemento: width 161, height 199
              <div key={loja.nome} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.4rem', cursor: 'pointer',
                minWidth: '161px', width: '161px', height: '199px',
                flexShrink: 0, 
              }}>
                {/* Círculo: centralizado dentro dos 161px */}
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