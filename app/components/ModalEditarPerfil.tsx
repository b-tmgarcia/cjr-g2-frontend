"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import ModalAlterarSenha from "./ModalAlterarSenha";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function updateUser(
  userId: number,
  data: { name?: string; username?: string; email?: string }
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao atualizar usuário");
}

async function deleteUser(userId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Falha ao deletar usuário");
}

interface ModalEditarPerfilProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  nomeAtual?: string;
  usernameAtual?: string;
  emailAtual?: string;
  fotoAtual?: string;
}

export default function ModalEditarPerfil({
  isOpen,
  onClose,
  userId,
  nomeAtual = "",
  usernameAtual = "",
  emailAtual = "",
  fotoAtual,
}: ModalEditarPerfilProps) {
  const [nome, setNome] = useState(nomeAtual);
  const [username, setUsername] = useState(usernameAtual);
  const [email, setEmail] = useState(emailAtual);
  const [preview, setPreview] = useState<string | null>(fotoAtual || null);
  const [loading, setLoading] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSalvar = async () => {
    try {
      setLoading(true);
      await updateUser(userId, { name: nome, username, email });
      toast.success("Perfil atualizado com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async () => {
    if (!confirm("Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.")) return;
    try {
      await deleteUser(userId);
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      toast.error("Erro ao deletar conta.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative bg-[#EBEBEB] rounded-3xl w-[340px] px-8 py-8 flex flex-col items-center gap-4 shadow-xl">

          <button onClick={onClose} className="absolute top-4 right-5 text-black text-2xl font-light hover:opacity-70 transition">
            ✕
          </button>

          <div className="relative mt-2 cursor-pointer" onClick={() => inputRef.current?.click()}>
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-white">
              {preview ? (
                <img src={preview} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <Image src="/images/Ellipse 1.png" alt="Foto de perfil" width={100} height={100} className="object-cover w-full h-full" loading="eager" />
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black rounded-full w-9 h-9 flex items-center justify-center border-2 border-[#EBEBEB] pointer-events-none">
              <Image src="/images/camera.png" alt="Alterar foto" width={18} height={18} style={{ filter: "invert(1)" }} />
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
          </div>

          <div className="h-2" />

          <div className="w-full flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-white rounded-full px-5 py-3 text-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white rounded-full px-5 py-3 text-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-full px-5 py-3 text-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
            />
          </div>

          <div className="w-full flex flex-col gap-3 mt-1">
            <button
              onClick={handleDeletar}
              className="w-full border border-red-500 text-red-500 font-semibold text-sm rounded-full py-3 hover:bg-red-50 transition duration-200"
            >
              Deletar conta
            </button>
            <button
              onClick={() => setModalSenhaAberto(true)}
              className="w-full border border-[#6A38F3] text-[#6A38F3] font-semibold text-sm rounded-full py-3 hover:bg-[#6A38F3]/10 transition duration-200"
            >
              Alterar senha
            </button>
            <button
              onClick={handleSalvar}
              disabled={loading}
              className="w-full bg-[#6A38F3] hover:bg-[#5229d4] disabled:opacity-60 text-white font-semibold text-base rounded-full py-3 transition duration-200"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>

        </div>
      </div>

      <ModalAlterarSenha
        isOpen={modalSenhaAberto}
        onClose={() => { setModalSenhaAberto(false); onClose(); }}
        onBack={() => setModalSenhaAberto(false)}
        userId={userId}
      />
    </>
  );
}