"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartPieSlice, ArrowsLeftRight, SignOut, Cube, CalendarBlank } from "@phosphor-icons/react";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 h-screen bg-[#1a1d27] border-r border-[#2e3148] flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 text-white font-bold text-xl border-b border-[#2e3148]">
        <Cube weight="fill" className="text-[#6c63ff]" size={32} />
        dimen6
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2">
        <Link href="/dashboard" className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${pathname === '/dashboard' ? 'bg-[#6c63ff] text-white shadow-[0_0_15px_rgba(108,99,255,0.3)]' : 'text-[#94a3b8] hover:bg-[#222534] hover:text-white'}`}>
          <ChartPieSlice size={24} /> overview
        </Link>
        <Link href="/dashboard/transacoes" className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${pathname === '/dashboard/transacoes' ? 'bg-[#6c63ff] text-white shadow-[0_0_15px_rgba(108,99,255,0.3)]' : 'text-[#94a3b8] hover:bg-[#222534] hover:text-white'}`}>
          <ArrowsLeftRight size={24} /> transações
        </Link>
        <Link href="/dashboard/calendario" className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${pathname === '/dashboard/calendario' ? 'bg-[#6c63ff] text-white shadow-[0_0_15px_rgba(108,99,255,0.3)]' : 'text-[#94a3b8] hover:bg-[#222534] hover:text-white'}`}>
          <CalendarBlank size={24} /> calendário
        </Link>
      </nav>
      <div className="p-4 border-t border-[#2e3148]">
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full rounded-xl text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-colors">
          <SignOut size={24} /> sair
        </button>
      </div>
    </aside>
  );
}
