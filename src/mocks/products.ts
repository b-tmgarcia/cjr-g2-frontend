export interface Produto {
  src: string;
  nome: string;
  preco: string;
  disponivel: boolean;
  unidade?: string;
}

// Mocks do Feed
export const produtosMelhoresAvaliadosMock: Produto[] = [
  { src: '/images/prod_brownie_meio.png', nome: 'Brownie Meio A.',  preco: 'R$4,70',  disponivel: true  },
  { src: '/images/prod_brownie_trad.png', nome: 'Brownie Trad.',    preco: 'R$3,80',  disponivel: false },
  { src: '/images/prod_nozes.png',        nome: 'Nozes',            preco: 'R$29,99', disponivel: true,  unidade: '/kg' },
  { src: '/images/prod_banana.png',       nome: 'Banana',           preco: 'R$3,99',  disponivel: true,  unidade: '/kg' },
  { src: '/images/prod_limao.png',        nome: 'Limão Siciliano',  preco: 'R$17,99', disponivel: false, unidade: '/kg' },
];

export const produtosMaisBaratosMock: Produto[] = [
  { src: '/images/prod_limpador_facial.png', nome: 'Limpador Facial', preco: 'R$74,99',  disponivel: true  },
  { src: '/images/prod_blush.png',           nome: 'Blush',           preco: 'R$199,99', disponivel: false },
  { src: '/images/prod_serum.png',           nome: 'Sérum Facial',    preco: 'R$99,90',  disponivel: true  },
  { src: '/images/prod_iluminador.png',      nome: 'Iluminador',      preco: 'R$249,90', disponivel: true  },
  { src: '/images/prod_body_splash.png',     nome: 'Body Splash',     preco: 'R$179,99', disponivel: false },
];

