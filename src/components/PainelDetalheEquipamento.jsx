import React, { useState, useEffect } from "react";
import apiClient from "../apiClient"; // Ajusta o caminho conforme a tua estrutura
import AdicionarAlteracaoModal from "./AdicionarAlteracaoModal";

const PainelDetalheEquipamento = ({ equipamento, onFechar }) => {
  const [alteracoes, setAlteracoes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [funcionarioAssociado, setFuncionarioAssociado] = useState(null);

  const fetchAlteracoes = async () => {
    try {
      const res = await apiClient.get(`/api/alteracoes/equipamento/${equipamento.id}`);
      setAlteracoes(res.data);
    } catch (err) {
      console.error("Erro ao buscar alterações:", err);
    }
  };

  const fetchFuncionarioAssociado = async () => {
    try {
      const res = await apiClient.get("/api/funcionarios");
      const associado = res.data.find(f => f.equipamento_prd === equipamento.prd);
      setFuncionarioAssociado(associado || null);
    } catch (err) {
      console.error("Erro ao buscar funcionário associado:", err);
    }
  };

  useEffect(() => {
    if (equipamento) {
      fetchAlteracoes();
      fetchFuncionarioAssociado();
    }
  }, [equipamento]);

  const handleSucessoAdicao = () => {
    fetchAlteracoes();
    setMostrarModal(false);
    alert("Alteração adicionada com sucesso!");
  };

  const handleRemoverAlteracao = async (id) => {
    if (confirm("Tem a certeza que deseja remover esta alteração?")) {
      try {
        await apiClient.delete(`/api/alteracoes/${id}`);
        fetchAlteracoes();
      } catch (err) {
        console.error("Erro ao remover alteração:", err);
        alert("Erro ao remover alteração.");
      }
    }
  };

  return (
    <div className="fixed right-0 top-0 w-[420px] h-full bg-white shadow-lg p-6 overflow-y-auto z-50">
      <button onClick={onFechar} className="text-gray-600 hover:text-black mb-4">X Fechar</button>

      <h3 className="text-lg font-bold mb-2">{equipamento.prd} – {equipamento.marca_modelo}</h3>

      <div className="text-sm space-y-1">
        <p><strong>Tipo:</strong> {equipamento.tipo}</p>
        <p><strong>Processador:</strong> {equipamento.processador}</p>
        <p><strong>Memória RAM:</strong> {equipamento.memoria_ram}</p>
        <p><strong>Disco:</strong> {equipamento.disco}</p>
        <p><strong>Data Aquisição:</strong> {equipamento.data_aquisicao}</p>
        <p><strong>Garantia até:</strong> {equipamento.garantia}</p>
        {equipamento.observacoes && <p><strong>Observações:</strong> {equipamento.observacoes}</p>}

        <p><strong>Funcionário Associado:</strong> {funcionarioAssociado ? funcionarioAssociado.nome : "Nenhum"}</p>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Histórico de Alterações</h4>
        {alteracoes.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma alteração encontrada.</p>
        ) : (
          <ul className="text-sm list-disc ml-4 space-y-1">
            {alteracoes.map((alt) => (
              <li key={alt.id} className="flex justify-between items-center">
                <span>
                  <span className="font-medium">{new Date(alt.data).toLocaleDateString()}:</span> {alt.descricao}
                </span>
                <button
                  onClick={() => handleRemoverAlteracao(alt.id)}
                  className="text-red-600 hover:underline text-xs ml-2"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setMostrarModal(true)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          + Adicionar Alteração
        </button>

        {mostrarModal && (
          <AdicionarAlteracaoModal
            equipamentoId={equipamento.id}
            onClose={() => setMostrarModal(false)}
            onSucesso={handleSucessoAdicao}
          />
        )}
      </div>
    </div>
  );
};

export default PainelDetalheEquipamento;
