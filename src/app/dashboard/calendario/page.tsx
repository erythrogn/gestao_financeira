"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/sidebar";
import { getUserTransactions } from "@/lib/db-service";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export default function Calendario() {
  const [loading, setLoading] = useState(true);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/";
      } else {
        const dados = await getUserTransactions(currentUser.uid);
        setTransacoes(dados);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  if (loading) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-[#94a3b8]">carregando calendário...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">agenda financeira</h1>
          <div className="flex items-center gap-4 bg-[#1a1d27] p-2 rounded-xl border border-[#2e3148]">
            <button onClick={prevMonth} className="p-2 hover:bg-[#222534] rounded-lg transition-colors"><CaretLeft size={20}/></button>
            <span className="font-bold min-w-[150px] text-center capitalize">
              {currentDate.toLocaleString('pt-br', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-[#222534] rounded-lg transition-colors"><CaretRight size={20}/></button>
          </div>
        </header>

        <div className="bg-[#1a1d27] border border-[#2e3148] rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 bg-[#222534] border-b border-[#2e3148]">
            {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(d => (
              <div key={d} className="py-4 text-center text-xs font-bold uppercase text-[#94a3b8] tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dateStr = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('pt-br') : null;
              const gastosDoDia = transacoes.filter(t => new Date(t.data.toMillis()).toLocaleDateString('pt-br') === dateStr);
              const totalDia = gastosDoDia.reduce((acc, curr) => curr.tipo === 'receita' ? acc + curr.valor : acc - curr.valor, 0);

              return (
                <div key={idx} className={`min-h-[120px] p-2 border-r border-b border-[#2e3148] transition-all hover:bg-[#222534]/50 ${day === null ? 'bg-[#0f1117]/30' : ''}`}>
                  {day && (
                    <div className="h-full flex flex-col">
                      <span className="text-sm font-bold text-[#64748b]">{day}</span>
                      <div className="mt-2 flex flex-col gap-1">
                        {gastosDoDia.slice(0, 2).map(g => (
                          <div key={g.id} className={`text-[10px] p-1 rounded truncate ${g.tipo === 'receita' ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-[#f43f5e]/10 text-[#f43f5e]'}`}>
                            {g.descricao}
                          </div>
                        ))}
                        {gastosDoDia.length > 2 && <span className="text-[10px] text-[#94a3b8]">+ {gastosDoDia.length - 2} itens</span>}
                      </div>
                      {totalDia !== 0 && (
                        <div className={`mt-auto pt-1 border-t border-[#2e3148] text-[10px] font-bold text-right ${totalDia > 0 ? 'text-[#4ade80]' : 'text-[#f43f5e]'}`}>
                          {new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalDia)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
