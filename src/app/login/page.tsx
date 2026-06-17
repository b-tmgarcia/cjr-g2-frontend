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
    <div style={{ minHeight: '100vh', backgroundColor: '#F4EFDE', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Container Base da Tela do Figma (1440px de largura centralizado) */}
            <div style={{ width: '1440px', margin: '0 auto', backgroundColor: '#F6F3E4', position: 'relative', zIndex: 1 }}>

        
        {/* LOGO 
            Figma: width 421, height 267, top -45px, left 105px */}
        <div style={{ position: 'absolute', width: '421px', height: '267px', top: '-0px', left: '105px', zIndex: 10 }}>
          <Image
            src="/images/logo_stock_login.png"
            alt="Stock.io logo"
            width={421}
            height={267}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* MASCOTE 
            Figma: width 512.55, height 1118.5, top 222px, left 105px */}
        <div style={{ position: 'absolute', width: '512.55px', height: '1118.5px', top: '222px', left: '105px', zIndex: 5 }}>
          <Image
            src="/images/Mascote_tela_de_login.png"
            alt="Mascote Stock.io"
            width={513}
            height={1119}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* CAIXA PRETA DE LOGIN 
            Figma: width 654, height 1068, top 111px, left 701px */}
        <div style={{
          position: 'absolute',
          width: '654px',
          height: '1068px',
          top: '111px',
          left: '701px',
          backgroundColor: '#141414',
          borderRadius: '48px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 10
        }}>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* BEM VINDO DE VOLTA 
                Figma: width 475, height 31, top 223px (em relação à tela, logo dentro da caixa preta fica 223 - 111 = 112px), left 790px (na caixa: 790 - 701 = 89px) */}
            <h1 style={{
              position: 'absolute',
              top: '112px',
              left: '89px',
              width: '475px',
              height: '31px',
              color: '#F4EFDE',
              fontSize: '2rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.05em',
              margin: 0,
              textAlign: 'center'
            }}>
              BEM VINDO DE VOLTA!
            </h1>

            {/* INPUT - EMAIL 
                Figma: width 504, height 48, top 314px (na caixa: 314 - 111 = 203px), left 776px (na caixa: 776 - 701 = 75px) */}
            <div style={{ position: 'absolute', top: '203px', left: '75px', width: '504px', height: '48px' }}>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                style={{
                  width: '504px',
                  height: '48px',
                  padding: '0 28px',
                  borderRadius: '72px',
                  backgroundColor: '#F4EFDE',
                  color: '#141414',
                  fontSize: '1.1rem',
                  border: errors.email ? '2px solid #ef4444' : 'none',
                  outline: 'none',
                }}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '11px', position: 'absolute', bottom: '-20px', left: '20px', margin: 0 }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* INPUT - SENHA 
                Figma: width 504, height 48, top 392px (na caixa: 392 - 111 = 281px), left 776px (na caixa: 776 - 701 = 75px) */}
            <div style={{ position: 'absolute', top: '281px', left: '75px', width: '504px', height: '48px' }}>
              <input
                {...register('password')}
                type="password"
                placeholder="Senha"
                style={{
                  width: '504px',
                  height: '48px',
                  padding: '0 28px',
                  borderRadius: '72px',
                  backgroundColor: '#F4EFDE',
                  color: '#141414',
                  fontSize: '1.1rem',
                  border: errors.password ? '2px solid #ef4444' : 'none',
                  outline: 'none',
                }}
              />
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: '11px', position: 'absolute', bottom: '-20px', left: '20px', margin: 0 }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ESQUECEU A SENHA 
                Figma: top 470px (na caixa: 470 - 111 = 359px), left 937px (na caixa: 937 - 701 = 236px) */}
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              style={{
                position: 'absolute',
                top: '359px',
                left: '236px',
                width: '183px',
                height: '20px',
                background: 'none',
                border: 'none',
                color: '#F4EFDE',
                opacity: 0.6,
                fontSize: '16px', // <--- Aumentado aqui!
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                cursor: 'pointer',
                textAlign: 'right',
                padding: 0
              }}
            >
              Esqueceu sua senha?
            </button>

            {/* BOTÃO ENTRAR 
                Figma: width 504, height 52, top 520px (na caixa: 520 - 111 = 409px), left 776px (na caixa: 776 - 701 = 75px) */}
            <button
              type="submit"
              disabled={loading}
              style={{
                position: 'absolute',
                top: '409px',
                left: '75px',
                width: '504px',
                height: '52px',
                borderRadius: '76px',
                backgroundColor: '#6f4dff',
                color: '#F4EFDE',
                fontSize: '1.25rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(111, 77, 255, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? "Entrando..." : "ENTRAR"}
            </button>

            {/* TEXTO CADASTRE-SE 
                Figma: width 373, height 23, top 602px (na caixa: 602 - 111 = 491px), left 776px (na caixa: 776 - 701 = 75px) */}
            <div style={{
              position: 'absolute',
              top: '491px',
              left: '75px',
              width: '504px', // <--- Aumentei o limite da caixa para garantir que não quebre de jeito nenhum
              height: '23px',
              color: '#F4EFDE',
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: 300,
              fontSize: '21px', // <--- Diminuído levemente para alinhar em uma linha só
              lineHeight: '100%',
              letterSpacing: '0%',
              whiteSpace: 'nowrap' // <--- Impede o navegador de quebrar a linha por segurança
            }}>
              Não possui uma conta?{' '}
              <a
                href="/register"
                style={{
                  color: '#6f4dff',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s'
                }}
              >
                Cadastre-se
              </a>
            </div>
          </form>
        </div>

      </div>

      {/* Modal de Reset de Senha (Mantido por fora com overlay) */}
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