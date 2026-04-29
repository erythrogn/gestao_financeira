"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/sidebar";
import Toast from "@/components/toast";
import Tooltip from "@/components/tooltip";
import { PlusCircle, ListDashes, CircleNotch, Trash, PencilSimple, XCircle, Calendar, Wallet, Tag, ArrowsLeftRight } from "@phosphor-icons/react";
import { addTransaction, getUserTransactions, deleteTransaction, updateTransaction } from "@/lib/db-service";

export default function Transacoes() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [toast, setToast] = useState<{msg: string, type: "success" | "error"} | null>(null);
  
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [categoria, setCategoria] = useState("alimentação");
  const [carteira, setCarteira] = useState("conta corrente");
  const [dataGasto, setDataGasto] = useState(new Date().toISOString().split('T')[0]);
  
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categoriasDespesa = ["alimentação", "moradia", "transporte", "lazer", "saúde", "outros"];
  const categoriasReceita = ["salário", "freelance", "investimentos", "outros"];

  const carregarDados = async (uid: string) => {
    try {
      const dados = await getUserTransactions(uid);
      setTransacoes(dados);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) { window.location.href = "/"; } 
      else {
        setUser(currentUser);
        carregarDados(currentUser.uid);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setDescricao("");
    setValor("");
    setEditingId(null);
    setTipo("despesa");
    setCategoria("alimentação");
    setCarteira("conta corrente");
    setDataGasto(new Date().toISOString().split('T')[0]);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { descricao, valor: parseFloat(valor), tipo, categoria, carteira, data: dataGasto };
      if (editingId) {
        await updateTransaction(editingId, payload);
        setToast({ msg: "lançamento atualizado!", type: "success" });
      } else {
        await addTransaction(user.uid, descricao, parseFloat(valor), tipo, categoria, carteira, dataGasto);
        setToast({ msg: "lançamento salvo com sucesso!", type: "success" });
      }
      resetForm();
      await carregarDados(user.uid);
    } catch (error: any) {
      setToast({ msg: "erro ao processar dados", type: "error" });
    }
    setSaving(false);
  };

  const prepararEdicao = (t: any) => {
    setEditingId(t.id);
    setDescricao(t.descricao);
    setValor(t.valor.toString());
    setTipo(t.tipo);
    setCategoria(t.categoria);
    setCarteira(t.carteira);
    setDataGasto(new Date(t.data.toMillis()).toISOString().split('T')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = async (id: string) => {
    if (!confirm("confirmar exclusão?")) return;
    try {
      await deleteTransaction(id);
      setToast({ msg: "lançamento removido", type: "success" });
      carregarDados(user.uid);
    } catch {
      setToast({ msg: "erro ao excluir", type: "error" });
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-[#94a3b8]">carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">gerenciar transações</h1>
          {editingId && (
            <button onClick={resetForm} className="flex items-center gap-2 text-[10px] font-bold text-[#f43f5e] uppercase tracking-widest bg-[#f43f5e]/10 px-4 py-2 rounded-xl border border-[#f43f5e]/20 hover:bg-[#f43f5e]/20 transition-all">
              <XCircle size={18}/> cancelar edição
            </button>
          )}
        </header>

        <div className={`bg-[#1a1d27] border ${editingId ? 'border-[#fbbf24]' : 'border-[#2e3148]'} rounded-3xl p-8 mb-8 shadow-2xl transition-all`}>
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest">descrição</label>
              <input type="text" required value={descricao} onChange={(e) => setDescricao(e.target.value)} className="bg-[#222534] border border-[#2e3148] rounded-xl p-4 outline-none focus:border-[#6c63ff] transition-all" placeholder="ex: mensalidade nuvem" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest">valor (r$)</label>
              <input type="number" step="0.01" required value={valor} onChange={(e) => setValor(e.target.value)} className="bg-[#222534] border border-[#2e3148] rounded-xl p-4 outline-none focus:border-[#6c63ff] transition-all" placeholder="0,00" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest">data</label>
              <input type="date" required value={dataGasto} onChange={(e) => setDataGasto(e.target.value)} className="bg-[#222534] border border-[#2e3148] rounded-xl p-4 outline-none focus:border-[#6c63ff] [color-scheme:dark]" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest flex items-center gap-2"><Wallet size={14}/> carteira</label>
              <select value={carteira} onChange={(e) => setCarteira(e.target.value)} className="bg-[#222534] border border-[#2e3148] rounded-xl p-4 outline-none focus:border-[#6c63ff] capitalize">
                <option value="conta corrente">conta corrente</option>
                <option value="cartão de crédito">cartão de crédito</option>
                <option value="dinheiro vivo">dinheiro vivo</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest flex items-center gap-2"><ArrowsLeftRight size={14}/> tipo</label>
              <select value={tipo} onChange={(e) => {
                setTipo(e.target.value);
                setCategoria(e.target.value === "despesa" ? "alimentação" : "salário");
              }} className="bg-[#222534] border border-[#2e3148] rounded-xl p-4 outline-none focus:border-[#6c63ff]">
                <option value="despesa">despesa</option>
                <option value="receita">receita</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest flex items-center gap-2"><Tag size={14}/> categoria</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="bg-[#222534] border border-[#2e3148] rounded-xl p-4 outline-none focus:border-[#6c63ff] capitalize">
                {(tipo === "despesa" ? categoriasDespesa : categoriasReceita).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3 pt-4">
              <button type="submit" disabled={saving} className={`w-full ${editingId ? 'bg-[#fbbf24]' : 'bg-[#6c63ff]'} text-black font-black uppercase text-xs tracking-widest p-5 rounded-2xl transition-all active:scale-[0.98] flex justify-center items-center gap-3 shadow-xl shadow-black/20`}>
                {saving ? <CircleNotch size={24} className="animate-spin" /> : (editingId ? 'confirmar alterações' : 'adicionar transação')}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#1a1d27] border border-[#2e3148] rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 mb-8"><ListDashes size={24} className="text-[#6c63ff]" /><h2 className="text-sm font-bold uppercase tracking-widest">extrato financeiro detalhado</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-[#2e3148] text-[#94a3b8] text-[10px] uppercase font-bold tracking-widest"><th className="py-4 px-2">descrição</th><th className="py-4 px-2">detalhes</th><th className="py-4 px-2 text-right">valor</th><th className="w-24"></th></tr></thead>
              <tbody>{transacoes.map((t) => (
                <tr key={t.id} className="border-b border-[#2e3148]/30 hover:bg-[#222534]/50 transition-all group">
                  <td className="py-6 px-2 font-medium text-sm">{t.descricao}</td>
                  <td className="py-6 px-2">
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-[#64748b]">
                       <span className="flex items-center gap-1.5"><Calendar size={16}/> {new Date(t.data.toMillis()).toLocaleDateString('pt-br')}</span>
                       <span className="flex items-center gap-1.5 capitalize"><Wallet size={16}/> {t.carteira}</span>
                       <span className="flex items-center gap-1.5 capitalize bg-[#222534] px-2 py-1 rounded text-[#94a3b8]">{t.categoria}</span>
                    </div>
                  </td>
                  <td className={`py-6 px-2 text-right font-black text-base ${t.tipo === 'receita' ? 'text-[#4ade80]' : 'text-[#f43f5e]'}`}>
                    {t.tipo === 'despesa' ? '- ' : '+ '}{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                  </td>
                  <td className="py-6 px-2 text-right flex justify-end gap-1">
                    <Tooltip text="editar lançamento">
                      <button onClick={() => prepararEdicao(t)} className="p-2 text-[#94a3b8] hover:text-[#fbbf24] transition-all"><PencilSimple size={22}/></button>
                    </Tooltip>
                    <Tooltip text="excluir lançamento">
                      <button onClick={() => handleExcluir(t.id)} className="p-2 text-[#94a3b8] hover:text-[#f43f5e] transition-all"><Trash size={22}/></button>
                    </Tooltip>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </main>
    </div>
  );
}
