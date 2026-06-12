"use client";

import { useState } from "react";
import Image from "next/image";
import { League_Spartan } from "next/font/google";

const spartan = League_Spartan({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

interface Produto {
  id: number;
  nome: string;
  preco: number;
  disponivel: boolean;
  imagem: string;
}

interface Review {
  id: number;
  nome: string;
  estrelas: number;
  texto: string;
  avatar: string;
}

// ─── Mapeamento correto das imagens ──────────────────────────────────────────
// image 1.png      → Iluminador (pó compacto rosé brilhante)
// image 1(1).png   → Primer (pump rosé)
// image 1(4).png   → Mascara
// image 1(5).png   → Batom líquido coral dourado
// image 1(6).png   → Pó Compacto bege
// image 1(7).png   → Perfume Rare pote dourado
// image 1(8).png   → Bronzer stick dourado
// image 1(9).png   → Batom vermelho
// image 1(10).png  → Gel bisnaga verde
// image 1(11).png  → Blush compacto coral
// image 1(12).png  → Mist/Bruma spray rosé
// image 1(13).png  → Gel bisnaga rosé corpo
// image 1(14).png  → Mist perfumado spray rosé escuro
// image 1(16).png  → Contorno lápis bege
// image 1(17).png  → Gel bisnaga bege
// image 1(18).png  → Bronzer pote rosé
// image 1(19).png  → Gloss batom líquido coral claro
// image 1(20).png  → Creme mão oval rosé
// image 1(21).png  → Delineador caneta preta

const i = (n: string) => `/images/${n}`;

const PRODUTOS_DESTAQUE: Produto[] = [
  { id: 1, nome: "Bronzer",      preco: 254.99, disponivel: true,  imagem: i("image 1(8).png")  },
  { id: 2, nome: "Blush",        preco: 199.99, disponivel: false, imagem: i("image 1(11).png") },
  { id: 3, nome: "Perfume Rare", preco: 599.90, disponivel: true,  imagem: i("image 1(7).png")  },
  { id: 4, nome: "Iluminador",   preco: 249.90, disponivel: true,  imagem: i("image 1.png")     },
  { id: 5, nome: "Mini Blush",   preco: 99.99,  disponivel: false, imagem: i("image 1(5).png")  },
];

// Página 1 — conforme print do Figma
const TODOS_PRODUTOS: Produto[] = [
  { id: 1,  nome: "Lapis Labial",   preco: 139.90,  disponivel: true,  imagem: i("image 1(16).png") },
  { id: 2,  nome: "Comp. Samsung",  preco: 8549.99, disponivel: false, imagem: i("image 1(6).png")  },
  { id: 3,  nome: "Contorno",       preco: 289.90,  disponivel: true,  imagem: i("image 1(8).png")  },
  { id: 4,  nome: "Iluminador",     preco: 249.90,  disponivel: true,  imagem: i("image 1.png")     },
  { id: 5,  nome: "Primer",         preco: 139.00,  disponivel: true,  imagem: i("image 1(1).png")  },
  { id: 6,  nome: "Mascara de C.",  preco: 109.99,  disponivel: true,  imagem: i("image 1(4).png")  },
  { id: 7,  nome: "Mini Blush",     preco: 99.99,   disponivel: false, imagem: i("image 1(5).png")  },
  { id: 8,  nome: "Pó Compacto",    preco: 119.50,  disponivel: true,  imagem: i("image 1(6).png")  },
  { id: 9,  nome: "Perfume Rare",   preco: 599.90,  disponivel: true,  imagem: i("image 1(7).png")  },
  { id: 10, nome: "Contorno",       preco: 289.99,  disponivel: false, imagem: i("image 1(17).png") },
  { id: 11, nome: "Bronzer",        preco: 254.99,  disponivel: true,  imagem: i("image 1(8).png")  },
  { id: 12, nome: "Bruma Facial",   preco: 149.00,  disponivel: false, imagem: i("image 1(12).png") },
  { id: 13, nome: "Batom",          preco: 179.00,  disponivel: true,  imagem: i("image 1(9).png")  },
  { id: 14, nome: "Blush",          preco: 199.99,  disponivel: false, imagem: i("image 1(11).png") },
  { id: 15, nome: "Gel Perfumado",  preco: 179.99,  disponivel: true,  imagem: i("image 1(10).png") },
  // Página 2 — conforme print do Figma (página 2)
  { id: 16, nome: "Blush",          preco: 239.00,  disponivel: true,  imagem: i("image 1(11).png") },
  { id: 17, nome: "Batom Liq.",     preco: 149.90,  disponivel: false, imagem: i("image 1(5).png")  },
  { id: 18, nome: "Caneta de A.",   preco: 189.90,  disponivel: true,  imagem: i("image 1(20).png") },
  { id: 19, nome: "Gel de banho",   preco: 99.50,   disponivel: true,  imagem: i("image 1(9).png")  },
  { id: 20, nome: "Mist Perfumado", preco: 249.90,  disponivel: true,  imagem: i("image 1(14).png") },
  { id: 21, nome: "Gel Perfumado",  preco: 179.90,  disponivel: true,  imagem: i("image 1(10).png") },
  { id: 22, nome: "Iphone 16",      preco: 299.90,  disponivel: false, imagem: i("image 1(13).png") },
  { id: 23, nome: "Gel para S.",    preco: 179.90,  disponivel: true,  imagem: i("image 1(16).png") },
  { id: 24, nome: "Gel Perfumado",  preco: 179.90,  disponivel: true,  imagem: i("image 1(17).png") },
  { id: 25, nome: "Sombras",        preco: 239.90,  disponivel: false, imagem: i("image 1(18).png") },
  { id: 26, nome: "Pó",             preco: 199.90,  disponivel: false, imagem: i("image 1(18).png") },
  { id: 27, nome: "Primer",         preco: 59.60,   disponivel: false, imagem: i("image 1(19).png") },
  { id: 28, nome: "Sombra L.",      preco: 59.60,   disponivel: true,  imagem: i("image 1(5).png")  },
  { id: 29, nome: "Creme para mão", preco: 149.00,  disponivel: true,  imagem: i("image 1(20).png") },
  { id: 30, nome: "Delineador",     preco: 199.99,  disponivel: false, imagem: i("image 1(21).png") },
];

const REVIEWS: Review[] = [
  {
    id: 1,
    nome: "Sofia Figueiredo",
    estrelas: 5,
    texto: "Adorei o produto. Funcionou muito na minha pele. Estou muito contente e com toda certeza irei comprar mais produtos da marca. Que orgulhoooooooo! Arrasaram",
    avatar: "/images/Ellipse_22.png",
  },
  {
    id: 2,
    nome: "Selena Gomez",
    estrelas: 5,
    texto: "Não é por nada não, mas essa garota arrasa",
    avatar: "/images/Ellipse_21.png",
  },
  {
    id: 3,
    nome: "Michael B. Jordan",
    estrelas: 5,
    texto: "Simplesmente incrível, recomendo demais para todo mundo!",
    avatar: "/images/Ellipse_21.png",
  },
];

const MEDIA = 4.75;
const POR_PAGINA = 15;
const TOTAL_PAGINAS = 5;

function fmt(v: number) {
  return `R$${v.toFixed(2).replace(".", ",")}`;
}

function Estrelas({ valor, size = 20 }: { valor: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const pct = Math.round(Math.min(Math.max(valor - idx, 0), 1) * 100);
        const clipId = `star-${size}-${idx}-${pct}`;
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

function CardProduto({ produto }: { produto: Produto }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      background: "#ffffff", borderRadius: 24, padding: 12,
      boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
      boxSizing: "border-box" as const, width: "100%",
    }}>
      <div style={{
        width: "100%", height: 170, background: "#ffffff",
        borderRadius: 18, position: "relative", overflow: "hidden", marginBottom: 12,
      }}>
        <Image
          src={produto.imagem}
          alt={produto.nome}
          fill
          sizes="200px"
          style={{ objectFit: "contain", padding: 10 }}
          unoptimized
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>{produto.nome}</span>
      <span style={{ fontSize: 13, fontWeight: 400, color: "#374151", marginTop: 2 }}>{fmt(produto.preco)}</span>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
        textTransform: "uppercase" as const, marginTop: 4,
        color: produto.disponivel ? "#6C3CF0" : "#EF4444",
      }}>
        {produto.disponivel ? "Disponível" : "Indisponível"}
      </span>
    </div>
  );
}

