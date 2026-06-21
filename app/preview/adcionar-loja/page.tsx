"use client";

import { useRouter } from "next/navigation";
import ModalAdcionarLoja from "@/app/components/ModalAdcionarLoja";

export default function PreviewAdcionarLoja() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <ModalAdcionarLoja isOpen={true} onClose={() => router.push("/preview/tela-de-loja")} />
    </div>
  );
}
