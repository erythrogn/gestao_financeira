"use client";

import { useState } from "react";
import { GoogleLogo, Envelope, Lock, UserPlus, SignIn, CircleNotch } from "@phosphor-icons/react";
import { loginWithGoogle, registerWithEmail, loginWithEmail } from "@/lib/auth-service";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      window.location.href = "/dashboard";
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      // agora o erro exato vai pular na sua tela
      alert(`erro do firebase (google): ${error.code} \n\n ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      window.location.href = "/dashboard";
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      // agora o erro exato vai pular na sua tela
      alert(`erro do firebase (e-mail): ${error.code} \n\n ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1a1d27] border border-[#2e3148] rounded-2xl p-8 shadow-2xl">
      <div className="flex gap-4 mb-8 border-b border-[#2e3148] pb-4">
        <button 
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLogin ? 'text-[#6c63ff]' : 'text-[#94a3b8] hover:text-white'}`}
        >
          <SignIn size={20} /> entrar
        </button>
        <button 
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${!isLogin ? 'text-[#6c63ff]' : 'text-[#94a3b8] hover:text-white'}`}
        >
          <UserPlus size={20} /> cadastrar
        </button>
      </div>

      <div className="transition-opacity duration-300">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isLogin ? "bem-vindo de volta" : "crie sua conta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={20} />
            <input 
              type="email" 
              required
              placeholder="seu e-mail"
              className="w-full bg-[#222534] text-white border border-[#2e3148] rounded-xl py-3 pl-12 pr-4 focus:border-[#6c63ff] outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={20} />
            <input 
              type="password" 
              required
              placeholder="sua senha"
              className="w-full bg-[#222534] text-white border border-[#2e3148] rounded-xl py-3 pl-12 pr-4 focus:border-[#6c63ff] outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#6c63ff] hover:bg-[#5b54e0] text-white font-bold py-3 rounded-xl transition-transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <CircleNotch size={20} className="animate-spin" /> : null}
            {isLogin ? "entrar" : "finalizar cadastro"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#2e3148]"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1a1d27] px-2 text-[#64748b]">ou continue com</span></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#e2e8f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <CircleNotch size={24} className="animate-spin" /> : <GoogleLogo size={24} weight="bold" />}
          google
        </button>
      </div>
    </div>
  );
}