"use client";

import { useState, useId, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importado para fazer o redirecionamento do perfil
import { League_Spartan } from "next/font/google";
import { LojaAPI, ProdutoAPI, AvaliacaoLojaAPI, getLoja } from "../services/lojas";
import { SecaoProdutos } from "./SecaoProdutos";
import ModalAdicionarProduto from "../components/ModalAdicionarProduto";

const spartan = League_Spartan({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const POR_PAGINA = 15;

function fmt(v: number) {
  return `R$${v.toFixed(2).replace(".", ",")}`;
}

function calcMedia(avaliacoes: AvaliacaoLojaAPI[] | undefined): number {
  if (!avaliacoes || avaliacoes.length === 0) return 0;
  return avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length;
}

function Estrelas({ valor, size = 20 }: { valor: number; size?: number }) {
  const uniqueComponentId = useId();

  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const pct = Math.round(Math.min(Math.max(valor - idx, 0), 1) * 100);
        const clipId = `star-clip-${uniqueComponentId}-${idx}`;
        
        return (
          <svg key={idx} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <clipPath id={clipId}>
                <rect x="0" y="0" width={(24 * pct) / 100} height="24" />
              </clipPath>
            </defs>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#E5E7EB" />
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FBBF24" clipPath={`url(#${clipId})`} />
          </svg>
        );
      })}
    </span>
  );
}

function CardProduto({ produto }: { produto: ProdutoAPI }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#ffffff", borderRadius: 24, padding: 12, boxShadow: "0px 4px 12px rgba(0,0,0,0.03)", boxSizing: "border-box", width: "100%" }}>
      <div style={{ width: "100%", height: 170, background: "#ffffff", borderRadius: 18, position: "relative", overflow: "hidden", marginBottom: 12 }}>
        <Image src={produto.imagem || "/images/imagem_referencia.png"} alt={produto.nome} fill sizes="200px" style={{ objectFit: "contain", padding: 10 }} unoptimized />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>{produto.nome}</span>
      <span style={{ fontSize: 13, fontWeight: 400, color: "#374151", marginTop: 2 }}>{fmt(produto.preco)}</span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 4, color: produto.disponivel ? "#6C3CF0" : "#EF4444" }}>
        {produto.disponivel ? "Disponível" : "Indisponível"}
      </span>
    </div>
  );
}

