import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import apiClient from '../apiClient'; // importa o apiClient configurado

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await apiClient.post('/api/forgot-password', { email });
      setSuccessMessage(response.data.msg);
      setMensagem('');
    } catch (err) {
      setMensagem(err.response?.data?.msg || 'Erro ao enviar e-mail.');
      setSuccessMessage('');
    }
  };

  return (
    <AuthLayout title="Recuperação de Senha">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">Email institucional</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {mensagem && <p className="text-center text-red-500 text-sm mt-2">{mensagem}</p>}
        {successMessage && <p className="text-center text-green-500 text-sm mt-2">{successMessage}</p>}
        <div className="mt-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
            Enviar link de recuperação
          </button>
        </div>
      </form>

      <div className="text-center mt-6">
        <Link to="/" className="text-sm text-blue-500 hover:text-blue-700 transition">
          Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
