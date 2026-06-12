'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login, forgotPassword } from '@/services/auth';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const data = await login(values.email, values.password);
      localStorage.setItem('token', data.token);
      toast.success("Login bem-sucedido! Redirecionando...");
      setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string | string[] } } };
      const message = axiosError.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join(", ") : message || "Erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Por favor insira seu email para redefinir a senha.");
      return;
    }
    try {
      const data = await forgotPassword(resetEmail);
      toast.success(data.message || "Email de recuperação enviado!");
      setShowResetModal(false);
      setResetEmail('');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Erro ao enviar email de recuperação");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4efde] flex justify-center overflow-x-hidden font-sans">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8 px-8 pb-8 pt-28 lg:pt-[27vh]">
        {/* Lado Esquerdo: Mascote e Logo */}
        <div className="relative flex flex-col items-center lg:w-[52%]">
          {/* LOGO: Menor, mais acima e à direita do mascote */}
          <div className="absolute -top-28 left-[62%] -translate-x-1/2 w-[240px] sm:w-[280px] lg:w-[320px] xl:w-[340px] z-0">
            <Image
              src="/images/logo_stock.png"
              alt="Stock.io logo"
              width={320}
              height={60}
              className="object-contain"
              priority
            />
          </div>

          <div className="relative z-10 mt-6 lg:mt-8 flex items-center justify-center">
            <Image
              src="/images/Mascote_menina.png"
              alt="Mascote Stock.io"
              width={520}
              height={1118}
              className="max-h-[92vh] object-contain"
              priority
            />
          </div>
        </div>

        {/* Lado Direito: Caixa Preta de Login */}
        <div className="bg-[#141414] w-full lg:max-w-[654px] rounded-t-[50px] lg:rounded-t-[72px] lg:min-h-[1068px] flex flex-col items-center px-14 lg:px-16 pt-32 lg:pt-36 pb-16 shadow-2xl">
          <div className="w-full max-w-[500px] flex flex-col items-center">
            {/* Título: Distante das bordas e dos outros elementos */}
            <h1 className="text-[#f4efde] text-2xl lg:text-[2.3rem] font-black uppercase tracking-tight mb-20 text-center">
              BEM VINDO DE VOLTA!
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-10">
              <div className="w-full relative px-6 sm:px-8">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  className={`w-full h-14 px-10 rounded-full bg-[#f4efde] text-[#141414] text-lg outline-none placeholder:text-gray-500 border-none transition-all ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#6f4dff]'}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] px-6 mt-1 absolute left-0 w-full text-center">{errors.email.message}</p>
                )}
              </div>

              <div className="w-full relative px-6 sm:px-8">
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Senha"
                  className={`w-full h-14 px-10 rounded-full bg-[#f4efde] text-[#141414] text-lg outline-none placeholder:text-gray-500 border-none transition-all ${errors.password ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#6f4dff]'}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-[10px] px-6 mt-1 absolute left-0 w-full text-center">{errors.password.message}</p>
                )}
              </div>

              <div className="w-full flex justify-center mb-16">
                <button
                  type="button"
                  className="text-[#f4efde] opacity-60 text-sm hover:opacity-100 transition-opacity underline underline-offset-4 text-center"
                  onClick={() => setShowResetModal(true)}
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-16 rounded-full bg-[#6f4dff] text-[#f4efde] text-xl font-black uppercase tracking-widest hover:bg-[#5b3cff] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl mb-14"
                disabled={loading}
              >
                {loading ? "Entrando..." : "ENTRAR"}
              </button>
            </form>

            <div className="text-center mt-6 pb-12">
              <p className="text-[#f4efde] opacity-60 text-sm lg:text-base">
                Não possui uma conta? <a href="/register" className="text-[#6f4dff] font-bold hover:underline ml-1">Cadastre-se</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Reset de Senha */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#f4efde] p-10 rounded-[40px] w-full max-w-md shadow-2xl">
            <h2 className="text-[#141414] text-2xl font-black mb-4 uppercase tracking-wider text-center">Recuperar Senha</h2>
            <p className="mb-8 text-center text-gray-600">Insira seu email para receber as instruções.</p>
            <form onSubmit={handleForgot} className="space-y-6">
              <input
                type="email"
                placeholder="Seu email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full h-14 px-8 rounded-full border border-gray-300 bg-white text-[#141414] outline-none focus:ring-2 focus:ring-[#6f4dff] transition-all"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 h-14 rounded-full border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-all"
                >
                  VOLTAR
                </button>
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-full bg-[#6f4dff] text-[#f4efde] font-bold hover:bg-[#5b3cff] transition-all shadow-md"
                >
                  ENVIAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
