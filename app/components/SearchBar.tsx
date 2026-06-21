'use client';

import { useState, useRef, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { useRouter } from 'next/navigation';

export type SearchProduto = {
  id?: number | string;
  nome: string;
};

export function SearchBar({ produtos }: { produtos: SearchProduto[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredProdutos = produtos.filter((p) =>
    p.nome.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '603px' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        backgroundColor: 'white', borderRadius: showDropdown && searchTerm && filteredProdutos.length > 0 ? '24px 24px 0 0' : '9999px',
        padding: '0.65rem 1.25rem', width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        boxSizing: 'border-box'
      }}>
        <input 
          type="text" 
          placeholder="Procurar por..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#6A38F3', fontSize: '1rem' }} 
        />
        <CiSearch style={{ color: '#6A38F3', marginLeft: '0.5rem', fontSize: '1.2rem' }} />
      </div>

      {showDropdown && searchTerm && filteredProdutos.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 50,
          borderTop: '1px solid #f3f4f6'
        }}>
          {filteredProdutos.map((produto, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setShowDropdown(false);
                setSearchTerm('');
                if (produto.id) {
                  router.push(`/produto/${produto.id}`);
                }
              }}
              style={{
                padding: '12px 20px',
                cursor: 'pointer',
                color: '#4b5563',
                fontSize: '1rem',
                borderBottom: idx === filteredProdutos.length - 1 ? 'none' : '1px solid #f3f4f6'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              {produto.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
