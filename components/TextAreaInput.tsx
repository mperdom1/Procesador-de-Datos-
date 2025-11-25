import React from 'react';

interface TextAreaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder
}) => {
  return (
    <div className="flex flex-col h-full">
      <label htmlFor={id} className="block text-lg font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="h-[300px]">
        <textarea
          id={id}
          className="w-full h-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm font-mono resize-none outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default TextAreaInput;