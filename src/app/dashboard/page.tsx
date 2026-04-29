"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { TrendUp, TrendDown, ChartDonut, ChartBar, CreditCard, Bank, Money } from "@phosphor-icons/react";
import Sidebar from "@/components/sidebar";
import { getUserTransactions } from "@/lib/db-service";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [carteiras, setCarteiras] = useState<any[]>([]);
  
  const [dadosPizza, setDadosPizza] = useState<any[]>([]);
  const [dadosBarra, setDadosBarra] = useState<any[]>([]);

  const cores = ['#6c63ff', '#38bdf8', '#fbbf24', '#f472b6', '#a78bfa', '#4ade80'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      if (!currentUser) {
        window.location.href = "/";
      } else {
        setUser(currentUser);
        try {
          const transacoes = await getUserTransactions(currentUser.uid);
          
          const totalReceitas = transacoes.filter((t: any) => t.tipo === "receita").reduce((acc: number, t: any) => acc + t.valor, 0);
          const totalDespesas = transacoes.filter((t: any) => t.tipo === "despesa").reduce((acc: number, t: any) => acc + t.valor, 0);
          
          setReceitas(totalReceitas);
          setDespesas(totalDespesas);

          setDadosBarra([
            { nome: "receitas", valor: totalReceitas, fill: "#4ade80" },
            { nome: "despesas", valor: totalDespesas, fill: "#f43f5e" }
          ]);

          const despesasPorCategoria = transacoes
            .filter((t: any) => t.tipo === "despesa")
            .reduce((acc: any[], curr: any) => {
              const cat = curr.categoria || "outros";
              const existente = acc.find(x => x.name === cat);
              if (existente) {
                existente.value += curr.valor;
              } else {
                acc.push({ name: cat, value: curr.valor });
              }
              return acc;
            }, []);
          
          despesasPorCategoria.sort((a: any, b: any) => b.value - a.value);
          setDadosPizza(despesasPorCategoria);

          // calculo de saldo por carteira
          const saldosPorCarteira = transacoes.reduce((acc: any, curr: any) => {
            const cart = curr.carteira || "conta corrente";
            if (!acc[cart]) acc[cart] = 0;
            if (curr.tipo === "receita") acc[cart] += curr.valor;
            if (curr.tipo === "despesa") acc[cart] -= curr.valor;
            return acc;
          }, {});

          const arrayCarteiras = Object.keys(saldosPorCarteira).map(key => ({
            nome: key,
            saldo: saldosPorCarteira[key]
          }));
          
          setCarteiras(arrayCarteiras);

        } catch (error) {
          console.error("erro ao carregar saldos", error);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const renderIconeCarteira = (nome: string) => {
    if (nome === 'cartão de crédito') return <CreditCard size={20} />;
    if (nome === 'dinheiro vivo') return <Money size={20} />;
    return <Bank size={20} />;
  };

  if (loading) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-[#94a3b8]">carregando dimen6...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 overflow-hidden">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">meu painel</h1>
            <p className="text-[#94a3b8] mt-2">logado como: {user?.email}</p>
          </div>
          <div className="bg-[#1a1d27] border border-[#2e3148] px-6 py-3 rounded-2xl flex flex-col items-end shadow-lg">
            <span className="text-sm text-[#94a3b8]">saldo geral livre</span>
            <span className={`text-2xl font-bold ${receitas - despesas >= 0 ? 'text-white' : 'text-[#f43f5e]'}`}>
              {new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(receitas - despesas)}
            </span>
          </div>
        </header>

        {/* secao de carteiras */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {carteiras.length === 0 && (
            <div className="text-sm text-[#64748b] py-2">nenhuma carteira com movimentação ainda.</div>
          )}
          {carteiras.map(c => (
            <div key={c.nome} className="min-w-[220px] bg-[#222534] border border-[#2e3148] p-5 rounded-2xl flex flex-col gap-3 shadow-md">
              <div className="flex items-center gap-2 text-[#94a3b8]">
                {renderIconeCarteira(c.nome)}
                <span className="text-sm font-medium capitalize">{c.nome}</span>
              </div>
              <span className={`text-2xl font-bold ${c.saldo >= 0 ? 'text-white' : 'text-[#f43f5e]'}`}>
                {new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(c.saldo)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a1d27] border border-[#2e3148] p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 text-[#94a3b8] mb-6 border-b border-[#2e3148] pb-4">
              <ChartBar className="text-[#6c63ff]" size={24} />
              <h2 className="text-xl font-semibold text-white">fluxo do mês</h2>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarra} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="nome" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#222534' }}
                    contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2e3148', borderRadius: '12px', color: '#fff' }}
                    formatter={(value: any) => new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(value)}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1a1d27] border border-[#2e3148] p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 text-[#94a3b8] mb-6 border-b border-[#2e3148] pb-4">
              <ChartDonut className="text-[#6c63ff]" size={24} />
              <h2 className="text-xl font-semibold text-white">despesas por categoria</h2>
            </div>
            
            <div className="h-64 w-full flex items-center justify-center">
              {dadosPizza.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2e3148', borderRadius: '12px', color: '#fff' }}
                      formatter={(value: any) => new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(value)}
                    />
                    <Pie
                      data={dadosPizza}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {dadosPizza.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-[#64748b]">nenhuma despesa registrada.</p>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {dadosPizza.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cores[index % cores.length] }}></span>
                  <span className="capitalize">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


