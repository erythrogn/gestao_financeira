import AuthCard from "@/components/auth-card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0f1117] p-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">dimen6</h1>
        <p className="text-[#94a3b8] mt-2">gestão financeira profissional</p>
      </div>
      <AuthCard />
    </main>
  );
}
