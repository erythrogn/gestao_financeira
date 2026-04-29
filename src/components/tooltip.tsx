"use client";
import { ReactNode, useState } from "react";

export default function Tooltip({ text, children }: { text: string, children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#222534] border border-[#2e3148] text-white text-[10px] uppercase font-bold tracking-widest rounded-lg whitespace-nowrap shadow-xl animate-toast-in pointer-events-none z-50">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#2e3148]"></div>
        </div>
      )}
    </div>
  );
}
