"use client";

import { useState, useEffect } from "react";
import { AiTwotoneMail } from "react-icons/ai";
import { BsFillPlusCircleFill } from "react-icons/bs";
import Navbar from "./navbar";
import ModalEditarPerfil from "./ModalEditarPerfil";
import ModalAdicionarProduto from "./ModalAdicionarProduto";
import ModalAdcionarLoja from "./ModalAdcionarLoja";
import { getUser } from "../services/users";

interface UsuarioPerfil {
  id: number;
  nome: string;
  username: string;
  email: string;
  foto_perfil_url?: string;
}

export default function Perfil({ userId }: { userId: number }) {
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [isAddProdutoOpen, setIsAddProdutoOpen] = useState(false);
  const [isAddLojaOpen, setIsAddLojaOpen] = useState(false);

  const carregarUsuario = async () => {
    try {
      const data = await getUser(userId);
      setUsuario(data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuario();
  }, [userId]);

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
    <>
      <Navbar />
      <main className="relative z-10 bg-amber-50 mt-24">
        <div className="container mx-auto px-6">

          {/* Cabeçalho do perfil */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-start gap-6 flex-1 min-w-0">
              <img
                src={usuario.foto_perfil_url || "/images/Ellipse 1.png"}
                alt="avatar"
                className="relative z-50 w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="pt-4 text-left min-w-0">
                <h1 className="text-4xl font-bold text-gray-900">{usuario.nome}</h1>
                <p className="text-gray-500 mt-1">@ {usuario.username}</p>
                <p className="text-gray-500 mt-2">
                  <AiTwotoneMail className="inline mr-2" />
                  {usuario.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 md:mt-0 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              onClick={() => setModalAberto(true)}
            >
              Editar Perfil
            </button>
          </div>

          {/* Produtos */}
          <div className="flex items-center justify-between mt-10">
            <h2 className="text-2xl font-semibold text-gray-900">Produtos</h2>
            <button
              type="button"
              onClick={() => setIsAddProdutoOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border-4 border-purple-600 bg-purple-600 text-white shadow-lg hover:bg-purple-900 transition-colors"
            >
              <BsFillPlusCircleFill size={20} />
            </button>
          </div>

          {/* Lojas */}
          <div className="flex items-center justify-between mt-10">
            <h2 className="text-2xl font-semibold text-gray-900">Lojas</h2>
            <button
              type="button"
              onClick={() => setIsAddLojaOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border-4 border-purple-600 bg-purple-600 text-white shadow-lg hover:bg-purple-900 transition-colors"
            >
              <BsFillPlusCircleFill size={20} />
            </button>
          </div>

          {/* Avaliações */}
          <div className="flex items-center justify-between mt-10 mb-10">
            <h2 className="text-2xl font-semibold text-gray-900">Avaliações</h2>
          </div>

        </div>
      </main>

      {/* Modais */}
      <ModalEditarPerfil
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={carregarUsuario}
        nomeAtual={usuario.nome}
        usernameAtual={usuario.username}
        emailAtual={usuario.email}
        fotoAtual={usuario.foto_perfil_url || ""}
        userId={userId}
      />

      {isAddProdutoOpen && (
        <ModalAdicionarProduto
          isOpen={isAddProdutoOpen}
          onClose={() => setIsAddProdutoOpen(false)}
          lojaId={0}
          onSuccess={() => setIsAddProdutoOpen(false)}
        />
      )}

      {isAddLojaOpen && (
        <ModalAdcionarLoja
          isOpen={isAddLojaOpen}
          onClose={() => setIsAddLojaOpen(false)}
        />
      )}
    </>
  );
}