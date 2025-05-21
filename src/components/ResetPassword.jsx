import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';  // importa aqui

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const validarPassword = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;
    return regex.test(senha);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    if (!validarPassword(newPassword)) {
      setMessage('A nova senha deve ter pelo menos 9 caracteres, incluindo maiúsculas, minúsculas, números e um símbolo.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/reset-password', {
        token,
        newPassword,
      });

      setMessage('Senha alterada com sucesso!');
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      const errMsg = error.response?.data?.msg || 'Erro ao alterar a senha.';
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Redefinir Senha</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 font-medium">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Nova Senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && (
            <p className={`text-center ${message.includes('sucesso') ? 'text-green-500' : 'text-red-500'} text-sm mt-2`}>
              {message}
            </p>
          )}

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
