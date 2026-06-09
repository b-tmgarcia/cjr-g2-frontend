"use client";

import { useState } from "react";
import ModalAdicionarProduto from "@/app/components/ModalAdicionarProduto";

export default function PreviewAdicionarProduto() {
  const [aberto, setAberto] = useState(true);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <ModalAdicionarProduto isOpen={aberto} onClose={() => setAberto(false)} />
    </div>
  );
}