"use client";

import { useState } from "react";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";

interface ModalAvaliacaoLojaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; comentario: string }) => void;
  nomeLoja?: string;
}

export default function ModalAddAvaliacao({ isOpen, onClose, onSubmit, nomeLoja = "" }: ModalAvaliacaoLojaProps) {
  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ rating, comentario });
    }
    setComentario("");
    setRating(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-t-2xl shadow-2xl p-8">
        <div className="relative bg-white rounded-3xl w-full px-8 py-8 flex flex-col items-stretch gap-6 shadow-2xl border border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-black text-2xl font-light hover:opacity-70 transition"
          >
            ✕
          </button>

          <div className="text-center font-semibold text-black text-lg w-full">
            Você está avaliando {nomeLoja}
          </div>

          <div className="flex gap-3 justify-center w-full">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-[#fff701] text-[2.5rem] transition hover:scale-110 inline-flex items-center justify-center bg-transparent border-none p-0"
              >
                {rating >= star ? <IoStarSharp /> : <IoStarOutline />}
              </button>
            ))}
          </div>

          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Conte-nos sobre sua experiência"
            className="w-full h-32 bg-white rounded-xl px-5 py-3 text-gray-600 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40 resize-none border border-gray-300"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white rounded-full px-5 py-3 text-sm hover:bg-purple-700 transition-colors"
          >
            Avaliar
          </button>
        </div>
      </div>
    </div>
  );
}