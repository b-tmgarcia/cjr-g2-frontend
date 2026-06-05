"use client";
 
import Image from "next/image";
import { useState, useRef } from "react";
 
export default function ModalEditarPerfil() {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
 
  return (
    <div className="relative bg-[#EBEBEB] rounded-3xl w-[340px] px-8 py-8 flex flex-col items-center gap-4 shadow-xl">
 
      {/* Botão fechar */}
      <button className="absolute top-4 right-5 text-black text-2xl font-light hover:opacity-70 transition">
        ✕
      </button>
 
      {/* Foto de perfil — área clicável */}
      <div
        className="relative mt-2 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {/* Círculo da foto */}
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-white">
          {preview ? (
            <img
              src={preview}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src="/images/Ellipse 1.png"
              alt="Foto de perfil"
              width={100}
              height={100}
              loading="eager"
              className="object-cover w-full h-full"
            />
          )}
        </div>
 
        {/* Ícone câmera — apenas visual, NÃO clicável */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black rounded-full w-9 h-9 flex items-center justify-center border-2 border-[#EBEBEB] pointer-events-none"
        >
          <Image
            src="/images/camera.png"
            alt="Alterar foto"
            width={18}
            height={18}
            style={{ filter: "invert(1)" }}
          />
        </div>
 
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFotoChange}
        />
      </div>
 
      {/* Espaço extra por causa do ícone câmera que desce abaixo do círculo */}
      <div className="h-2" />
 
      {/* Campos */}
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
 
      {/* Botões */}
      <div className="w-full flex flex-col gap-3 mt-1">
        <button className="w-full border border-red-500 text-red-500 font-semibold text-sm rounded-full py-3 hover:bg-red-50 transition duration-200">
          Deletar conta
        </button>
        <button className="w-full border border-[#6A38F3] text-[#6A38F3] font-semibold text-sm rounded-full py-3 hover:bg-[#6A38F3]/10 transition duration-200">
          Alterar senha
        </button>
        <button
          onClick={() => console.log({ nome, username, email, preview })}
          className="w-full bg-[#6A38F3] hover:bg-[#5229d4] text-white font-semibold text-base rounded-full py-3 transition duration-200"
        >
          Salvar
        </button>
      </div>
 
    </div>
  );
}

