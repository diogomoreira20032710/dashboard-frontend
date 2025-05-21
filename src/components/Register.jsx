import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient'; // importa aqui o apiClient
import AuthLayout from '../layouts/AuthLayout';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensagem, setMensagem] = useState('');

  const navigate = useNavigate();

  const validarPassword = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;
    return regex.test(senha);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    if (password !== confirmPassword) {
      setMensagem('As senhas não coincidem!');
      return;
    }

    if (!validarPassword(password)) {
      setMensagem('A palavra-passe deve ter pelo menos 9 caracteres, incluindo maiúsculas, minúsculas, números e um símbolo.');
      return;
    }

    try {
      const response = await apiClient.post('/api/register', {
        nome,
        email,
        password,
        tipo: 'admin'
      });

      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro no Registo! Verifique os dados.');
    }
  };

  return (
    <AuthLayout title="Sistema de Gestão de Equipamentos" subtitle="Registo de Usuário">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700 font-medium">PRD (Utilizador):</label>
          <input
            type="text"
            id="nome"
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="PRD (Utilizador)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">Email institucional:</label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Email institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium">Password:</label>
          <input
            type="password"
            id="password"
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">Confirmar Password:</label>
          <input
            type="password"
            id="confirmPassword"
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Confirmar Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {mensagem && <p className="text-center text-red-500 text-sm mt-2">{mensagem}</p>}
        <div className="mt-4">
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Registar
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        <Link to="/" className="text-sm text-blue-500 hover:text-blue-700">
          Já tem uma conta? Faça Login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Register;
