"use client";

import { useState } from "react";
import ModalAdcionarLoja from "@/app/components/ModalAdcionarLoja";

export default function PreviewAdcionarLoja() {
  const [aberto, setAberto] = useState(true);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <ModalAdcionarLoja isOpen={aberto} onClose={() => setAberto(false)} />
    </div>
  );
}
