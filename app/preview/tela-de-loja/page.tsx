"use client";

import Navbar from "@/app/components/navbar";
import Loja from "@/app/components/loja";

export default function LojaPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <Navbar />
      <Loja />
    </div>
  );
}