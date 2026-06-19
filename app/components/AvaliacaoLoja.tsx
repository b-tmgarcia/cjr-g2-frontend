"use client";

import { useState } from "react";
import { IoStarOutline } from "react-icons/io5";
import { IoStarSharp } from "react-icons/io5";

interface Loja {
  nome: string;
}

interface ModalAvaliacaoLojaProps {
  loja: Loja;
  onClose?: () => void;
  onSubmit?: (avaliacao: string) => void;
}

function ModalAvaliacaoLoja({ loja, onClose, onSubmit }: ModalAvaliacaoLojaProps) {
  const [avaliacao, setAvaliacao] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(avaliacao);
    }
    setAvaliacao("");
  };

  return (
    <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-t-2xl shadow-2xl p-8">
      <div className="relative bg-white rounded-3xl w-full px-8 py-8 flex flex-col items-stretch gap-6 shadow-2xl border border-gray-200">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-black text-2xl font-light hover:opacity-70 transition"
          aria-label="Fechar avaliação"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center font-semibold text-black text-lg w-full">
          Você está avaliando {loja.nome}
        </div>

        <div className="flex gap-3 justify-center w-full">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-[#fff701] text-[2.5rem] transition hover:scale-110 inline-flex items-center justify-center bg-transparent border-none p-0"
              aria-label={`Avaliar com ${star} estrela${star > 1 ? "s" : ""}`}
            >
              {rating >= star ? <IoStarSharp /> : <IoStarOutline />}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div className="w-full flex flex-col gap-3">
          <textarea
            value={avaliacao}
            onChange={(e) => setAvaliacao(e.target.value)}
            placeholder="Conte-nos sobre sua experiência"
            className="w-full min-h-27.5 bg-white rounded-10 px-5 py-3 text-gray-600 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40 resize-none border border-gray-300"
          />
        </div>

        {/* Botão enviar */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white rounded-full px-5 py-3 text-sm hover:bg-purple-700 transition-colors"
        >
          Avalie
        </button>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      {isOpen && (
        <ModalAvaliacaoLoja
          loja={{ nome: "Rare Beauty" }}
          onClose={() => setIsOpen(false)}
          onSubmit={(avaliacao) => console.log("Avaliação enviada:", avaliacao)}
        />
      )}
    </main>
  );
}