function HeroBanner() {
  return (
    <div style={{ position: "relative", width: "100%", height: 350, overflow: "hidden" }}>
      <Image src="/images/Rectangle_37.png" alt="Rare Beauty Banner" fill style={{ objectFit: "cover", objectPosition: "center 25%" }} priority unoptimized />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, zIndex: 10 }}>
        <button style={{ width: 42, height: 42, borderRadius: "50%", background: "#6C3CF0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button style={{ width: 42, height: 42, borderRadius: "50%", background: "#6C3CF0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, zIndex: 5 }}>
        <h1 style={{ margin: 0, fontSize: 64, fontWeight: 600, color: "#fff", letterSpacing: "-1px" }}>Rare Beauty</h1>
        <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 300, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>beleza</p>
        <Estrelas valor={MEDIA} size={22} />
      </div>
      <p style={{ position: "absolute", bottom: 20, right: 32, margin: 0, fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.85)", zIndex: 5 }}>by Selena Gomez</p>
    </div>
  );
}

function ProdutosDestaque() {
  return (
    <section style={{ background: "#F5F0E8", padding: "40px 52px 20px" }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 700, color: "#000", display: "flex", alignItems: "baseline", gap: 8 }}>
        Produtos <span style={{ fontSize: 14, fontWeight: 400, color: "#7F7F7F" }}>melhor avaliados</span>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
        {PRODUTOS_DESTAQUE.map((p) => <CardProduto key={p.id} produto={p} />)}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section style={{ background: "#0D0E0D", padding: "52px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 36 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#fff" }}>Reviews e Comentários</h2>
        <p style={{ margin: 0, fontSize: 76, fontWeight: 300, color: "#fff", lineHeight: 1 }}>{MEDIA.toFixed(2)}</p>
        <Estrelas valor={MEDIA} size={28} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={{ background: "none", border: "none", color: "#A855F7", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>ver mais</button>
      </div>
      <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" as const }}>
        {REVIEWS.map((rv) => (
          <div key={rv.id} style={{ flexShrink: 0, width: 460, background: "#fff", borderRadius: 24, padding: 24, display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <Image src={rv.avatar} alt={rv.nome} fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>{rv.nome}</p>
                <Estrelas valor={rv.estrelas} size={15} />
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: "#4B5563", lineHeight: 1.5 }}>{rv.texto}</p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button style={{ background: "none", border: "none", color: "#A855F7", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>ver mais</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GradeProdutos() {
  const [pagina, setPagina] = useState(1);
  const inicio = (pagina - 1) * POR_PAGINA;
  const itens = TODOS_PRODUTOS.slice(inicio, inicio + POR_PAGINA);

  function irPara(n: number) {
    if (n < 1 || n > TOTAL_PAGINAS) return;
    setPagina(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section style={{ background: "#F5F0E8", padding: "40px 52px 64px" }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 700, color: "#000", display: "flex", alignItems: "baseline", gap: 8 }}>
        Produtos <span style={{ fontSize: 14, fontWeight: 400, color: "#7F7F7F" }}>de rare beauty</span>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
        {itens.map((p) => <CardProduto key={p.id} produto={p} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 48 }}>
        <button onClick={() => irPara(pagina - 1)} disabled={pagina === 1}
          style={{ background: "none", border: "none", cursor: pagina === 1 ? "default" : "pointer", display: "flex", alignItems: "center", opacity: pagina === 1 ? 0.25 : 1, color: "#000" }}>
          <svg width="10" height="16" viewBox="0 0 8 14" fill="none">
            <polyline points="7 1 1 7 7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {Array.from({ length: TOTAL_PAGINAS }, (_, idx) => idx + 1).map((n) => (
          <button key={n} onClick={() => irPara(n)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, fontFamily: "inherit", fontWeight: pagina === n ? 700 : 400, color: pagina === n ? "#000" : "#A3A3A3", padding: "0 4px" }}>
            {n}
          </button>
        ))}
        <button onClick={() => irPara(pagina + 1)} disabled={pagina === TOTAL_PAGINAS}
          style={{ background: "none", border: "none", cursor: pagina === TOTAL_PAGINAS ? "default" : "pointer", display: "flex", alignItems: "center", opacity: pagina === TOTAL_PAGINAS ? 0.25 : 1, color: "#000" }}>
          <svg width="10" height="16" viewBox="0 0 8 14" fill="none">
            <polyline points="1 1 7 7 1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default function Loja() {
  return (
    <main className={spartan.className}>
      <HeroBanner />
      <ProdutosDestaque />
      <ReviewsSection />
      <GradeProdutos />
    </main>
  );
}