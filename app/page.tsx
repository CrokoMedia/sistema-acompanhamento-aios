export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          Sistema de Acompanhamento AIOS
        </h1>
        <p className="text-center text-lg">
          Plataforma de aprendizado interativa com mapa mental e AI Tutor
        </p>
        <div className="flex gap-4">
          <span className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            ✅ Next.js 14
          </span>
          <span className="px-4 py-2 bg-green-500 text-white rounded-lg">
            ✅ TypeScript
          </span>
          <span className="px-4 py-2 bg-purple-500 text-white rounded-lg">
            ✅ Tailwind CSS
          </span>
        </div>
      </div>
    </main>
  );
}
