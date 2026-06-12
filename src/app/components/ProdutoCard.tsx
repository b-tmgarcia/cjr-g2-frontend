'use client';

import Image from 'next/image';

export type Produto = {
  src: string;
  nome: string;
  preco: string;
  disponivel: boolean;
  unidade?: string;
};

export function ProdutoCard({ src, nome, preco, disponivel, unidade }: Produto) {
  return (
    <div style={{
      position: 'relative',
      minWidth: '228.68px', maxWidth: '228.68px', flexShrink: 0,
      width: '228.68px', height: '310px',
      borderRadius: '35px', backgroundColor: 'white',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    }}>
      <div style={{
        position: 'absolute', top: '7px', left: '19px',
        width: '190.24px', height: '190.24px',
        borderRadius: '12.81px', backgroundColor: 'white', overflow: 'hidden',
      }}>
        <Image src={src} alt={nome} width={190} height={190}
          style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
      </div>

      <p style={{
        position: 'absolute', top: '187px', left: '22px',
        width: '190px', height: '25px',
        fontWeight: 700, color: '#111827', fontSize: '0.95rem',
        margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {nome}
      </p>

      <p style={{
        position: 'absolute', top: '220px', left: '22.09px',
        width: '83px', height: '19px',
        fontWeight: 600, color: '#1f2937', fontSize: '0.9rem', margin: 0,
      }}>
        {preco}
        {unidade && (
          <span style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 400, marginLeft: '3px' }}>
            {unidade}
          </span>
        )}
      </p>

      <p style={{
        position: 'absolute', top: '247px', left: '22.09px',
        width: '82.85px', height: '13px',
        fontSize: '0.7rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        color: disponivel ? '#22c55e' : '#ca8a04', margin: 0,
      }}>
        {disponivel ? 'Disponível' : 'Indisponível'}
      </p>
    </div>
  );
}