import React, { useState } from "react";
import apiClient from '../apiClient'; // Importa o apiClient

const EditarEquipamentoModal = ({ equipamento, onClose, onAtualizado }) => {
  const [form, setForm] = useState({ ...equipamento });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { ...form };

    if (form.tipo === "Telefone") {
      data.processador = "";
      data.memoria_ram = "";
      data.disco = "";
    }

    try {
      await apiClient.put(`/api/equipamentos/${form.id}`, data);
      alert("Equipamento atualizado com sucesso!");
      onAtualizado();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar equipamento:", err);
      alert("Erro ao atualizar equipamento.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Equipamento</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="prd"
              placeholder="PRD"
              value={form.prd}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="Desktop">Desktop</option>
                <option value="Portátil">Portátil</option>
                <option value="Telefone">Telefone</option>
              </select>
            </div>

            <input
              name="marca_modelo"
              placeholder="Marca/Modelo"
              value={form.marca_modelo}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            {form.tipo !== "Telefone" && (
              <>
                <input
                  name="processador"
                  placeholder="Processador"
                  value={form.processador}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  name="memoria_ram"
                  placeholder="Memória RAM"
                  value={form.memoria_ram}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  name="disco"
                  placeholder="Disco"
                  value={form.disco}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Data de Aquisição</label>
              <input
                name="data_aquisicao"
                type="date"
                value={form.data_aquisicao?.slice(0, 10) || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Data de Garantia</label>
              <input
                name="garantia"
                type="date"
                value={form.garantia?.slice(0, 10) || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="estado"
                checked={form.estado === "manutencao"}
                onChange={(e) =>
                  setForm({ ...form, estado: e.target.checked ? "manutencao" : "operacional" })
                }
              />
              <label htmlFor="estado" className="text-sm">Está em manutenção?</label>
            </div>
          </div>

          <textarea
            name="observacoes"
            placeholder="Observações"
            value={form.observacoes || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows={3}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEquipamentoModal;
