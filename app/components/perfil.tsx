"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import Navbar from "./navbar";
import ModalEditarPerfil from "./ModalEditarPerfil";
import { getUser } from "../services/users";

interface UsuarioPerfil {
  id: number;
  nome: string;
  username: string;
  email: string;
  avatar?: string;
}

interface JwtPayload {
  userId: number;
}

export default function Perfil() {  // <-- sem props
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarUsuario = async (id: number) => {
    try {
      const data = await getUser(id);
      setUsuario(data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const { userId } = jwtDecode<JwtPayload>(token);
    carregarUsuario(userId);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
        Carregando perfil...
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
        Não foi possível carregar este perfil.
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      <Navbar />

      <div style={{ position: "relative", background: "#000", height: 230 }}>
        <button
          onClick={() => router.back()}
          style={{ position: "absolute", top: 24, left: 32, background: "none", border: "none", cursor: "pointer" }}
        >
          <svg width="14" height="22" viewBox="0 0 8 14" fill="none">
            <polyline points="7 1 1 7 7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div style={{
          position: "absolute", bottom: -55, left: 90,
          width: 130, height: 130, borderRadius: "50%",
          overflow: "hidden", border: "4px solid #F5F0E8",
        }}>
          <Image
            src={usuario.avatar || "/images/Ellipse 1.png"}
            alt={usuario.nome} // Ajustado para nome
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
      </div>

      <div style={{ padding: "70px 90px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111" }}>{usuario.nome}</h1> {/* Ajustado para nome */}
          <p style={{ margin: "4px 0 2px", fontSize: 14, color: "#4B5563" }}>@ {usuario.username}</p>
          <p style={{ margin: 0, fontSize: 14, color: "#4B5563" }}>✉ {usuario.email}</p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          style={{
            padding: "10px 28px", borderRadius: 30,
            background: "#6A38F3", color: "#fff", border: "none",
            cursor: "pointer", fontWeight: 600, fontSize: 15,
          }}
        >
          Editar Perfil
        </button>
      </div>

    <ModalEditarPerfil
  isOpen={modalAberto}
  onClose={() => setModalAberto(false)}
  onSuccess={() => {
    const token = localStorage.getItem("token")!;
    const { userId } = jwtDecode<JwtPayload>(token);
    carregarUsuario(userId);
  }}
  nomeAtual={usuario.nome}
  usernameAtual={usuario.username}
  emailAtual={usuario.email}
  fotoAtual={usuario.avatar || ""}
  userId={usuario.id}
/>
    </main>
  );
}