"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import axios from "axios";

// Ajuste aqui caso sua API rode em outra porta (ex.: NestJS em 3001)
const API_URL = "http://localhost:3001";

interface UsuarioLogado {
  id: number;
  nome?: string;
}

interface AvaliacaoAPI {
  id: number;
  estrelas: number;
  texto: string;
  // Para o estado "dono da avaliação" funcionar, o backend deve enviar
  // o id do autor e (opcionalmente) os dados do usuário.
  usuario_id?: number;
  usuario?: { id: number; nome: string; url_avatar?: string };
}

interface ImagemAPI {
  id: number;
  url_imagem: string;
}

interface ProdutoAPI {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  // usuario_id na loja é usado para saber se o usuário logado é o dono do produto
  loja: { id: number; nome: string; usuario_id?: number } | null;
  categoria: { id: number; nome: string } | null;
  imagens_produto: ImagemAPI[];
  avaliacoes_produto: AvaliacaoAPI[];
}

interface ProdutoRelacionado {
  id: number;
  nome: string;
  preco: number;
  disponivel: boolean;
  imagem: string;
}

// Lê o usuário logado do localStorage. Ajuste as chaves ("token"/"usuario")
// conforme o que o seu login realmente salva.
function lerUsuarioLogado(): UsuarioLogado | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  const raw = localStorage.getItem("usuario");
  if (raw) {
    try {
      return JSON.parse(raw) as UsuarioLogado;
    } catch {
      // ignora JSON inválido e tenta decodificar pelo token abaixo
    }
  }

  // Fallback: extrai o id do payload do JWT
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.sub ?? payload.id;
    return id ? { id: Number(id) } : null;
  } catch {
    return null;
  }
}

// Avaliações de exemplo (fallback) caso a API ainda não retorne autor/avatar.
const avaliacoesFallback = [
  { id: 1, usuario_id: 1, nome: "Selena Gomez", estrelas: 4, texto: "Não é por nada não, mas essa garota arrasa", avatar: "/images/products/selena.png" },
  { id: 2, usuario_id: 2, nome: "Sofia Figueiredo", estrelas: 5, texto: "Adoro e fico tão orgulhosa", avatar: "/images/sofia.png" },
  { id: 3, usuario_id: 3, nome: "Michael B. Jordan", estrelas: 5, texto: "Simplesmente incrível, recomendo demais!", avatar: "/images/products/Michael-B.-Jordan.png" },
  { id: 4, usuario_id: 4, nome: "Zhao Lusi", estrelas: 4, texto: "Muito bom, com certeza vou comprar de novo.", avatar: "/images/products/zhao-lusi.png" },
];

const produtosMesmaLoja: ProdutoRelacionado[] = [
  { id: 7, nome: "Brownie Trad.", preco: 3.8, disponivel: false, imagem: "/images/products/prod_brownie_trad.png" },
  { id: 8, nome: "Brownie Doce L.", preco: 4.7, disponivel: true, imagem: "/images/products/prod_brownie_meio.png" },
  { id: 9, nome: "Brownie Nozes", preco: 4.7, disponivel: true, imagem: "/images/products/prod_nozes.png" },
  { id: 10, nome: "Brownie Cookies", preco: 4.7, disponivel: false, imagem: "/images/products/prod_brownie_trad.png" },
  { id: 11, nome: "Brownie M&M", preco: 4.7, disponivel: true, imagem: "/images/products/Brownie-de-M&M's.png" },
];

const imagensFallback = [
  "/images/products/prod_brownie_trad.png",
  "/images/products/prod_brownie_meio.png",
  "/images/products/prod_nozes.png",
  "/images/products/Brownie-de-M&M's.png",
  "/images/products/tabela-nutricional-1.png",
];