// Atualizado: Botões Adicionados e Link para o Perfil do dono
function HeroBanner({ loja, media, onEditLoja, onAddProduto }: { loja: LojaAPI; media: number; onEditLoja: () => void; onAddProduto: () => void }) {
  const router = useRouter();

  return (
    <div style={{ position: "relative", width: "100%", height: 350, overflow: "hidden" }}>
      <Image src={loja.banner || "/images/Rectangle_37.png"} alt={`Banner ${loja.nome}`} fill style={{ objectFit: "cover", objectPosition: "center 25%" }} priority unoptimized />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
      
      {/* Botões do Banner */}
      <div style={{ position: "absolute", top: 24, right: 40, display: "flex", gap: 16, zIndex: 10 }}>
        <button 
          onClick={onEditLoja}
          style={{ padding: "10px 24px", borderRadius: 30, backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
        >
          Editar Loja
        </button>
        <button 
          onClick={onAddProduto}
          style={{ padding: "10px 24px", borderRadius: 30, backgroundColor: "#6C3CF0", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
        >
          Adicionar Produto
        </button>
      </div>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, zIndex: 5 }}>
        <h1 style={{ margin: 0, fontSize: 64, fontWeight: 600, color: "#fff", letterSpacing: "-1px" }}>{loja.nome}</h1>
        <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 300, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {loja.categoria || "Categoria não definida"}
        </p>
        <Estrelas valor={media} size={22} />
        
       {/* Link para o perfil */}
        <button 
          onClick={() => router.push(`/perfil/${loja.usuario?.id || 1}`)}
          style={{ margin: "16px 0 0", fontSize: 15, color: "#E5E7EB", cursor: "pointer", background: "none", border: "none", textDecoration: "underline", fontFamily: "inherit" }}
        >
          by {loja.usuario?.nome || "Usuário"}
        </button>
              </div>
            </div>
          );
        }

// Atualizado: Botão de Avaliar adicionado
function ReviewsSection({ avaliacoes, media, onAvaliar }: { avaliacoes: AvaliacaoLojaAPI[]; media: number; onAvaliar: () => void }) {
  return (
    <section style={{ background: "#0D0E0D", padding: "52px", position: "relative" }}>
      
      {/* Botão de Avaliar a loja */}
      <div style={{ position: "absolute", top: 52, right: 52 }}>
        <button 
          onClick={onAvaliar}
          style={{ padding: "12px 28px", borderRadius: 30, backgroundColor: "#6C3CF0", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15 }}
        >
          Avaliar Loja
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 36 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#fff" }}>Reviews e Comentários</h2>
        <p style={{ margin: 0, fontSize: 76, fontWeight: 300, color: "#fff", lineHeight: 1 }}>{media.toFixed(2)}</p>
        <Estrelas valor={media} size={28} />
      </div>
      
      {(!avaliacoes || avaliacoes.length === 0) ? (
         <p style={{ textAlign: "center", color: "#6B7280", fontStyle: "italic" }}>Ainda não há avaliações para esta loja.</p>
      ) : (
        <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 16 }}>
          {avaliacoes.map((av) => (
            <div key={av.id} style={{ flexShrink: 0, width: 460, background: "#fff", borderRadius: 24, padding: 24, display: "flex", gap: 18 }}>
              <div style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <Image src={av.usuario?.avatar || "/images/default_avatar.png"} alt={av.usuario?.nome || "Usuário"} fill style={{ objectFit: "cover" }} unoptimized />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#111", margin: "0 0 5px" }}>{av.usuario?.nome}</p>
                <p style={{ fontSize: 14, color: "#4B5563" }}>{av.comentario}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function GradeProdutos({ produtos, nomeLoja }: { produtos: ProdutoAPI[]; nomeLoja: string }) {
  const [pagina, setPagina] = useState(1);

  const listaSegura = produtos && produtos.length >= POR_PAGINA ? produtos : Array.from({ length: 35 }, (_, i) => ({
    id: i + 100,
    nome: `Produto Exemplo ${i + 1}`,
    preco: 89.90 + (i * 5),
    disponivel: i % 4 !== 0,
    imagem: produtos?.[i % (produtos.length || 1)]?.imagem || "/images/imagem_referencia.png"
  }));

  const totalPaginas = Math.ceil(listaSegura.length / POR_PAGINA);
  const inicio = (pagina - 1) * POR_PAGINA;
  const itensExibidos = listaSegura.slice(inicio, inicio + POR_PAGINA);

  const irPara = (n: number) => {
    if (n >= 1 && n <= totalPaginas) {
      setPagina(n);
      const elementoGrid = document.getElementById("grade-produtos-secao");
      if (elementoGrid) elementoGrid.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="grade-produtos-secao" style={{ background: "#F5F0E8", padding: "52px 52px 64px" }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 700, color: "#000", display: "flex", alignItems: "baseline", gap: 8 }}>
        Produtos <span style={{ fontSize: 14, fontWeight: 400, color: "#7F7F7F" }}>de {nomeLoja.toLowerCase()}</span>
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
        {itensExibidos.map((p) => <CardProduto key={p.id} produto={p} />)}
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 60 }}>
        <button onClick={() => irPara(pagina - 1)} style={{ background: "none", border: "none", cursor: pagina === 1 ? "default" : "pointer", opacity: pagina === 1 ? 0.25 : 1, color: "#000" }}>
            <svg width="12" height="20" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ display: "flex", gap: 15 }}>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button 
              key={n} 
              onClick={() => irPara(n)}
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer",
                fontSize: 20,
                fontWeight: pagina === n ? "700" : "400",
                color: pagina === n ? "#000" : "#A3A3A3",
                fontFamily: "inherit"
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <button onClick={() => irPara(pagina + 1)} style={{ background: "none", border: "none", cursor: pagina === totalPaginas ? "default" : "pointer", opacity: pagina === totalPaginas ? 0.25 : 1, color: "#000" }}>
            <svg width="12" height="20" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </section>
  );
}

export default function Loja({ lojaId }: { lojaId: number }) {
  const [loja, setLoja] = useState<LojaAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isModalEditLojaOpen, setIsModalEditLojaOpen] = useState(false);
  const [isModalAddProdutoOpen, setIsModalAddProdutoOpen] = useState(false);
  const [isModalAvaliarOpen, setIsModalAvaliarOpen] = useState(false);

  const carregarLoja = async () => {
    try {
      const data = await getLoja(lojaId);
      setLoja(data);
    } catch (err) {
      console.error("Erro ao buscar a loja:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLoja();
  }, [lojaId]);

  if (loading) {
    return (
      <div className={spartan.className} style={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#F5F0E8", fontSize: 24 }}>
        Carregando informações da loja...
      </div>
    );
  }

  if (error || !loja) {
    return (
      <div className={spartan.className} style={{ height: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#F5F0E8", color: "#EF4444" }}>
        <h2>Ops! Não foi possível carregar esta loja.</h2>
        <p>Verifique se você está logado na plataforma.</p>
      </div>
    );
  }

  const listaProdutos = loja.produtos || [];
  const listaAvaliacoes = loja.avaliacoes_loja || [];
  const media = calcMedia(listaAvaliacoes);

  // Formata os produtos da API para o formato que o componente da sua colega exige
  const produtosFormatados = listaProdutos.slice(0, 10).map((p) => ({
    src: p.imagem || "/images/imagem_referencia.png",
    nome: p.nome,
    preco: fmt(p.preco),
    disponivel: p.disponivel,
  }));

  return (
    <main className={spartan.className} style={{ background: "#F5F0E8" }}>
      <HeroBanner 
        loja={loja} 
        media={media} 
        onEditLoja={() => setIsModalEditLojaOpen(true)}
        onAddProduto={() => setIsModalAddProdutoOpen(true)}
      />
      
      {/* Componente da Colega: SecaoProdutos */}
      {produtosFormatados.length > 0 && (
        <div style={{ paddingTop: 30, paddingBottom: 20 }}>
          <SecaoProdutos 
            titulo="Produtos" 
            subtitulo="melhor avaliados" 
            produtos={produtosFormatados} 
          />
        </div>
      )}

      <ReviewsSection 
        avaliacoes={listaAvaliacoes} 
        media={media} 
        onAvaliar={() => setIsModalAvaliarOpen(true)} 
      />
      
      <GradeProdutos produtos={listaProdutos} nomeLoja={loja.nome} />

      {/* RENDERIZAÇÃO DOS MODAIS (Substitua pelos componentes reais quando prontos) */}
      {isModalEditLojaOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", padding: 40, borderRadius: 20 }}>
            <h2>Modal Editar Loja (Em construção)</h2>
            <button onClick={() => setIsModalEditLojaOpen(false)}>Fechar</button>
          </div>
          {/* <ModalEditarLoja onClose={() => setIsModalEditLojaOpen(false)} loja={loja} /> */}
        </div>
      )}

     {/* MODAL ADICIONAR PRODUTO INTEGRADO */}
      <ModalAdicionarProduto 
        isOpen={isModalAddProdutoOpen} 
        onClose={() => setIsModalAddProdutoOpen(false)} 
        lojaId={loja.id}
        onSuccess={carregarLoja} 
      />

      {isModalAvaliarOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", padding: 40, borderRadius: 20 }}>
            <h2>Modal Avaliar Loja (Substitua por componente real)</h2>
            <button onClick={() => setIsModalAvaliarOpen(false)}>Fechar</button>
          </div>
          {/* <ModalAvaliarLoja onClose={() => setIsModalAvaliarOpen(false)} lojaId={loja.id} /> */}
        </div>
      )}
    </main>
  );
}