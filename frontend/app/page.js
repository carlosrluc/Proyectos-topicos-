"use client";

import { useState } from "react";
import CodeBox from "../components/CodeBox";

export default function Page() {
  const [name, setName] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setOutput("");

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    setOutput(data.output);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Generador de Módulos 🚀
        </h1>

        <label className="text-lg font-semibold">Nombre del módulo</label>

        <input
          className="border border-gray-300 p-3 w-full rounded-lg mt-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Ej: casas, autos, alumnos…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={generate}
          className={`w-full p-3 rounded-lg text-white font-semibold transition-all ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generando..." : "Generar módulo"}
        </button>
      </div>

      {output && (
        <div className="mt-10 w-full max-w-3xl animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Resultado del generador:
          </h2>
          <CodeBox>{output}</CodeBox>
        </div>
      )}
    </div>
  );
}
