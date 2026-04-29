// @ts-nocheck
import { collection, addDoc, getDocs, query, where, Timestamp, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addTransaction = async (userId: string, descricao: string, valor: number, tipo: string, categoria: string, carteira: string, dataManual: string) => {
  try {
    const docRef = await addDoc(collection(db, "transacoes"), {
      userId,
      descricao,
      valor,
      tipo,
      categoria,
      carteira,
      data: Timestamp.fromDate(new Date(dataManual + "T12:00:00")),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) { throw error; }
};

export const updateTransaction = async (id: string, dados: any) => {
  try {
    const docRef = doc(db, "transacoes", id);
    await updateDoc(docRef, {
      ...dados,
      data: Timestamp.fromDate(new Date(dados.data + "T12:00:00")),
      updatedAt: Timestamp.now()
    });
  } catch (error) { throw error; }
};

export const deleteTransaction = async (id: string) => {
  try {
    await deleteDoc(doc(db, "transacoes", id));
  } catch (error) { throw error; }
};

export const getUserTransactions = async (userId: string) => {
  try {
    const q = query(collection(db, "transacoes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a: any, b: any) => b.data.toMillis() - a.data.toMillis());
  } catch (error) { throw error; }
};