export const produtosModaMock: Produto[] = [
  { src: '/images/prod_saia.png',          nome: 'Saia',        preco: 'R$75,99',  disponivel: true  },
  { src: '/images/prod_new_balance.png',   nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png',          nome: 'Bota',        preco: 'R$115,90', disponivel: true  },
  { src: '/images/prod_bolsa.png',         nome: 'Bolsa',       preco: 'R$349,90', disponivel: true  },
  { src: '/images/prod_saia.png',          nome: 'Saia Jeans',  preco: 'R$159,99', disponivel: false },
];

export const produtosRecentementeAdicionadosMock: Produto[] = [
  { src: '/images/prod_bolsa.png',         nome: 'Bolsa',       preco: 'R$349,90', disponivel: true  },
  { src: '/images/prod_blush.png',         nome: 'Blush',       preco: 'R$159,99', disponivel: false },
  { src: '/images/prod_saia.png',          nome: 'Saia',        preco: 'R$75,99',  disponivel: true  },
  { src: '/images/prod_new_balance.png',   nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png',          nome: 'Bota',        preco: 'R$115,90', disponivel: true  },
];

// Mocks da Categoria Específica
export const pagina1ProdutosMock: Produto[] = [
  { src: '/images/prod_Comp_Lenovo_Repiit.png', nome: 'Cabo USB', preco: 'R$16,90', disponivel: true },
  { src: '/images/prod_Comp_Samsung_Repiit.png', nome: 'Micro SD', preco: 'R$179,90', disponivel: true },
  { src: '/images/prod_Iphone15_Bersay.png', nome: 'Iphone 4', preco: 'R$469,99', disponivel: true },
  { src: '/images/prod_Smart_Tv_Philips_Repiit.png', nome: 'Playstation 5', preco: 'R$4.992,98', disponivel: true },
  { src: '/images/prod_Xbox_Series_X_Hobby.png', nome: 'Galaxy Z Fold', preco: 'R$13.999,99', disponivel: true },
  { src: '/images/prod_Mackbook_Air_Repiit.png', nome: 'Nintendo 3DS', preco: 'R$2.089,99', disponivel: false },
  { src: '/images/prod_Iphone_16.png', nome: 'Galaxy A06', preco: 'R$588,00', disponivel: false },
  { src: '/images/prod_serum.png', nome: 'Monitor', preco: 'R$ 988,00', disponivel: true },
  { src: '/images/prod_iluminador.png', nome: 'Teclado e mouse', preco: 'R$165,00', disponivel: true },
  { src: '/images/prod_body_splash.png', nome: 'Mouse', preco: 'R$81,00', disponivel: false },
  { src: '/images/prod_saia.png', nome: 'Smart TV Neo', preco: 'R$4.999,00', disponivel: false },
  { src: '/images/prod_new_balance.png', nome: 'Soundbar', preco: 'R$1.044,05', disponivel: false },
  { src: '/images/prod_bota.png', nome: 'Vitrola', preco: 'R$559,99', disponivel: true },
  { src: '/images/prod_bolsa.png', nome: 'Monitor', preco: 'R$1.199,00', disponivel: true },
  { src: '/images/prod_saia.png', nome: 'Smart TV', preco: 'R$1.699,99', disponivel: true },
];

export const pagina2ProdutosMock: Produto[] = [
  { src: '/images/prod_Comp_Lenovo_Repiit.png', nome: 'Comp. Lenovo', preco: 'R$3.899,99', disponivel: true },
  { src: '/images/prod_Comp_Samsung_Repiit.png', nome: 'Comp. Samsung', preco: 'R$8.549,99', disponivel: false },
  { src: '/images/prod_Iphone15_Bersay.png', nome: 'Iphone 15', preco: 'R$4.769,10', disponivel: true },
  { src: '/images/prod_Smart_Tv_Philips_Repiit.png', nome: 'Smart Tv Philips', preco: 'R$1.229,00', disponivel: true },
  { src: '/images/prod_Xbox_Series_X_Hobby.png', nome: 'Xbox Series X', preco: 'R$3.599,99', disponivel: true },
  { src: '/images/prod_Mackbook_Air_Repiit.png', nome: 'Macbook Air', preco: 'R$15.899,99', disponivel: true },
  { src: '/images/prod_Iphone_16.png', nome: 'Iphone 16', preco: 'R$4.598,99', disponivel: false },
  { src: '/images/prod_serum.png', nome: 'S25 Ultra', preco: 'R$5.769,10', disponivel: true },
  { src: '/images/prod_iluminador.png', nome: 'Ipad', preco: 'R$7.859,00', disponivel: true },
  { src: '/images/prod_body_splash.png', nome: 'Headset Gamer', preco: 'R$899,99', disponivel: false },
  { src: '/images/prod_saia.png', nome: 'Comp. Lenovo', preco: 'R$649,99', disponivel: false },
  { src: '/images/prod_new_balance.png', nome: 'Nintendo S. 2', preco: 'R$4.799,99', disponivel: false },
  { src: '/images/prod_bota.png', nome: 'Iphone 15', preco: 'R$4.089,10', disponivel: true },
  { src: '/images/prod_bolsa.png', nome: 'JBL', preco: 'R$1.399,00', disponivel: true },
  { src: '/images/prod_saia.png', nome: 'Xbox Series S', preco: 'R$1.499,99', disponivel: true },
];

export const produtosPorPaginaMock: { [key: number]: Produto[] } = {
  1: pagina1ProdutosMock,
  2: pagina2ProdutosMock,
  3: pagina1ProdutosMock, // Usando 1 como fallback conforme original
  4: pagina1ProdutosMock,
  5: pagina1ProdutosMock,
};

export const maisPopularesMock: Produto[] = [
  { src: '/images/prod_Comp_Lenovo_Repiit.png', nome: 'Comp. Lenovo', preco: 'R$3.899,99', disponivel: true },
  { src: '/images/prod_new_balance.png', nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png', nome: 'Bota', preco: 'R$115,90', disponivel: true },
  { src: '/images/prod_bolsa.png', nome: 'Bolsa', preco: 'R$349,90', disponivel: true },
  { src: '/images/prod_saia.png', nome: 'Saia Jeans', preco: 'R$159,99', disponivel: false },
];

export const recemAdicionadosMock: Produto[] = [
  { src: '/images/prod_bolsa.png', nome: 'Bolsa', preco: 'R$349,90', disponivel: true },
  { src: '/images/prod_blush.png', nome: 'Blush', preco: 'R$159,99', disponivel: false },
  { src: '/images/prod_saia.png', nome: 'Saia', preco: 'R$75,99',  disponivel: true },
  { src: '/images/prod_new_balance.png', nome: 'New Balance', preco: 'R$399,99', disponivel: false },
  { src: '/images/prod_bota.png', nome: 'Bota', preco: 'R$115,90', disponivel: true },
];
