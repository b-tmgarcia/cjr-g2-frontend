'use client';

import { ProdutoCard, type Produto } from './ProdutoCard';

export function SecaoProdutos({ titulo, subtitulo, produtos }: {
  titulo: string;
  subtitulo: string;
  produtos: Produto[];
}) {
  return (
    <section style={{ paddingTop: '1rem', width: '1300px' }}>
      <div style={{ paddingLeft: '100px', paddingRight: '65px', marginBottom: '1.25rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: 0 }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>{titulo}</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#6A38F3' }}>{subtitulo}</span>
        </h2>
      </div>

      <div style={{
        display: 'flex', gap: '32px', overflowX: 'auto',
        paddingLeft: '100px', paddingRight: '65px',
        height: '333px', paddingTop: '12px', paddingBottom: '12px',
        scrollbarWidth: 'none', boxSizing: 'border-box',
      }}>
        {produtos.map((p) => <ProdutoCard key={p.nome} {...p} />)}
      </div>
    </section>
  );
}