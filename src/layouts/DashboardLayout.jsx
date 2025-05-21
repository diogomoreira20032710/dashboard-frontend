import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Users,
  BarChart,
  Download,
  Archive,
  Settings,
  LogOut
} from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4">
        <div className="mb-10 text-center">
          <img src="/0.png" alt="Logo" className="w-12 mx-auto" />
          <h1 className="text-sm font-bold mt-2">Câmara Municipal Paredes</h1>
        </div>

        <nav className="flex flex-col gap-4 text-sm">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/dashboard/equipamentos" icon={<Search size={18} />} label="Pesquisa de Equipamentos" />
          <NavItem to="/dashboard/funcionarios" icon={<Users size={18} />} label="Funcionários" />
          <NavItem to="/dashboard/estatisticas" icon={<BarChart size={18} />} label="Estatísticas" />
          <NavItem to="/dashboard/exportacoes" icon={<Download size={18} />} label="Exportações" />
          <NavItem to="/dashboard/Definicoes" icon={<Settings size={18} />} label="Definições" />
          <NavItem to="/dashboard/manual" icon={<Archive size={18} />} label="Manual de Utilização" />
        </nav>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Terminar Sessão
        </button>

        <div className="mt-auto text-xs text-center opacity-50 pt-4">v1.0.0</div>
      </aside>

      {/* Conteúdo da dashboard */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-blue-800 ${
        isActive ? "bg-blue-700 font-semibold" : ""
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default DashboardLayout;
