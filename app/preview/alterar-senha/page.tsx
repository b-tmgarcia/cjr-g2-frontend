"use client";

import { useState } from "react";
import ModalAlterarSenha from "@/app/components/ModalAlterarSenha";

export default function PreviewAlterarSenha() {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <button
        onClick={() => setAberto(true)}
        className="px-6 py-3 bg-[#6A38F3] text-white font-semibold rounded-full hover:bg-[#5229d4] transition"
      >
        Alterar Senha
      </button>

      <ModalAlterarSenha
        isOpen={aberto}
        onClose={() => setAberto(false)}
        onBack={() => setAberto(false)}
        userId={1}
      />
    </div>
  );
}