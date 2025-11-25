import React, { useState } from 'react';
import TextAreaInput from './components/TextAreaInput';
import ResultArea from './components/ResultArea';
import { processDatasets } from './utils';
import { SAMPLE_DATA_1, SAMPLE_DATA_2 } from './constants';

function App() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleProcess = () => {
    setError(null);
    setStatus('');
    setResult('');
    
    setTimeout(() => {
      try {
        if (!input1.trim() && !input2.trim()) {
          setError("Por favor, pega datos en al menos una de las tablas de entrada.");
          return;
        }

        const { result: processedData, error: processError, count } = processDatasets(input1, input2);
        
        if (processError) {
          setError(processError);
        } else {
          setResult(processedData);
          if (count) {
             setStatus(`Proceso completado. ${count} filas generadas.`);
          }
        }
      } catch (e) {
        console.error(e);
        setError("Ocurrió un error inesperado al procesar los datos.");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] p-4 sm:p-8 font-sans">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-6 lg:p-10 max-w-[1200px]">
        {/* Header Section */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 flex items-center gap-3">
          <span>📊</span> Procesador de Datos de Programas
        </h1>
        <p className="text-gray-600 mb-6">
          Pega los datos de tus dos tablas de entrada a continuación para generar el reporte en el formato tabulado requerido.
        </p>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TextAreaInput
            id="inputData1"
            label="Tabla 1 (Fecha, Campaña, Leave, Scheduled)"
            value={input1}
            onChange={setInput1}
            placeholder="Pega aquí los datos de la Tabla 1, incluyendo la fila de encabezados."
          />
          <TextAreaInput
            id="inputData2"
            label="Tabla 2 (Fecha, Campaña, Absent)"
            value={input2}
            onChange={setInput2}
            placeholder="Pega aquí los datos de la Tabla 2, incluyendo la fila de encabezados."
          />
        </div>

        {/* Action Button & Status */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={handleProcess}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-150 shadow-md hover:-translate-y-px hover:shadow-lg active:translate-y-px active:shadow-none"
          >
            Procesar Datos
          </button>
          
          <div className="text-sm font-medium">
            {error && <span className="text-red-500">{error}</span>}
            {status && <span className="text-red-500">{status}</span>}
          </div>
        </div>

        {/* Output Section */}
        <ResultArea value={result} />
        
        {/* Hidden Utilities for Development/Testing */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end opacity-50 hover:opacity-100 transition-opacity">
           <button 
             onClick={() => { setInput1(SAMPLE_DATA_1); setInput2(SAMPLE_DATA_2); }}
             className="text-xs text-gray-400 hover:text-blue-600"
           >
             Cargar Datos de Ejemplo
           </button>
        </div>
      </div>
    </div>
  );
}

export default App;