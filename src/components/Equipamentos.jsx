import React, { useState, useEffect } from "react";
import apiClient from '../apiClient'; // importar o cliente axios com baseURL configurado
import PainelDetalheEquipamento from "./PainelDetalheEquipamento";
import AdicionarEquipamentoModal from "./AdicionarEquipamentoModal";
import EditarEquipamentoModal from "./EditarEquipamentoModal";

const Equipamentos = () => {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
  const [equipamentoParaEditar, setEquipamentoParaEditar] = useState(null);

  const fetchEquipamentos = async () => {
    try {
      const res = await apiClient.get("/api/equipamentos");
      setEquipamentos(res.data);
    } catch (err) {
      console.error("Erro ao buscar equipamentos:", err);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const handlePesquisa = (e) => setTermoPesquisa(e.target.value);
  const handleAbrirDetalhes = (equip) => setEquipamentoSelecionado(equip);
  const handleFecharDetalhes = () => setEquipamentoSelecionado(null);
  const handleAbrirEditar = (equip) => {
    setEquipamentoParaEditar(equip);
    setMostrarEditarModal(true);
  };
  const handleFecharEditar = () => setMostrarEditarModal(false);

  const handleEliminarEquipamento = async (id) => {
    if (window.confirm("Tem certeza de que deseja eliminar este equipamento?")) {
      try {
        await apiClient.delete(`/api/equipamentos/${id}`);
        alert("Equipamento eliminado com sucesso!");
        fetchEquipamentos();
      } catch (err) {
        console.error("Erro ao eliminar equipamento:", err);
        alert("Erro ao eliminar equipamento.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pesquisa de Equipamentos</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={termoPesquisa}
          onChange={handlePesquisa}
          placeholder="Pesquisar por PRD, tipo, marca..."
          className="w-full border px-4 py-2 rounded-md"
        />
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
        >
          + Adicionar Equipamento
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">PRD</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Marca/Modelo</th>
              <th className="px-4 py-2 text-left">RAM</th>
              <th className="px-4 py-2 text-left">Disco</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Funcionário</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Nenhum equipamento encontrado.
                </td>
              </tr>
            ) : (
              equipamentos.map((eq) => (
                <tr key={eq.id} className="border-t">
                  <td className="px-4 py-2">{eq.prd}</td>
                  <td className="px-4 py-2">{eq.tipo}</td>
                  <td className="px-4 py-2">{eq.marca_modelo}</td>
                  <td className="px-4 py-2">{eq.memoria_ram}</td>
                  <td className="px-4 py-2">{eq.disco}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        eq.estado === "manutencao"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {eq.estado === "manutencao" ? "Manutenção" : "Operacional"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{eq.funcionario_nome || "—"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleAbrirDetalhes(eq)}
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleAbrirEditar(eq)}
                      className="text-green-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarEquipamento(eq.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <AdicionarEquipamentoModal
          onClose={() => setMostrarModal(false)}
          onAdicionado={fetchEquipamentos}
        />
      )}

      {mostrarEditarModal && equipamentoParaEditar && (
        <EditarEquipamentoModal
          equipamento={equipamentoParaEditar}
          onClose={handleFecharEditar}
          onAtualizado={fetchEquipamentos}
        />
      )}

      {equipamentoSelecionado && (
        <PainelDetalheEquipamento
          equipamento={equipamentoSelecionado}
          onFechar={handleFecharDetalhes}
        />
      )}
    </div>
  );
};

export default Equipamentos;
