export interface Loja {
  src: string;
  nome: string;
  categoria: string;
}

export const lojasFeedMock: Loja[] = [
  { src: '/images/lojas_cjr.png',         nome: 'CJR',           categoria: 'mercado'      },
  { src: '/images/lojas_rare_beauty.png',  nome: 'Rare Beauty',   categoria: 'beleza'       },
  { src: '/images/lojas_the_croc.png',    nome: 'The Croc Brew', categoria: 'mercado'      },
  { src: '/images/lojas_mini_reno.png',    nome: 'Mini Reno',     categoria: 'casa'         },
  { src: '/images/lojas_amoca.png',       nome: 'amoca',         categoria: 'moda'         },
  { src: '/images/lojas_repliit.png',      nome: 'Repiit',        categoria: 'eletrônicos'  },
  { src: '/images/lojas_electree.png',     nome: 'electree',      categoria: 'eletrônicos'  },
  { src: '/images/lojas_abtec.png',        nome: 'abtec',         categoria: 'eletrônicos'  },
];

export const lojasCategoriaMock: Loja[] = [
  { src: '/images/lojas_abtec.png', nome: 'abtec', categoria: 'eletrônicos' },
  { src: '/images/lojas_repliit.png', nome: 'Repiit', categoria: 'eletrônicos' },
  { src: '/images/lojas_rare_beauty.png', nome: 'Bersay', categoria: 'eletrônicos' },
  { src: '/images/lojas_electree.png', nome: 'electree', categoria: 'eletrônicos' },
  { src: '/images/lojas_mini_reno.png', nome: 'Speed X', categoria: 'eletrônicos' },
  { src: '/images/lojas_amoca.png', nome: 'Next Computer', categoria: 'eletrônicos' },
];
