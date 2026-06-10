"use client";
 
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import keyIcon from "@/public/images/uim_key-skeleton.png";
import vectorIcon from "@/public/images/Vector_112.png";
 
interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  userId: number;
}
 
export default function ModalAlterarSenha({
  isOpen,
  onClose,
  onBack,
  userId,
}: ModalAlterarSenhaProps) {
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
 
  if (!isOpen) return null;
 
  const handleSalvarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }
    try {
      setLoading(true);
      // TODO: chamar endpoint de alteração de senha quando disponível
      // await changePassword(userId, { senhaAntiga, novaSenha });
      console.log({ userId, senhaAntiga, novaSenha, confirmarSenha });
      toast.success("Senha alterada com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-[#EBEBEB] rounded-3xl w-[340px] px-8 py-8 flex flex-col items-center gap-5 shadow-xl">
 
        <button onClick={onBack} className="absolute top-5 left-5 hover:opacity-70 transition">
          <Image src={vectorIcon} alt="Voltar" width={12} height={20} />
        </button>
 
        <button onClick={onClose} className="absolute top-4 right-5 text-black text-2xl font-light hover:opacity-70 transition">
          ✕
        </button>
 
        <div className="mt-4">
          <Image src={keyIcon} alt="Alterar Senha" width={90} height={90} />
        </div>
 
        <div className="w-full flex flex-col gap-3">
          <input
            type="password"
            placeholder="Senha Antiga"
            value={senhaAntiga}
            onChange={(e) => setSenhaAntiga(e.target.value)}
            className="w-full bg-white rounded-full px-5 py-3 text-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
          />
          <input
            type="password"
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full bg-white rounded-full px-5 py-3 text-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full bg-white rounded-full px-5 py-3 text-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
          />
        </div>
 
        <button
          onClick={handleSalvarSenha}
          disabled={loading}
          className="w-full bg-[#6A38F3] hover:bg-[#5229d4] disabled:opacity-60 text-white font-semibold text-base rounded-full py-3 transition duration-200 mt-6"
        >
          {loading ? "Salvando..." : "Salvar Senha"}
        </button>
 
      </div>
    </div>
  );
}
