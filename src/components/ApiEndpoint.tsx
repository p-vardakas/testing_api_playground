import React, { useState } from 'react';

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  onSubmit: (data: any) => void;
  fields: Array<{
    name: string;
    type: string;
    placeholder?: string;
  }>;
}

const ApiForm = ({ method, fields, onSubmit }: Omit<ApiEndpointProps, 'endpoint'>) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium mb-1">{field.name}</label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full p-2 border rounded"
            onChange={(e) => handleChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Send Request
      </button>
    </form>
  );
};

export const ApiEndpoint = ({ method, endpoint, onSubmit, fields }: ApiEndpointProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex gap-2 mb-4">
        <span className={`
          px-2 py-1 rounded text-white
          ${method === 'GET' ? 'bg-blue-500' : ''}
          ${method === 'POST' ? 'bg-green-500' : ''}
          ${method === 'PUT' ? 'bg-yellow-500' : ''}
          ${method === 'DELETE' ? 'bg-red-500' : ''}
          ${method === 'PATCH' ? 'bg-purple-500' : ''}
        `}>
          {method}
        </span>
        <span className="font-mono">{endpoint}</span>
      </div>
      
      <ApiForm
        key={`${method}-${endpoint}`}
        method={method}
        fields={fields}
        onSubmit={onSubmit}
      />
    </div>
  );
}; 