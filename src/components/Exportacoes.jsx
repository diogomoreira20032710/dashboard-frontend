import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import apiClient from '../apiClient'; // <-- importa aqui o apiClient

const Exportacoes = () => {
  const [equipamentos, setEquipamentos] = useState([]);

  const fetchEquipamentos = async () => {
    try {
      const response = await apiClient.get("/api/equipamentos");  // usa apiClient aqui
      setEquipamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  // Função para gerar PDF
  const gerarPDF = () => {
    const doc = (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.title}>Relatório de Equipamentos</Text>
          {equipamentos.map((equipamento, index) => (
            <Text key={index} style={styles.equipamentoText}>
              {equipamento.prd} - {equipamento.tipo} - {equipamento.marca_modelo}
            </Text>
          ))}
        </Page>
      </Document>
    );

    // Gerar o PDF e salvar no navegador
    pdf(doc).toBlob().then(blob => {
      saveAs(blob, 'relatorio_equipamentos.pdf');
    });
  };

  // Função para exportar em CSV
  const exportarCSV = () => {
    const csvData = [
      ['PRD', 'Tipo', 'Marca/Modelo', 'RAM', 'Disco'], // Cabeçalho
      ...equipamentos.map(equipamento => [
        equipamento.prd,
        equipamento.tipo,
        equipamento.marca_modelo,
        equipamento.memoria_ram,
        equipamento.disco
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'equipamentos.csv');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Exportação de Dados</h2>
      <div className="space-y-4">
        <p>Escolha o formato de exportação:</p>
        <div className="flex justify-between gap-2">
          <button onClick={gerarPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Exportar PDF
          </button>
          <button onClick={exportarCSV} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
};

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  equipamentoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default Exportacoes;
