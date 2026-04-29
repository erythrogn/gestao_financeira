"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, Warning } from "@phosphor-icons/react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={24} className="text-[#4ade80]" />,
    error: <XCircle size={24} className="text-[#f43f5e]" />,
    info: <Info size={24} className="text-[#38bdf8]" />,
    warning: <Warning size={24} className="text-[#fbbf24]" />,
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#1a1d27]/95 backdrop-blur-md border border-[#2e3148] p-4 rounded-2xl shadow-2xl min-w-[300px] ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
      {icons[type]}
      <span className="text-white text-sm font-medium">{message}</span>
    </div>
  );
}
