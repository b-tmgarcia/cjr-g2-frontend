export const stores = [
  {
    id: 1,
    nome: "Rare Beauty",
    categoria: "Beleza",
    banner: "/images/Rectangle_37.png",
    usuario: { 
      id: 1, 
      nome: "Selena Gomez", 
      email: "selena@rarebeauty.com" 
    },
    produtos: [
      { id: 1, nome: "Bronzer", preco: 254.99, disponivel: true, imagem: "/images/bronzer.png" },
      { id: 2, nome: "Blush", preco: 199.99, disponivel: false, imagem: "/images/blush.png" }
    ],
    avaliacoes_loja: [
      { id: 1, nota: 5, comentario: "Produtos incríveis!", usuario: { id: 2, nome: "Sofia" } }
    ]
  }
];