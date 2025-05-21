import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient'; // importa o cliente axios configurado
import AuthLayout from '../layouts/AuthLayout';

function Login() {
  const [mensagem, setMensagem] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    try {
      const response = await apiClient.post("/api/login", {
        email,
        password,
      });

      // Armazena o token no localStorage
      localStorage.setItem("token", response.data.token);

      // Redireciona para o dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMensagem('Usuário ou password inválidos!');
    }
  };

  return (
    <AuthLayout title="Sistema de Gestão de Equipamentos" subtitle="Login">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">Email institucional</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Email institucional"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Palavra-passe"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mensagem && <p className="text-center text-red-500 text-sm mt-2">{mensagem}</p>}
        <div className="mt-4">
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Entrar
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
          Esqueci-me da password
        </Link>
      </div>
      <div className="text-center mt-4">
        <Link to="/register" className="text-sm text-blue-500 hover:text-blue-700">
          Não tem uma conta? Registe-se
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Login;
