"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";



type CadastroForm = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default function cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CadastroForm>();

  const onSubmit = (data: CadastroForm) => console.log(data);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <div
        className="w-full max-w-md bg-black backdrop-blur-sm rounded-t-2xl shadow-2xl"
        style={{
          width: 600,
          height: 740,
          position: 'absolute',
          top: 90,
          left: 90,
          transform: 'rotate(0deg)',
          opacity: 1,
          overflow: 'hidden',
        }}
      >
        <h1 className="text-2xl font-bold text-center mt-10 mb-10 text-white">
          CRIE SUA CONTA
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6">
          <input
            {...register('fullName', { required: true })}
            type="text"
            placeholder="Nome Completo"
            className="w-full rounded-lg border bg-white px-4 py-3 text-black"
          />
          <input
            {...register('username', { required: true })}
            type="text"
            placeholder="Username"
            className="w-full rounded-lg border bg-white px-4 py-3 text-black"
          />
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border bg-white px-4 py-3 text-black"
          />
          <div className="relative">
            <input
              {...register('password', { required: 'Senha é obrigatória' })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              className="w-full rounded-lg border bg-white px-4 py-3 text-black pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 text-lg"
            >
              {showPassword ? <VscEyeClosed /> : <VscEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm">{String(errors.password.message)}</p>
          )}

          <div className="relative">
            <input
              {...register('passwordConfirmation', {
                required: 'Confirme a senha',
                validate: (value) => value === watch('password') || 'As senhas não coincidem',
              })}
              type={showPasswordConfirmation ? 'text' : 'password'}
              placeholder="Confirmar Senha"
              className="w-full rounded-lg border bg-white px-4 py-3 text-black pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              className="absolute right-3 top-3 text-gray-600 text-lg"
            >
              {showPasswordConfirmation ? <VscEyeClosed /> : <VscEye />}
            </button>
          </div>
          {errors.passwordConfirmation && (
            <p className="text-red-400 text-sm">{String(errors.passwordConfirmation.message)}</p>
          )}

          <button
            type="button"
            onClick={() => (window.location.href = '/login')}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white cursor-pointer"
          >
            CRIAR CONTA
          </button>
        </form>

        <h3 className="text-center text-white">Já possui conta? <button onClick={() => (window.location.href = '/login')} className="text-purple-600 hover:underline">Login</button></h3>
      </div>

      <div className= "flex items-center justify-center mt-60">      
      <Image
        src="/public/images/Mascote_menina.png"
        alt="mascote-cadastro"
        width={496.57}
        height={500}
        className="rounded-lg"
        style={{
          position: 'absolute',
          top: '214px',
          left: '850px',
          objectFit: 'cover',
          overflow: 'hidden',
        }}
      />
      </div>
      <div className= "flex items-center justify-center mt-20">
        <Image
        src="/public/images/logo_stock.png"
        alt="logo"
        width={400}
        height={350}
        className="rounded-lg"  
        style={{
          position: 'absolute',
          left: '900px',  
          top: '-24px',
          objectFit: 'contain',
        }}
      />
      </div>     
    </div>  
  );
}
