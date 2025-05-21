import React from "react";

const Manual = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manual de Utilização</h2>

      {/* Botão de download */}
      <div className="mb-6">
        <a
          href="/manual.pdf"
          download
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📥 Fazer Download do Manual (PDF)
        </a>
      </div>

      {/* Visualização do manual */}
      <div className="border rounded-lg overflow-hidden shadow">
      <iframe
  src="/manual.pdf"
  title="Manual de Utilização"
  className="w-full min-h-screen"
/>

      </div>
    </div>
  );
};

export default Manual;
