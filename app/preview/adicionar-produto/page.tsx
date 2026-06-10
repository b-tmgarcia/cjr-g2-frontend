"use client";

import { useState } from "react";
import ModalAdicionarProduto from "@/app/components/ModalAdicionarProduto";
import Navbar from "@/app/components/navbar";

export default function PreviewAdicionarProduto() {
  const [aberto, setAberto] = useState(true);

  return (
    <>
          <Navbar/>
<div className="min-h-screen bg-white flex items-center justify-center">
      <ModalAdicionarProduto isOpen={aberto} onClose={() => setAberto(false)} />
        <div>HelLO wORLD</div>
    </div>
    </>
    
  );
}