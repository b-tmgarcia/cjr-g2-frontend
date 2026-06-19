"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../services/api"; 

interface ModalAdicionarProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  lojaId: number;
  onSuccess: () => void;
}

export default function ModalAdicionarProduto({ isOpen, onClose, lojaId, onSuccess }: ModalAdicionarProdutoProps) {
  const [fotos, setFotos] = useState<(string | null)[]>([null, null, null, null]);
  const [nome, setNome] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [subcategoriaAberta, setSubcategoriaAberta] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState(13);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const handleFotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFotos = [...fotos];
      newFotos[index] = URL.createObjectURL(file);
      setFotos(newFotos);
    }
  };

  const handleAdicionar = async () => {
    if (!nome || !preco) {
      toast.error("O nome e o preço são obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      // Mapeamento simples para converter o nome da categoria em ID numérico
      const categoriaMap: Record<string, number> = {
        "Eletrônicos": 1,
        "Roupas": 2,
        "Alimentos": 3,
        "Acessórios": 4,
        "Outros": 5
      };

      const precoNumerico = parseFloat(preco.replace(",", "."));

      // PAYLOAD CORRIGIDO PARA BATER COM O BACKEND
      const payload = {
        nome,
        descricao,
        preco: precoNumerico,
        estoque,
        loja_id: lojaId, // Ajustado para loja_id (snake_case)
        categoria_id: categoriaMap[subcategoria] || 1, // Converte a string para ID
      };

      // Chamada da API
      await api.post("/produtos", payload);

      toast.success("Produto adicionado com sucesso!");
      
      // Limpeza dos estados
      setNome("");
      setDescricao("");
      setPreco("");
      setEstoque(13);
      setSubcategoria("");
      setFotos([null, null, null, null]);

      onSuccess(); 
      onClose(); 
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao adicionar o produto.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-[#EBEBEB] rounded-3xl w-[700px] max-h-[90vh] overflow-y-auto px-10 py-7 flex flex-col gap-4 shadow-xl">

        <button onClick={onClose} className="absolute top-4 right-5 hover:opacity-70 transition">
          <Image src="/images/image_16.png" alt="Fechar" width={18} height={18} />
        </button>

        <h2 className="text-center font-spartan font-normal text-[32px] leading-none text-black mt-1">
          Adicionar Produto
        </h2>

        <div
          onClick={() => inputRefs.current[0]?.click()}
          className="border-2 border-dashed border-[#6A38F3] rounded-xl py-7 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#6A38F3]/5 transition"
        >
          {fotos[0] ? (
            <img src={fotos[0]} alt="Foto principal" className="w-full h-28 object-cover rounded-lg" />
          ) : (
            <>
              <div className="relative inline-flex">
                <Image src="/images/ri_camera-fill.png" alt="Câmera" width={44} height={44} />
                <span className="absolute -bottom-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center text-[#6A38F3] font-bold text-xs leading-none border border-[#6A38F3]/20">
                  +
                </span>
              </div>
              <p className="text-gray-500 font-spartan font-light text-[15px]">Anexe as fotos do seu produto</p>
            </>
          )}
          <input
            ref={(el) => { inputRefs.current[0] = el; }}
            type="file" accept="image/*" className="hidden"
            onChange={(e) => handleFotoChange(0, e)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              onClick={() => inputRefs.current[i]?.click()}
              className="border-2 border-dashed border-[#6A38F3] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#6A38F3]/5 transition aspect-square"
            >
              {fotos[i] ? (
                <img src={fotos[i]!} alt={`Foto ${i}`} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="relative inline-flex">
                  <Image src="/images/ri_camera-fill.png" alt="Câmera" width={32} height={32} />
                  <span className="absolute -bottom-1 -right-1 bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[#6A38F3] font-bold text-[9px] leading-none border border-[#6A38F3]/20">
                    +
                  </span>
                </div>
              )}
              <input
                ref={(el) => { inputRefs.current[i] = el; }}
                type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFotoChange(i, e)}
              />
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-white rounded-full px-5 py-3.5 text-gray-400 font-spartan font-light text-[15px] outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
        />

        <div className="relative">
          <button
            onClick={() => setSubcategoriaAberta(!subcategoriaAberta)}
            className="w-full bg-white rounded-full px-5 py-3.5 font-spartan font-light text-[15px] flex items-center justify-between outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
          >
            <span className={subcategoria ? "text-gray-700" : "text-gray-400"}>
              {subcategoria || "Subcategoria"}
            </span>
            <Image src="/images/Vector_148.png" alt="Abrir" width={12} height={12} className={`transition-transform duration-200 ${subcategoriaAberta ? "rotate-180" : ""}`} />
          </button>
          {subcategoriaAberta && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg z-10 overflow-hidden">
              {["Eletrônicos", "Roupas", "Alimentos", "Acessórios", "Outros"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSubcategoria(cat); setSubcategoriaAberta(false); }}
                  className="w-full text-left px-5 py-2.5 font-spartan font-light text-[15px] text-gray-700 hover:bg-[#6A38F3]/10 transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          placeholder="Descrição do produto"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className="w-full bg-white rounded-2xl px-5 py-3.5 text-gray-400 font-spartan font-light text-[15px] outline-none focus:ring-2 focus:ring-[#6A38F3]/40 resize-none"
        />

        <input
          type="number"
          placeholder="Preço do produto"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full bg-white rounded-full px-5 py-3.5 text-gray-400 font-spartan font-light text-[15px] outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
        />

        <div className="flex items-center justify-center gap-6">
          <button onClick={() => setEstoque(Math.max(0, estoque - 1))}>
            <Image src="/images/diminuir.png" alt="Diminuir" width={44} height={44} />
          </button>
          <span className="font-spartan font-normal text-[48px] leading-none text-[#6A38F3] w-16 text-center">
            {estoque}
          </span>
          <button
            onClick={() => setEstoque(estoque + 1)}
            className="w-[44px] h-[44px] rounded-full border-2 border-[#6A38F3] flex items-center justify-center hover:bg-[#6A38F3]/10 transition"
          >
            <div className="relative w-3.5 h-3.5">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#6A38F3] -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[#6A38F3] -translate-x-1/2" />
            </div>
          </button>
        </div>

        <button
          onClick={handleAdicionar}
          disabled={loading}
          className="w-full bg-[#6A38F3] hover:bg-[#5229d4] disabled:opacity-60 text-white font-spartan font-semibold text-[15px] rounded-full py-3 transition duration-200"
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>

      </div>
    </div>
  );
}