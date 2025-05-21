import React, { useEffect, useState } from "react";
import apiClient from "../apiClient"; // Ajusta o caminho conforme a tua estrutura
import { useNavigate } from "react-router-dom";

const PainelDetalheFuncionario = ({ funcionario, onFechar }) => {
  const [equipamentos, setEquipamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const res = await apiClient.get(`/api/funcionarios/${funcionario.id}/equipamentos`);
        setEquipamentos(res.data);
      } catch (err) {
        console.error("Erro ao buscar equipamentos associados:", err);
      }
    };

    fetchEquipamentos();
  }, [funcionario.id]);

  const handleVerEquipamento = (prd) => {
    navigate(`/dashboard/equipamentos?filtro=${encodeURIComponent(prd)}`);
  };

  const handleDesassociar = async (equipamentoId) => {
    if (window.confirm("Tem a certeza que deseja desassociar este equipamento?")) {
      try {
        await apiClient.delete(`/api/funcionarios/${funcionario.id}/equipamentos/${equipamentoId}`);
        setEquipamentos(equipamentos.filter((e) => e.id !== equipamentoId));
        alert("Equipamento desassociado com sucesso!");
      } catch (err) {
        console.error("Erro ao desassociar:", err);
        alert("Erro ao desassociar equipamento.");
      }
    }
  };

  return (
    <div className="fixed right-0 top-0 w-[420px] h-full bg-white shadow-lg p-6 overflow-y-auto z-50">
      <button onClick={onFechar} className="text-gray-600 hover:text-black mb-4">
        X Fechar
      </button>

      <h3 className="text-lg font-bold mb-4">Detalhes do Funcionário</h3>

      <div className="text-sm space-y-2">
        <p><strong>Nome:</strong> {funcionario.nome}</p>
        <p><strong>Email:</strong> {funcionario.email}</p>
        <p><strong>Departamento:</strong> {funcionario.departamento}</p>
        <p><strong>Cargo:</strong> {funcionario.cargo}</p>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Equipamentos Associados</h4>
        {equipamentos.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum equipamento associado.</p>
        ) : (
          equipamentos.map((equipamento) => (
            <div key={equipamento.id} className="bg-gray-100 p-3 rounded-md space-y-1 mb-3">
              <p><strong>PRD:</strong> {equipamento.prd}</p>
              <p><strong>Modelo:</strong> {equipamento.marca_modelo}</p>
              <p><strong>Tipo:</strong> {equipamento.tipo}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleVerEquipamento(equipamento.prd)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700"
                >
                  Ver Equipamento
                </button>
                <button
                  onClick={() => handleDesassociar(equipamento.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700"
                >
                  Desassociar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PainelDetalheFuncionario;
