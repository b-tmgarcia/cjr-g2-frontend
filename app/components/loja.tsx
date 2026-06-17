"use client";

import { useState, useId } from "react";
import Image from "next/image";
import { League_Spartan } from "next/font/google";
import { LojaAPI, ProdutoAPI, AvaliacaoLojaAPI } from "../../services/lojas";

const spartan = League_Spartan({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const POR_PAGINA = 15;

function fmt(v: number) {
  return `R$${v.toFixed(2).replace(".", ",")}`;
}

function calcMedia(avaliacoes: AvaliacaoLojaAPI[] | undefined): number {
  if (!avaliacoes || avaliacoes.length === 0) return 0;
  return avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length;
}

// COMPONENTE DE ESTRELAS BLINDADO (Suporta 4.5, 4.2, etc. perfeitamente)
function Estrelas({ valor, size = 20 }: { valor: number; size?: number }) {
  const uniqueComponentId = useId(); // Garante IDs únicos para as máscaras de corte SVG

  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, idx) => {
        // Calcula o preenchimento exato de cada estrela (de 0 a 100)
        const pct = Math.round(Math.min(Math.max(valor - idx, 0), 1) * 100);
        const clipId = `star-clip-${uniqueComponentId}-${idx}`;
        
        return (
          <svg key={idx} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              {/* Cria a máscara que corta a estrela proporcionalmente à nota */}
              <clipPath id={clipId}>
                <rect x="0" y="0" width={(24 * pct) / 100} height="24" />
              </clipPath>
            </defs>
            {/* Estrela de Fundo (Cinza Apagada) */}
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#E5E7EB" />
            {/* Estrela da Frente (Amarela Cortada pelo clipPath se for fracionada) */}
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

function HeroBanner({ loja, media }: { loja: LojaAPI; media: number }) {
  return (
    <div style={{ position: "relative", width: "100%", height: 350, overflow: "hidden" }}>
      <Image src={loja.banner || "/images/Rectangle_37.png"} alt={`Banner ${loja.nome}`} fill style={{ objectFit: "cover", objectPosition: "center 25%" }} priority unoptimized />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, zIndex: 5 }}>
        <h1 style={{ margin: 0, fontSize: 64, fontWeight: 600, color: "#fff", letterSpacing: "-1px" }}>{loja.nome}</h1>
        <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 300, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase" }}>{loja.categoria}</p>
        <Estrelas valor={media} size={22} />
      </div>
    </div>
  );
}

function ProdutosDestaque({ produtos }: { produtos: ProdutoAPI[] }) {
  const destaque = produtos.slice(0, 5);
  if (!destaque.length) return null;
  return (
    <section style={{ background: "#F5F0E8", padding: "40px 52px 20px" }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 700, color: "#000", display: "flex", alignItems: "baseline", gap: 8 }}>
        Produtos <span style={{ fontSize: 14, fontWeight: 400, color: "#7F7F7F" }}>melhor avaliados</span>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
        {destaque.map((p) => <CardProduto key={p.id} produto={p} />)}
      </div>
    </section>
  );
}

function ReviewsSection({ avaliacoes, media }: { avaliacoes: AvaliacaoLojaAPI[]; media: number }) {
  if (!avaliacoes || avaliacoes.length === 0) return null;
  return (
    <section style={{ background: "#0D0E0D", padding: "52px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 36 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#fff" }}>Reviews e Comentários</h2>
        <p style={{ margin: 0, fontSize: 76, fontWeight: 300, color: "#fff", lineHeight: 1 }}>{media.toFixed(2)}</p>
        <Estrelas valor={media} size={28} />
      </div>
      <div style={{ display: "flex", gap: 20, overflowX: "auto" }}>
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

export default function Loja({ loja }: { loja: LojaAPI }) {
  const listaProdutos = loja?.produtos || [];
  const listaAvaliacoes = loja?.avaliacoes_loja || [];
  const media = calcMedia(listaAvaliacoes);

  return (
    <main className={spartan.className} style={{ background: "#F5F0E8" }}>
      <HeroBanner loja={loja} media={media} />
      <ProdutosDestaque produtos={listaProdutos} />
      <ReviewsSection avaliacoes={listaAvaliacoes} media={media} />
      <GradeProdutos produtos={listaProdutos} nomeLoja={loja.nome} />
    </main>
  );
}