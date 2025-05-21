import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import apiClient from '../apiClient'; // importa aqui o apiClient
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const [stats, setStats] = useState({ total: 0, em_manutencao: 0 });
  const [alteracoes, setAlteracoes] = useState([]);
  const [ignorarIds, setIgnorarIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ignorados = localStorage.getItem('ignorarIds');
    if (ignorados) {
      setIgnorarIds(JSON.parse(ignorados));
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get("/api/equipamentos/stats"); // <-- usar apiClient
        setStats(res.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    const fetchAlteracoes = async () => {
      try {
        const res = await apiClient.get("/api/alteracoes/recentes"); // <-- usar apiClient
        const filtradas = res.data.filter((alt) => !ignorarIds.includes(alt.id));
        setAlteracoes(filtradas);
      } catch (error) {
        console.error("Erro ao buscar alterações recentes:", error);
      }
    };

    fetchStats();
    fetchAlteracoes();
  }, [ignorarIds]);

  // resto do teu código permanece igual...

};

export default DashboardHome;
