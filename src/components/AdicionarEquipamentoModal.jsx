import React, { useState, useEffect } from "react";
import apiClient from '../apiClient'; // usa o apiClient com baseURL

const AdicionarEquipamentoModal = ({ onClose, onAdicionado }) => {
  const [form, setForm] = useState({
    prd: "",
    tipo: "",
    marca_modelo: "",
    processador: "",
    memoria_ram: "",
    disco: "",
    data_aquisicao: "",
    garantia: "",
    observacoes: "",
    funcionario_id: "",
  });

  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    apiClient.get("/api/funcionarios")
      .then((res) => setFuncionarios(res.data))
      .catch((err) => console.error("Erro ao buscar funcionários:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cria o objeto para enviar
    const data = { ...form };

    // Se for Telefone, remove campos que não se aplicam
    if (data.tipo === "Telefone") {
      delete data.processador;
      delete data.memoria_ram;
      delete data.disco;
    }

    try {
      await apiClient.post("/api/equipamentos", data);
      alert("Equipamento adicionado com sucesso!");
      onAdicionado();
      onClose();
    } catch (err) {
      console.error("Erro ao adicionar equipamento:", err);
      alert("Erro ao adicionar equipamento.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Equipamento</h2>
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

            {/* Mostrar apenas se não for Telefone */}
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
              <label className="block text-sm font-medium mb-1">Funcionário</label>
              <select
                name="funcionario_id"
                value={form.funcionario_id}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome} - {f.departamento}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Data de Aquisição</label>
              <input
                name="data_aquisicao"
                type="date"
                value={form.data_aquisicao}
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
                value={form.garantia}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>

          <textarea
            name="observacoes"
            placeholder="Observações"
            value={form.observacoes}
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdicionarEquipamentoModal;
