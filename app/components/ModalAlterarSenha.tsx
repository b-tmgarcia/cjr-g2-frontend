"use client";
 
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import keyIcon from "@/public/images/uim_key-skeleton.png";
import vectorIcon from "@/public/images/Vector_112.png";
import api from "../services/api"; // Instância do Axios
 
interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  userId: number; // 0 = Veio do Login | Maior que 0 = Veio do Perfil
}
 
export default function ModalAlterarSenha({
  isOpen,
  onClose,
  onBack,
  userId,
}: ModalAlterarSenhaProps) {
  const [email, setEmail] = useState("");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
 
  if (!isOpen) return null;

  // Define se o modal está se comportando como "Alterar Senha do Perfil" ou "Esqueci a Senha"
  const isModoPerfil = userId > 0;
 
  const handleSalvarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      toast.error("Por favor, preencha os campos de nova senha.");
      return;
    }
 
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }
 
    try {
      setLoading(true);
 
      if (isModoPerfil) {
        // --- MODO PERFIL (Logado com Senha Antiga) ---
        if (!senhaAntiga) {
          toast.error("Por favor, digite sua senha antiga.");
          return;
        }
 
        // Faz o PATCH direto na rota do NestJS usando o ID do usuário logado
        await api.patch(`/user/${userId}`, {
          senha: novaSenha
        });
 
      } else {
        // --- MODO LOGIN (Recuperação por Email) ---
        if (!email) {
          toast.error("Por favor, insira o seu e-mail.");
          return;
        }
 
        const responseUsers = await api.get("/user");
        const listaUsuarios = responseUsers.data;
 
        const usuarioEncontrado = listaUsuarios.find(
          (user: any) => user.email.toLowerCase() === email.toLowerCase()
        );
 
        if (!usuarioEncontrado) {
          toast.error("Nenhum usuário encontrado com este e-mail.");
          return;
        }
 
        await api.patch(`/user/${usuarioEncontrado.id}`, {
          senha: novaSenha
        });
      }
 
      toast.success("Senha alterada com sucesso!");
      
      // Limpa todos os campos para a próxima abertura
      setEmail("");
      setSenhaAntiga("");
      setNovaSenha("");
      setConfirmarSenha("");
      
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao alterar a senha.");
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
          
          {/* SE FOR MODO PERFIL: Mostra o input de Senha Antiga. SE NÃO: Mostra o de Email */}
          {isModoPerfil ? (
            <input
              type="password"
              placeholder="Senha Antiga"
              value={senhaAntiga}
              onChange={(e) => setSenhaAntiga(e.target.value)}
              className="w-full bg-white rounded-full px-5 py-3 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
            />
          ) : (
            <input
              type="email"
              placeholder="Seu Email Cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-full px-5 py-3 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
            />
          )}

          <input
            type="password"
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full bg-white rounded-full px-5 py-3 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
          />
          <input
            type="password"
            placeholder="Confirmar Nova Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full bg-white rounded-full px-5 py-3 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
          />
        </div>
 
        <button
          onClick={handleSalvarSenha}
          disabled={loading}
          className="w-full bg-[#6A38F3] hover:bg-[#5229d4] disabled:opacity-60 text-white font-semibold text-base rounded-full py-3 transition duration-200 mt-6"
        >
          {loading ? "Salvando..." : "Alterar Senha"}
        </button>
 
      </div>
    </div>
  );
}