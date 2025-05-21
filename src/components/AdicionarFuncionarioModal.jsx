import React, { useState, useEffect } from "react";
import apiClient from '../apiClient'; // importa o apiClient

const AdicionarFuncionarioModal = ({ onClose, onAdicionado }) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    departamento: "",
    cargo: "",
    equipamento_prd: "",
  });

  const [equipamentosLivres, setEquipamentosLivres] = useState([]);

  useEffect(() => {
    const fetchEquipamentosLivres = async () => {
      try {
        const res = await apiClient.get("/api/equipamentos/livres"); // usa o apiClient
        setEquipamentosLivres(res.data);
      } catch (err) {
        console.error("Erro ao buscar equipamentos livres:", err);
      }
    };

    fetchEquipamentosLivres();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/funcionarios", form); // usa o apiClient
      alert("Funcionário adicionado com sucesso!");
      onAdicionado();
      onClose();
    } catch (err) {
      console.error("Erro ao adicionar funcionário:", err);
      alert("Erro ao adicionar funcionário.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Funcionário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="departamento"
            placeholder="Departamento"
            value={form.departamento}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="cargo"
            placeholder="Cargo"
            value={form.cargo}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">Equipamento (opcional)</label>
            <select
              name="equipamento_prd"
              value={form.equipamento_prd}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">-- Nenhum equipamento --</option>
              {equipamentosLivres.map((equip) => (
                <option key={equip.id} value={equip.prd}>
                  {equip.prd} - {equip.marca_modelo}
                </option>
              ))}
            </select>
          </div>

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

export default AdicionarFuncionarioModal;
