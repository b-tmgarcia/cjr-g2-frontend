"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import api from '../services/api'; 
import { useRouter } from 'next/navigation'; 

type CadastroForm = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { register, handleSubmit, watch } = useForm<CadastroForm>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CadastroForm) => {
    setLoading(true);
    try {
      await api.post('/user', {
        nome: data.fullName,
        username: data.username,
        email: data.email,
        senha: data.password,
        foto_perfil_url: ""
      });

      alert('Conta criada com sucesso!');
      router.push('/login'); 
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      alert(error.response?.data?.message || 'Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F3EFE0] font-spartan overflow-hidden relative">
      
      {/* CARD DE CADASTRO - Colado na base inferior esquerda */}
      <div
        className="bg-[#191919] rounded-t-[40px] shadow-2xl z-10 flex flex-col absolute bottom-0"
        style={{
          width: '460px',
          height: '90vh',
          left: '8vw',
        }}
      >
        <h1 className="text-[32px] font-bold text-center mt-14 mb-10 text-white tracking-wide">
          CRIE SUA CONTA
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 px-10">
          {/* Inputs usam a mesma cor bege do fundo da tela */}
          <input
            {...register('fullName', { required: true })}
            type="text"
            placeholder="Nome Completo"
            className="w-full rounded-full border-none bg-[#F3EFE0] px-6 py-3.5 text-black placeholder-[#A3A3A3] focus:outline-none font-medium"
          />
          <input
            {...register('username', { required: true })}
            type="text"
            placeholder="Username"
            className="w-full rounded-full border-none bg-[#F3EFE0] px-6 py-3.5 text-black placeholder-[#A3A3A3] focus:outline-none font-medium"
          />
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Email"
            className="w-full rounded-full border-none bg-[#F3EFE0] px-6 py-3.5 text-black placeholder-[#A3A3A3] focus:outline-none font-medium"
          />
          
          <div className="relative">
            <input
              {...register('password', { required: 'Senha é obrigatória' })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              className="w-full rounded-full border-none bg-[#F3EFE0] px-6 py-3.5 text-black placeholder-[#A3A3A3] focus:outline-none font-medium pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-[#A3A3A3] text-xl"
            >
              {showPassword ? <VscEyeClosed /> : <VscEye />}
            </button>
          </div>

          <div className="relative">
            <input
              {...register('passwordConfirmation', {
                required: 'Confirme a senha',
                validate: (value) => value === watch('password') || 'As senhas não coincidem',
              })}
              type={showPasswordConfirmation ? 'text' : 'password'}
              placeholder="Confirmar Senha"
              className="w-full rounded-full border-none bg-[#F3EFE0] px-6 py-3.5 text-black placeholder-[#A3A3A3] focus:outline-none font-medium pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              className="absolute right-4 top-4 text-[#A3A3A3] text-xl"
            >
              {showPasswordConfirmation ? <VscEyeClosed /> : <VscEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#6A44FF] py-4 mt-8 font-bold text-white text-[17px] hover:bg-purple-700 transition-colors shadow-lg"
          >
            CRIAR CONTA
          </button>
        </form>

        {/* Texto "Já possui conta?" alinhado à esquerda como no modelo */}
        <div className="w-full px-12 mt-6 flex justify-start">
          <p className="text-white text-[15px] font-light">
            Já possui uma conta? <a href="/login" className="text-[#6A44FF] font-medium hover:underline">Login</a>
          </p>
        </div>
      </div>

      {/* LOGO STOCK.IO NO CANTO SUPERIOR DIREITO */}
      <div className="absolute top-[8%] right-[8%] pointer-events-none z-0">
        <Image
          src="/images/logo_stock.png"
          alt="logo"
          width={400}
          height={120}
          priority
          style={{ width: 'auto', height: 'auto' }} // Corrige o erro amarelo do console
        />
      </div>

      {/* MASCOTE - Ajustada e cortada na borda inferior direita */}
      <div className="absolute right-[5%] bottom-[-5%] pointer-events-none z-0">
        <Image
          src="/images/Mascote_menina.png"
          alt="mascote-cadastro"
          width={500} 
          height={650} 
          priority
          style={{ width: 'auto', height: '85vh', objectFit: 'contain' }} // Corrige erro e mantem proporção
        />
      </div>

    </div>
  );
}