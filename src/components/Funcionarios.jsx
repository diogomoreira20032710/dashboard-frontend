import React, { useEffect, useState } from "react";
import apiClient from '../apiClient'; // importa o apiClient centralizado
import AdicionarFuncionarioModal from "./AdicionarFuncionarioModal";
import PainelDetalheFuncionario from "./PainelDetalheFuncionario";
import EditarFuncionarioModal from "./EditarFuncionarioModal";

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [mostrarAdicionarModal, setMostrarAdicionarModal] = useState(false);
  const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [abrirAnotacoes, setAbrirAnotacoes] = useState(false);

  const fetchFuncionarios = async () => {
    try {
      const res = await apiClient.get("/api/funcionarios");
      setFuncionarios(res.data);
    } catch (err) {
      console.error("Erro ao buscar funcionários:", err);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const funcionariosFiltrados = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    f.departamento.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const handleVerDetalhes = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setMostrarEditarModal(false);
    setAbrirAnotacoes(false);
  };

  const handleEditarFuncionario = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setMostrarEditarModal(true);
    setAbrirAnotacoes(false);
  };

  const handleAbrirAnotacoes = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setMostrarEditarModal(true);
    setAbrirAnotacoes(true);
  };

  const handleFecharPainel = () => {
    setFuncionarioSelecionado(null);
  };

  const handleFecharEditar = () => {
    setFuncionarioSelecionado(null);
    setMostrarEditarModal(false);
    setAbrirAnotacoes(false);
  };

  const handleEliminarFuncionario = async (funcionario) => {
    if (confirm(`Tem a certeza que deseja eliminar ${funcionario.nome}?`)) {
      try {
        await apiClient.delete(`/api/funcionarios/${funcionario.id}`);
        alert("Funcionário eliminado com sucesso!");
        fetchFuncionarios();
      } catch (err) {
        console.error("Erro ao eliminar funcionário:", err);
        alert("Erro ao eliminar funcionário.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pesquisa de Funcionários</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          placeholder="Nome, departamento..."
          className="w-full border px-4 py-2 rounded-md"
        />
        <button
          onClick={() => setMostrarAdicionarModal(true)}
          className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
        >
          + Adicionar Funcionário
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Departamento</th>
              <th className="px-4 py-2 text-left">Cargo</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">Nenhum funcionário encontrado.</td>
              </tr>
            ) : (
              funcionariosFiltrados.map((f) => (
                <tr key={f.id}>
                  <td className="px-4 py-2">{f.nome}</td>
                  <td className="px-4 py-2">{f.departamento}</td>
                  <td className="px-4 py-2">{f.cargo}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleVerDetalhes(f)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditarFuncionario(f)}
                      className="text-green-600 text-sm hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleAbrirAnotacoes(f)}
                      className="text-purple-600 text-sm hover:underline"
                    >
                      Anotações
                    </button>
                    <button
                      onClick={() => handleEliminarFuncionario(f)}
                      className="text-red-600 text-sm hover:underline"
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

      {mostrarAdicionarModal && (
        <AdicionarFuncionarioModal
          onClose={() => setMostrarAdicionarModal(false)}
          onAdicionado={fetchFuncionarios}
        />
      )}

      {mostrarEditarModal && funcionarioSelecionado && (
        <EditarFuncionarioModal
          funcionario={funcionarioSelecionado}
          onClose={handleFecharEditar}
          onAtualizado={fetchFuncionarios}
          abrirSecaoAnotacoes={abrirAnotacoes}
        />
      )}

      {funcionarioSelecionado && !mostrarEditarModal && (
        <PainelDetalheFuncionario
          funcionario={funcionarioSelecionado}
          onFechar={handleFecharPainel}
        />
      )}
    </div>
  );
};

export default Funcionarios;
