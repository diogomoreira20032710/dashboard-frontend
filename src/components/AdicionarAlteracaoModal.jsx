import React, { useState } from "react";
import apiClient from '../apiClient'; // ajusta caminho se necessário

const AdicionarAlteracaoModal = ({ equipamentoId, onClose, onSucesso }) => {
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Usa apiClient que já tem baseURL configurada
      await apiClient.post("/api/alteracoes", {
        equipamento_id: equipamentoId,
        data,
        descricao,
      });
      onSucesso(); // para recarregar histórico
      onClose();   // fechar modal
    } catch (error) {
      console.error("Erro ao adicionar alteração:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Adicionar Alteração</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data da Alteração</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição da Alteração</label>
            <textarea
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-gray-600 hover:underline">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdicionarAlteracaoModal;
