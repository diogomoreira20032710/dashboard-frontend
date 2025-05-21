import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./components/DashboardHome";
import Equipamentos from "./components/Equipamentos";
import Funcionarios from "./components/Funcionarios";
import Estatisticas from "./components/Estatisticas";
import Exportacoes from "./components/Exportacoes";
import Definicoes from "./components/Definicoes";
import Manual from "./components/Manual";


function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rota protegida da dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="equipamentos" element={<Equipamentos />} /> {/* ← aqui é importante */}
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="estatisticas" element={<Estatisticas />} />
          <Route path="exportacoes" element={<Exportacoes />} />
          <Route path="definicoes" element={<Definicoes />} />
          <Route path="manual" element={<Manual />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