function Estrelas({ valor, size = 16 }: { valor: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" style={{ fontSize: size }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < Math.floor(valor) ? "#FBBF24" : "#D1D5DB" }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [produto, setProduto] = useState<ProdutoAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);

  // Estado de autenticação REAL (substitui o authState fixo)
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    setUsuario(lerUsuarioLogado());
  }, []);

  const logado = !!usuario;
  const ehDonoDoProduto = !!(
    logado &&
    produto?.loja?.usuario_id != null &&
    produto.loja.usuario_id === usuario?.id
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErro(null);

    axios
      .get<ProdutoAPI>(`${API_URL}/produtos/${id}`)
      .then((res) => {
        setProduto(res.data);
        setImagemAtiva(0);
      })
      .catch((err) => {
        setErro(err.response?.data?.message ?? "Produto não encontrado.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatarPreco = (v: number) => `R$${v.toFixed(2).replace(".", ",")}`;

  const mediaEstrelas = produto?.avaliacoes_produto?.length
    ? produto.avaliacoes_produto.reduce((acc, av) => acc + av.estrelas, 0) /
      produto.avaliacoes_produto.length
    : 0;

  const imagens = produto?.imagens_produto?.length
    ? produto.imagens_produto.map((img) => img.url_imagem)
    : imagensFallback;

  // Monta as avaliações para exibição, calculando "isOwner" pelo id real.
  const avaliacoes = produto?.avaliacoes_produto?.length
    ? produto.avaliacoes_produto.map((av) => ({
        id: av.id,
        nome: av.usuario?.nome ?? "Usuário",
        estrelas: av.estrelas,
        texto: av.texto,
        avatar: av.usuario?.url_avatar ?? "/images/selena.png",
        isOwner: !!(usuario && av.usuario_id != null && av.usuario_id === usuario.id),
      }))
    : avaliacoesFallback.map((av) => ({
        ...av,
        isOwner: !!(usuario && av.usuario_id === usuario.id),
      }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3E4]">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-gray-500 text-lg">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="min-h-screen bg-[#F6F3E4]">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-red-500 text-lg">{erro ?? "Produto não encontrado."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3E4]">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-8 py-10 flex flex-col gap-12">
        {/* ── Seção produto ── */}
        <section className="flex gap-8 items-start">
          <div className="flex gap-4 shrink-0 items-start">
            <button
              onClick={() => window.history.back()}
              className="mt-28 text-gray-400 hover:text-gray-700 transition-colors shrink-0"
              aria-label="Voltar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex flex-col gap-3 shrink-0" style={{ width: "100px" }}>
              {imagens.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagemAtiva(i)}
                  className="relative rounded-2xl overflow-hidden border-2 transition-colors"
                  style={{
                    background: "#ECECEC",
                    width: "100px",
                    height: "100px",
                    borderColor: imagemAtiva === i ? "#7C3AED" : "transparent",
                  }}
                >
                  <Image src={img} alt={`Imagem ${i + 1}`} fill className="object-contain p-2" unoptimized />
                </button>
              ))}
            </div>

            <div
              className="relative rounded-[24px] overflow-hidden shrink-0"
              style={{ background: "#ECECEC", width: "480px", height: "480px" }}
            >
              <Image
                src={imagens[imagemAtiva]}
                alt={produto.nome}
                fill
                className="object-contain p-8"
                priority
                unoptimized
              />
              <div className="absolute top-4 right-4 z-10">
                <Image src="/images/products/Ellipse-4.png" alt="CJR" width={64} height={64} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5 pt-2 min-w-0">
            <div className="flex items-start gap-2">
              <h1 className="text-4xl font-semibold leading-tight flex-1">{produto.nome}</h1>

              {/* Favoritar: aparece para qualquer usuário logado.
                  Editar produto: só para o dono do produto. */}
              <div className="flex gap-3 mt-2 shrink-0">
                {logado && (
                  <button aria-label="Favoritar produto">
                    <Image src="/images/products/Group-169.png" alt="Favorito" width={40} height={40} />
                  </button>
                )}
                {ehDonoDoProduto && (
                  <button
                    aria-label="Editar produto"
                    onClick={() => router.push(`/produto/${produto.id}/editar`)}
                  >
                    <Image src="/images/products/Group-168.png" alt="Editar" width={40} height={40} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
              <Estrelas valor={mediaEstrelas} size={14} />
              <span className="text-gray-700 font-medium">{mediaEstrelas.toFixed(1)}</span>
              <span>| {produto.avaliacoes_produto?.length ?? 0} reviews</span>
              {produto.categoria && (
                <>
                  <span className="text-gray-300 mx-1">·</span>
                  <a href="#" className="text-[#6C3CF0] hover:underline font-medium">{produto.categoria.nome}</a>
                </>
              )}
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-[#6C3CF0] font-medium">{produto.estoque} disponíveis</span>
            </div>

            <p className="text-4xl font-semibold text-black leading-none">
              {formatarPreco(produto.preco)}
            </p>

            <div>
             {/* CORREÇÃO: text-gray-900 garante o rótulo "Descrição" preto */}
              <h2 className="text-lg font-semibold mb-1 text-gray-900">Descrição</h2>
              <div className="w-8 h-[2px] rounded-full mb-3" style={{ background: "#D4B896" }} />
              <p className="text-[13px] text-gray-600 whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto pr-1">
                {produto.descricao}
              </p>
            </div>
          </div>
        </section>

        {/* ── Avaliações ── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-3xl font-semibold">Avaliações</h2>
          <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {avaliacoes.map((av) => (
              <div
                key={av.id}
                className="bg-white rounded-2xl p-6 shrink-0 flex items-center gap-5"
                style={{ minWidth: "380px" }}
              >
                <div className="relative shrink-0 rounded-full overflow-hidden" style={{ width: "90px", height: "90px" }}>
                  <Image src={av.avatar} alt={av.nome} fill unoptimized className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-bold text-base">{av.nome}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Estrelas valor={av.estrelas} size={18} />
                      {/* Lápis só aparece na avaliação do próprio usuário logado */}
                      {av.isOwner && (
                        <button aria-label="Editar avaliação" className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{av.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Da mesma loja ── */}
        <section className="flex flex-col gap-4 pb-8">
          <h2 className="text-3xl font-semibold">Da mesma loja</h2>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {produtosMesmaLoja.map((p, i) => (
              <button
                key={i}
                onClick={() => router.push(`/produto/${p.id}`)}
                className="flex flex-col gap-2 shrink-0 text-left hover:opacity-80 transition-opacity bg-white rounded-2xl p-3"
                style={{ width: "180px" }}
              >
                <div className="relative rounded-xl overflow-hidden w-full" style={{ height: "150px", background: "#F6F3E4" }}>
                  <Image src={p.imagem} alt={p.nome} fill className="object-contain p-2" unoptimized />
                  <div className="absolute top-2 right-2 z-10">
                    <Image src="/images/products/Ellipse-4.png" alt="CJR" width={40} height={40} />
                  </div>
                </div>
                <p className="text-sm font-bold leading-tight px-1">{p.nome}</p>
                <p className="text-sm text-gray-500 px-1">{formatarPreco(p.preco)}</p>
                <span className={`text-[11px] font-bold tracking-wide uppercase px-1 ${p.disponivel ? "text-[#6C3CF0]" : "text-red-500"}`}>
                  {p.disponivel ? "Disponível" : "Indisponível"}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}