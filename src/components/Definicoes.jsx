import React, { useState } from 'react';
import apiClient from '../apiClient'; // importa o apiClient que criaste

const Definicoes = () => {
  const [passwordAtual, setPasswordAtual] = useState('');
  const [novaPassword, setNovaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const token = localStorage.getItem('token');

  const guardarAlteracoes = async () => {
    setMensagem('');
    setErro('');

    if (!passwordAtual || !novaPassword || !confirmarPassword) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    if (novaPassword !== confirmarPassword) {
      setErro('As novas palavras-passe não coincidem.');
      return;
    }

    try {
      await apiClient.patch('/api/definicoes/password', {
        passwordAtual,
        novaPassword
      }, {
        headers: { Authorization: token }
      });

      setMensagem('✔ Palavra-passe atualizada com sucesso!');
      setPasswordAtual('');
      setNovaPassword('');
      setConfirmarPassword('');
    } catch (err) {
      setErro(err.response?.data?.error || '❌ Erro ao atualizar palavra-passe.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Alterar Palavra-passe</h2>

      <div>
        <label className="block font-semibold">Palavra-passe atual:</label>
        <input
          type="password"
          value={passwordAtual}
          onChange={e => setPasswordAtual(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Nova palavra-passe:</label>
        <input
          type="password"
          value={novaPassword}
          onChange={e => setNovaPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Confirmar nova palavra-passe:</label>
        <input
          type="password"
          value={confirmarPassword}
          onChange={e => setConfirmarPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={guardarAlteracoes}
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
      >
        Guardar Alterações
      </button>

      {mensagem && <p className="text-green-600 font-medium text-center">{mensagem}</p>}
      {erro && <p className="text-red-600 font-medium text-center">{erro}</p>}
    </div>
  );
};

export default Definicoes;
