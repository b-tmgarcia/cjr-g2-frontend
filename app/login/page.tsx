'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';   //avisos de erro
import { login, forgotPassword } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      toast.success("Login bem-sucedido! Redirecionando...");
      setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join(", ") : message || "Erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: FormEvent) => {
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
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao enviar email de recuperação");
    }
  };

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  return (
    <>
      <Toaster position="top-right" />
      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4efde;
        }

        .login-card {
          display: grid;
          grid-template-columns: minmax(320px, 460px) minmax(340px, 520px);
          width: min(980px, 100%);
          min-height: calc(100vh - 48px);
          overflow: visible;
          background: transparent;
        }

        .hero-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4efde;
          padding: 36px 28px;
          border-radius: 56px 0 0 56px;
          overflow: hidden;
        }

        .hero-logo-bg {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          width: 421px;
          height: 267px;
          opacity: 0.22;
          filter: brightness(0.18) saturate(0.8);
          pointer-events: none;
          z-index: 0;
        }

        .hero-image {
          position: relative;
          width: 100%;
          max-width: 450px;
          height: auto;
          z-index: 1;
          object-fit: contain;
        }

        .form-panel {
          width: 100%;
          margin: 0;
          min-height: 100%;
          padding: 76px 40px 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          background: #141414;
          color: #f4f4f4;
          border-radius: 56px 56px 0 0;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .form-header h1 {
          margin: 0;
          font-size: 2.6rem;
          letter-spacing: 0.15em;
          color: #f4f4f4;
          text-transform: uppercase;
        }

        .form-header p {
          margin: 16px 0 36px;
          color: #bdbdbd;
          font-size: 0.98rem;
        }

        .form-content {
          display: grid;
          gap: 18px;
        }

        .field-group {
          display: grid;
          gap: 8px;
        }

        .text-input {
          width: 100%;
          padding: 18px 22px;
          border-radius: 999px;
          border: none;
          background: #f4f4e8;
          color: #232323;
          font-size: 1rem;
          outline: none;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
        }

        .text-input::placeholder {
          color: #9d9d9d;
        }

        .password-row {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-row .text-input {
          padding-right: 58px;
        }

        .eye-button {
          position: absolute;
          right: 18px;
          background: none;
          border: none;
          color: #777;
          font-size: 1.15rem;
          cursor: pointer;
        }

        .forgot-link {
          align-self: flex-start;
          background: none;
          border: none;
          color: #e3e3e3;
          font-size: 0.92rem;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          margin: 4px 0 16px;
        }

        .submit-button {
          width: 100%;
          padding: 18px 20px;
          border-radius: 999px;
          border: none;
          background: #6f4dff;
          color: white;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.18s ease, background 0.18s ease;
          box-shadow: 0 18px 30px rgba(111, 77, 255, 0.18);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #5b3cff;
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-line {
          margin-top: 28px;
          color: #d2d2d2;
          font-size: 0.95rem;
          text-align: left;
        }

        .register-line a {
          color: #7b4dff;
          text-decoration: none;
          font-weight: 700;
        }

        .register-line a:hover {
          text-decoration: underline;
        }

        @media (max-width: 980px) {
          .login-card {
            grid-template-columns: 1fr;
          }

          .hero-panel {
            padding: 28px;
            border-radius: 28px 28px 0 0;
          }

          .form-panel {
            padding: 40px 28px;
            border-radius: 0 0 28px 28px;
          }
        }

        @media (max-width: 650px) {
          .page-wrapper {
            padding: 24px 14px;
          }

          .form-header h1 {
            font-size: 2rem;
          }

          .form-header p {
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="login-card">
          <div className="hero-panel">
            <img
              src="/images/LOGO%20Stock.io%20(1).png"
              alt="Stock.io logo background"
              className="hero-logo-bg"
            />
            <img
              src="/images/StockLee%20-%20Mascote%20da%20Stock.io.png"
              alt="Mascote Stock.io"
              className="hero-image"
            />
          </div>

          <div className="form-panel">
            <div className="form-header">
              <h1>Bem vindo de volta!</h1>
              <p>Faça login para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="form-content">
              <div className="field-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label htmlFor="password">Senha</label>
                <div className="password-row">
                  <input
                    id="password"
                    type={passwordIsVisible ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-input"
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setPasswordIsVisible(!passwordIsVisible)}
                    aria-label="Mostrar senha"
                  >
                    {passwordIsVisible ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button type="button" className="forgot-link" onClick={() => setShowResetModal(true)}>
                Esqueceu sua senha?
              </button>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Entrando..." : "ENTRAR"}
              </button>
            </form>





            <p className="register-line">
              Não possui uma conta? <a href="/register">Cadastre-se</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
