"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

interface ModalAdcionarLojaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAdcionarLoja({ isOpen, onClose }: ModalAdcionarLojaProps) {
  const [arquivos, setArquivos] = useState<(File | null)[]>([null, null, null]);
  const [fotos, setFotos] = useState<(string | null)[]>([null, null, null]);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categoriaAberta, setCategoriaAberta] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);

  const handleFotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newArquivos = [...arquivos];
      newArquivos[index] = file;
      setArquivos(newArquivos);

      const newFotos = [...fotos];
      newFotos[index] = URL.createObjectURL(file);
      setFotos(newFotos);
    }
  };

  const [categoriasLista, setCategoriasLista] = useState<{id: number, nome: string}[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await api.get('/categorias');
        setCategoriasLista(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    }
    fetchCategorias();
  }, []);

  const handleAdicionar = async () => {
    if (!nome) {
      alert("Nome da loja é obrigatório.");
      return;
    }

    if (!categoriaId) {
      alert("Categoria da loja é obrigatória.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para criar uma loja.");
        return;
      }

      const decoded = jwtDecode<{ userId: number }>(token);
      
      const urls: (string | undefined)[] = [undefined, undefined, undefined];
      
      for (let i = 0; i < 3; i++) {
        if (arquivos[i]) {
          const formData = new FormData();
          formData.append('file', arquivos[i] as File);
          const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          urls[i] = response.data.url;
        }
      }

      const novaLoja = {
        usuario_id: decoded.userId,
        nome: nome,
        categoria_id: categoriaId,
        logo_url: urls[1],
        banner_url: urls[2],
        sticker_url: urls[0],
      };

      await api.post('/lojas', novaLoja);
      
      alert("Loja criada com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao criar a loja.");
    }
  };

  if (!isOpen) return null;

  const blocosImagem = [
    { label: "Anexe a foto de perfil de sua loja", index: 0 },
    { label: "Anexe a logo em SVG de sua loja", index: 1 },
    { label: "Anexe o banner de sua loja", index: 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto pt-6 pb-10">
      <div className="relative bg-[#EDEDED] rounded-[29px] w-[1020px] shrink-0 pt-[55px] pb-[55px] flex flex-col items-center shadow-xl mt-4">
        
        <button onClick={onClose} className="absolute top-[30px] right-[40px] hover:opacity-70 transition">
          <Image src="/images/simbolo_x_modal_criar_loja.png" alt="Fechar" width={24} height={24} />
        </button>

        <h2 className="text-center font-spartan font-bold text-[43px] leading-none text-black mb-[40px]">
          Adicionar loja
        </h2>

        <div className="w-[826px] flex flex-col gap-[23px]">
          <input
            type="text"
            placeholder="Nome da loja"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-white rounded-full h-[64px] px-8 text-gray-500 font-spartan font-light text-[18px] outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
          />

          <div className="relative">
            <button
              onClick={() => setCategoriaAberta(!categoriaAberta)}
              className="w-full bg-white rounded-full h-[64px] px-8 font-spartan font-light text-[18px] flex items-center justify-between outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
            >
              <span className={categoria ? "text-gray-700" : "text-gray-400"}>
                {categoria || "Categoria"}
              </span>
              <Image 
                src="/images/Vector_148.png" 
                alt="Abrir" 
                width={26} 
                height={10} 
                className={`transition-transform duration-200 object-contain ${categoriaAberta ? "rotate-180" : ""}`} 
              />
            </button>
            {categoriaAberta && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-lg z-10 overflow-hidden py-2 max-h-48 overflow-y-auto">
                {categoriasLista.length > 0 ? categoriasLista.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { 
                      setCategoria(cat.nome); 
                      setCategoriaId(cat.id);
                      setCategoriaAberta(false); 
                    }}
                    className="w-full text-left px-8 py-3 font-spartan font-light text-[18px] text-gray-700 hover:bg-[#6A38F3]/10 transition"
                  >
                    {cat.nome}
                  </button>
                )) : (
                  <div className="w-full text-left px-8 py-3 font-spartan font-light text-[18px] text-gray-500">
                    Nenhuma categoria encontrada
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[23px] mt-[6px]">
            {blocosImagem.map((bloco) => (
              <div
                key={bloco.index}
                onClick={() => inputRefs.current[bloco.index]?.click()}
                className="rounded-[10px] h-[177px] w-full flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#6A38F3]/5 transition"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%236A38F3' stroke-width='3' stroke-dasharray='30%2c 30' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")"
                }}
              >
                {fotos[bloco.index] ? (
                  <img src={fotos[bloco.index]!} alt={bloco.label} className="w-full h-full object-cover rounded-[8px]" />
                ) : (
                  <>
                    <Image src="/images/simbolo_importar_ad_loja.png" alt="Importar" width={46} height={57} />
                    <p className="text-black font-spartan font-light text-[22px] text-center">
                      {bloco.label}
                    </p>
                  </>
                )}
                <input
                  ref={(el) => { inputRefs.current[bloco.index] = el; }}
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleFotoChange(bloco.index, e)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdicionar}
          className="mt-[40px] w-[373px] h-[50px] bg-[#6A38F3] hover:bg-[#5229d4] text-white font-spartan font-normal text-[25px] rounded-full transition duration-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          Adicionar
        </button>

      </div>
    </div>
  );
}
