"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "../services/api";

interface LojaParaEditar {
  id: number;
  nome: string;
  descricao?: string;
  logo_url?: string;
  banner_url?: string;
  sticker_url?: string;
}

interface ModalEditarLojaProps {
  isOpen: boolean;
  onClose: () => void;
  loja: LojaParaEditar | null;
  onSuccess: () => void;
}

function urlFoto(url?: string) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `http://localhost:3001${url}`;
}

export default function ModalEditarLoja({ isOpen, onClose, loja, onSuccess }: ModalEditarLojaProps) {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [stickerPreview, setStickerPreview] = useState<string | null>(null);

  const [logoArquivo, setLogoArquivo] = useState<File | null>(null);
  const [bannerArquivo, setBannerArquivo] = useState<File | null>(null);
  const [stickerArquivo, setStickerArquivo] = useState<File | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const stickerInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  useEffect(() => {
    if (loja && isOpen) {
      setNome(loja.nome || "");
      setDescricao(loja.descricao || "");
      setLogoPreview(urlFoto(loja.logo_url));
      setBannerPreview(urlFoto(loja.banner_url));
      setStickerPreview(urlFoto(loja.sticker_url));
      setLogoArquivo(null);
      setBannerArquivo(null);
      setStickerArquivo(null);
      setConfirmandoExclusao(false);
    }
  }, [loja, isOpen]);

  const handleImagemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (v: string) => void,
    setArquivo: (f: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setArquivo(file);
    }
  };

  const uploadSeNecessario = async (arquivo: File | null, urlAtual: string | undefined): Promise<string | undefined> => {
    if (!arquivo) return urlAtual;
    const formData = new FormData();
    formData.append("file", arquivo);
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url_imagem;
  };

  const handleSalvar = async () => {
    if (!loja) return;
    if (!nome) {
      toast.error("O nome da loja é obrigatório.");
      return;
    }

    try {
      setLoading(true);

      const [logo_url, banner_url, sticker_url] = await Promise.all([
        uploadSeNecessario(logoArquivo, loja.logo_url),
        uploadSeNecessario(bannerArquivo, loja.banner_url),
        uploadSeNecessario(stickerArquivo, loja.sticker_url),
      ]);

      await api.patch(`/lojas/${loja.id}`, {
        nome,
        descricao,
        logo_url,
        banner_url,
        sticker_url,
      });

      toast.success("Loja atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao atualizar a loja.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!loja) return;

    try {
      setLoading(true);
      await api.delete(`/lojas/${loja.id}`);
      toast.success("Loja excluída com sucesso!");
      onClose();
      router.push("/feed");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao excluir a loja.");
    } finally {
      setLoading(false);
      setConfirmandoExclusao(false);
    }
  };

  if (!isOpen || !loja) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-[#EBEBEB] rounded-3xl w-[480px] max-h-[90vh] overflow-y-auto px-10 py-7 flex flex-col gap-4 shadow-xl">

        <button onClick={onClose} className="absolute top-4 right-5 hover:opacity-70 transition">
          <Image src="/images/image_16.png" alt="Fechar" width={18} height={18} />
        </button>

        <h2 className="text-center font-spartan font-normal text-[28px] leading-none text-black mt-1">
          Editar Loja
        </h2>

        {/* Banner — imagem larga */}
        <div
          onClick={() => bannerInputRef.current?.click()}
          className="border-2 border-dashed border-[#6A38F3] rounded-xl h-32 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#6A38F3]/5 transition overflow-hidden relative"
        >
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <Image src="/images/ri_camera-fill.png" alt="Câmera" width={36} height={36} />
              <p className="text-gray-500 font-spartan font-light text-[13px]">Banner da loja</p>
            </>
          )}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImagemChange(e, setBannerPreview, setBannerArquivo)}
          />
        </div>

        {/* Logo e Sticker — lado a lado */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => logoInputRef.current?.click()}
            className="border-2 border-dashed border-[#6A38F3] rounded-xl aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#6A38F3]/5 transition overflow-hidden relative"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <Image src="/images/ri_camera-fill.png" alt="Câmera" width={28} height={28} />
                <p className="text-gray-500 font-spartan font-light text-[12px]">Logo</p>
              </>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImagemChange(e, setLogoPreview, setLogoArquivo)}
            />
          </div>

          <div
            onClick={() => stickerInputRef.current?.click()}
            className="border-2 border-dashed border-[#6A38F3] rounded-xl aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#6A38F3]/5 transition overflow-hidden relative"
          >
            {stickerPreview ? (
              <img src={stickerPreview} alt="Sticker" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <Image src="/images/ri_camera-fill.png" alt="Câmera" width={28} height={28} />
                <p className="text-gray-500 font-spartan font-light text-[12px]">Sticker</p>
              </>
            )}
            <input
              ref={stickerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImagemChange(e, setStickerPreview, setStickerArquivo)}
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Nome da loja"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-white rounded-full px-5 py-3.5 text-gray-700 font-spartan font-light text-[15px] outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
        />

        <textarea
          placeholder="Descrição da loja"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className="w-full bg-white rounded-2xl px-5 py-3.5 text-gray-700 font-spartan font-light text-[15px] outline-none focus:ring-2 focus:ring-[#6A38F3]/40 resize-none"
        />

        <button
          onClick={handleSalvar}
          disabled={loading}
          className="w-full bg-[#6A38F3] hover:bg-[#5229d4] disabled:opacity-60 text-white font-spartan font-semibold text-[15px] rounded-full py-3 transition duration-200"
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>

        {!confirmandoExclusao ? (
          <button
            onClick={() => setConfirmandoExclusao(true)}
            disabled={loading}
            className="w-full bg-transparent border-2 border-red-500 hover:bg-red-50 disabled:opacity-60 text-red-500 font-spartan font-semibold text-[15px] rounded-full py-3 transition duration-200"
          >
            Excluir loja
          </button>
        ) : (
          <div className="flex flex-col gap-2 border-2 border-red-500 rounded-2xl p-4 bg-red-50">
            <p className="text-center text-red-600 font-spartan text-[14px]">
              Tem certeza? Essa ação não pode ser desfeita e todos os produtos da loja serão perdidos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmandoExclusao(false)}
                disabled={loading}
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-spartan text-[14px] rounded-full py-2.5 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluir}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-spartan text-[14px] rounded-full py-2.5 transition"
              >
                {loading ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}