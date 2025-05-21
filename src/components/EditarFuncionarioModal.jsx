import React, { useEffect, useState } from "react";
import apiClient from '../apiClient'; // Usa o apiClient para chamadas HTTP

const EditarFuncionarioModal = ({ funcionario, onClose, onAtualizado, abrirSecaoAnotacoes = false }) => {
  const [form, setForm] = useState({
    nome: funcionario.nome || "",
    email: funcionario.email || "",
    departamento: funcionario.departamento || "",
    cargo: funcionario.cargo || "",
  });

  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState([]);
  const [equipamentosAssociados, setEquipamentosAssociados] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [novaAnotacao, setNovaAnotacao] = useState("");

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const [todosEquip, relacoesFuncionario, equipamentosAssociados] = await Promise.all([
          apiClient.get("/api/equipamentos"),
          apiClient.get(`/api/funcionarios/${funcionario.id}/equipamentos`),
          apiClient.get("/api/funcionarios-equipamentos"),
        ]);

        const idsAssociadosAOutros = new Set(
          equipamentosAssociados.data
            .filter(rel => rel.funcionario_id !== funcionario.id)
            .map(rel => rel.equipamento_id)
        );

        const idsDoFuncionarioAtual = relacoesFuncionario.data.map(eq => eq.id);

        const equipamentosDisponiveis = todosEquip.data.filter(
          (eq) => !idsAssociadosAOutros.has(eq.id) || idsDoFuncionarioAtual.includes(eq.id)
        );

        setEquipamentosDisponiveis(equipamentosDisponiveis);
        setEquipamentosAssociados(idsDoFuncionarioAtual);
      } catch (err) {
        console.error("Erro ao buscar equipamentos:", err);
      }
    };

    const fetchAnotacoes = async () => {
      try {
        const res = await apiClient.get(`/api/anotacoes/funcionario/${funcionario.id}`);
        setAnotacoes(res.data);
      } catch (err) {
        console.error("Erro ao carregar anotações", err);
      }
    };

    fetchEquipamentos();
    fetchAnotacoes();
  }, [funcionario.id]);

  useEffect(() => {
    if (abrirSecaoAnotacoes) {
      setTimeout(() => {
        document.getElementById('anotacoesSecao')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [abrirSecaoAnotacoes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleEquipamento = (id) => {
    setEquipamentosAssociados((prev) =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Atualizar dados principais
      await apiClient.put(`/api/funcionarios/${funcionario.id}`, form);

      // Atualizar associação de equipamentos
      await apiClient.put(`/api/funcionarios/${funcionario.id}/equipamentos`, {
        equipamento_ids: equipamentosAssociados
      });

      alert("Funcionário atualizado com sucesso!");
      onAtualizado();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar funcionário:", err);
      alert("Erro ao atualizar funcionário.");
    }
  };

  const adicionarAnotacao = async () => {
    if (!novaAnotacao.trim()) return;
    try {
      const res = await apiClient.post("/api/anotacoes", {
        funcionario_id: funcionario.id,
        texto: novaAnotacao,
      });
      setAnotacoes([res.data, ...anotacoes]);
      setNovaAnotacao("");
    } catch (err) {
      console.error("Erro ao adicionar anotação", err);
      alert("Erro ao adicionar anotação.");
    }
  };

  const eliminarAnotacao = async (id) => {
    if (!window.confirm("Tem a certeza que deseja eliminar esta anotação?")) return;
    try {
      await apiClient.delete(`/api/anotacoes/${id}`);
      setAnotacoes(anotacoes.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erro ao eliminar anotação", err);
      alert("Erro ao eliminar anotação.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Editar Funcionário</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} className="border p-2 rounded w-full" required />

          <div>
            <label className="block text-sm font-medium mb-1">Equipamentos Associados</label>
            <div className="space-y-1 max-h-40 overflow-y-auto border rounded p-2">
              {equipamentosDisponiveis.map((eq) => (
                <label key={eq.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={equipamentosAssociados.includes(eq.id)}
                    onChange={() => toggleEquipamento(eq.id)}
                  />
                  {eq.prd} - {eq.marca_modelo}
                </label>
              ))}
            </div>
          </div>

          <hr className="my-4" />
          <h3 id="anotacoesSecao" className="text-lg font-semibold mb-2">Anotações</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto text-sm bg-gray-50 p-2 rounded">
            {anotacoes.length === 0 ? (
              <p className="text-gray-500 italic">Sem anotações.</p>
            ) : (
              anotacoes.map((a) => (
                <div key={a.id} className="border-b pb-1 flex justify-between items-start">
                  <span><strong>{new Date(a.data).toLocaleDateString()}:</strong> {a.texto}</span>
                  <button
                    onClick={() => eliminarAnotacao(a.id)}
                    className="text-red-500 text-xs ml-2 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
          <textarea
            value={novaAnotacao}
            onChange={(e) => setNovaAnotacao(e.target.value)}
            placeholder="Escrever nova anotação..."
            className="w-full mt-2 border px-3 py-2 rounded"
          ></textarea>
          <button
            type="button"
            onClick={adicionarAnotacao}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
          >
            Adicionar Anotação
          </button>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarFuncionarioModal;
