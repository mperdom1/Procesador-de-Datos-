import React, { useState } from 'react';

interface ResultAreaProps {
  value: string;
}

const ResultArea: React.FC<ResultAreaProps> = ({ value }) => {
  const [copyText, setCopyText] = useState('Copiar');

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyText('¡Copiado!');
      setTimeout(() => setCopyText('Copiar'), 1500);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-lg font-semibold text-gray-700">
          Resultado Final (Formato Tabulado)
        </label>
        <button
          onClick={handleCopy}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-3 rounded-full border border-blue-200 hover:border-blue-400 transition duration-150 bg-white"
        >
          {copyText}
        </button>
      </div>
      <div className="h-[300px]">
        <textarea
          readOnly
          value={value}
          className="w-full h-full p-3 border border-gray-300 bg-gray-50 rounded-lg text-sm font-mono resize-none outline-none"
          placeholder="El resultado procesado aparecerá aquí..."
        />
      </div>
    </div>
  );
};

export default ResultArea;