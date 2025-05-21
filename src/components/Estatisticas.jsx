import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import apiClient from '../apiClient';  // importa o apiClient configurado

const Estatisticas = () => {
  const [dados, setDados] = useState(null);
  const [contagensManual, setContagensManual] = useState({ servidores: 0, switches: 0 });

  const cores = ["#60A5FA", "#4F46E5"]; // cores para gráficos

  useEffect(() => {
    fetchDados();
    carregarManual();
  }, []);

  const fetchDados = async () => {
    try {
      const res = await apiClient.get("/api/estatisticas");  // usa apiClient aqui
      setDados(res.data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const carregarManual = () => {
    setContagensManual({
      servidores: parseInt(localStorage.getItem("servidores")) || 0,
      switches: parseInt(localStorage.getItem("switches")) || 0,
    });
  };

  const handleIncrementar = (tipo) => {
    setContagensManual((prev) => {
      const novo = { ...prev, [tipo]: prev[tipo] + 1 };
      localStorage.setItem(tipo, novo[tipo]);
      return novo;
    });
  };

  const handleDecrementar = (tipo) => {
    setContagensManual((prev) => {
      const novo = { ...prev, [tipo]: prev[tipo] > 0 ? prev[tipo] - 1 : 0 };
      localStorage.setItem(tipo, novo[tipo]);
      return novo;
    });
  };

  const handleInputChange = (tipo, e) => {
    let valor = e.target.value.replace(/^0+/, '');
    if (valor === '') valor = '0';
    if (!/^[0-9]+$/.test(valor)) return;

    setContagensManual((prev) => ({
      ...prev,
      [tipo]: parseInt(valor, 10)
    }));

    localStorage.setItem(tipo, parseInt(valor, 10));
  };

  if (!dados) return <p>A carregar estatísticas...</p>;

  const dataDesktops = [
    { name: "Operacionais", value: dados.desktops_operacionais },
    { name: "Em Manutenção", value: dados.desktops_manutencao },
  ];

  const dataPortateis = [
    { name: "Operacionais", value: dados.portateis_operacionais },
    { name: "Em Manutenção", value: dados.portateis_manutencao },
  ];

  const dataTelefones = [
    { name: "Operacionais", value: dados.telefones_operacionais || 0 },
    { name: "Em Manutenção", value: dados.telefones_manutencao || 0 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estatísticas Gerais</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card titulo="Total Equipamentos" valor={dados.totalEquipamentos} />
        <Card titulo="Em Manutenção" valor={dados.emManutencao} />
        <Card titulo="Total Funcionários" valor={dados.funcionarios} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard titulo="Desktops" data={dataDesktops} cores={cores} />
        <ChartCard titulo="Portáteis" data={dataPortateis} cores={cores} />
        <ChartCard titulo="Telefones" data={dataTelefones} cores={cores} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['servidores', 'switches'].map(tipo => (
          <div key={tipo} className="p-4 bg-white rounded-xl shadow-md text-center space-y-2">
            <h4 className="text-lg font-semibold capitalize">{tipo}</h4>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handleDecrementar(tipo)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >-</button>
              <input
                type="text"
                value={contagensManual[tipo]}
                onChange={(e) => handleInputChange(tipo, e)}
                className="w-16 text-center border rounded-md"
              />
              <button
                onClick={() => handleIncrementar(tipo)}
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ titulo, valor }) => (
  <div className="p-4 bg-white rounded-xl shadow-md text-center">
    <h4 className="text-sm text-gray-500">{titulo}</h4>
    <p className="text-2xl font-bold">{valor > 0 ? valor : "-"}</p>
  </div>
);

const ChartCard = ({ titulo, data, cores }) => (
  <div className="p-4 bg-white rounded-xl shadow-md">
    <h4 className="text-lg font-semibold mb-2 text-center">{titulo}</h4>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default Estatisticas;
