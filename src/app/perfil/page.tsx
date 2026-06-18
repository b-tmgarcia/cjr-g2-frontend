"use client";

import React from "react";
import { AiTwotoneMail } from "react-icons/ai";
import { BsFillPlusCircleFill } from "react-icons/bs";

interface Produto {
  id: number;
  nome: string;
  disponibilidade: boolean;
  price: number;
  imagem: string;
}

interface Loja {
  id: number;
  nome: string;
  imagem: string;
}

interface Avaliacao {
  id: number;
  produtoId: number;
  lojaId: number;
  rating: number;
  comentario: string;
}

export default function Perfil() {
  const [produtos] = React.useState<Produto[]>([
    { id: 1, nome: "Produto A", price: 29.99, disponibilidade: true, imagem: "/produto-a.png" },
    { id: 2, nome: "Produto B", price: 49.99, disponibilidade: false, imagem: "/produto-b.png" },
    { id: 3, nome: "Produto C", price: 19.99, disponibilidade: true, imagem: "/produto-c.png" }
  ]);

  const [lojas] = React.useState<Loja[]>([
    { id: 1, nome: "Loja A", imagem: "/loja-a.png" },
    { id: 2, nome: "Loja B", imagem: "/loja-b.png" },
    { id: 3, nome: "Loja C", imagem: "/loja-c.png" }
  ]);

  const [avaliacoes] = React.useState<Avaliacao[]>([
    { id: 1, produtoId: 1, lojaId: 1, rating: 4, comentario: "Ótimo produto!" },
    { id: 2, produtoId: 2, lojaId: 2, rating: 5, comentario: "Excelente serviço!" },
    { id: 3, produtoId: 3, lojaId: 3, rating: 3, comentario: "Produto razoável." }
  ]);

  return (
    <main className="relative z-10 bg-amber-50 mt-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-start gap-6 flex-1 min-w-0">
            <img
              src="/mascote-cadastro.png"
              alt="avatar"
              className="relative z-50 w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />

            <div className="pt-4 text-left min-w-0">
              <h1 className="text-4xl font-bold text-gray-900">Nome</h1>
              <p className="text-gray-500 mt-1">@instagram</p>
              <p className="text-gray-500 mt-2">
                <AiTwotoneMail className="inline mr-2" />
                email@domain.com
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 md:mt-0 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={() => (window.location.href = "#edit-profile")}
          >
            Editar Perfil
          </button>
        </div>

        <h2 className="mt-10 text-2xl font-semibold text-gray-900">Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{produto.nome}</h3>
              <p className="text-sm text-gray-500">
                {produto.disponibilidade ? "Disponível" : "Indisponível"}
              </p>
              <p className="mt-2 text-gray-900">R$ {produto.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-semibold text-gray-900">Lojas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {lojas.map((loja) => (
            <div key={loja.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900">{loja.nome}</h3>
              <img
                src={loja.imagem}
                alt={loja.nome}
                className="w-full h-auto rounded-lg mt-4"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => (window.location.href = "#add-store")}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border-4 border-purple-600 bg-purple-600 text-white shadow-lg hover:bg-purple-900 transition-colors"
          >
            <BsFillPlusCircleFill size={20} />
          </button>
        </div>

        <h2 className="mt-10 text-2xl font-semibold text-gray-900">Avaliações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Produto ID: {avaliacao.produtoId}
              </h3>
              <h4 className="text-md font-medium text-gray-700">Loja ID: {avaliacao.lojaId}</h4>
              <p className="mt-2 text-gray-600">{avaliacao.comentario}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

