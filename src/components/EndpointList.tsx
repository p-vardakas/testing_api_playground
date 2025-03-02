import React from 'react';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
}

interface EndpointListProps {
  endpoints: Endpoint[];
  selectedEndpoint: string;
  onSelect: (id: string) => void;
}

export const EndpointList = ({ endpoints, selectedEndpoint, onSelect }: EndpointListProps) => {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg m-4 h-fit">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Endpoints</h2>
        <div className="space-y-2">
          {endpoints.map((endpoint) => (
            <button
              key={endpoint.id}
              onClick={() => onSelect(endpoint.id)}
              className={`w-full text-left p-2 rounded flex items-center gap-2 hover:bg-gray-100 ${
                selectedEndpoint === endpoint.id ? 'bg-gray-100' : ''
              }`}
            >
              <span className={`
                px-2 py-0.5 rounded text-xs text-white
                ${endpoint.method === 'GET' ? 'bg-blue-500' : ''}
                ${endpoint.method === 'POST' ? 'bg-green-500' : ''}
                ${endpoint.method === 'PUT' ? 'bg-yellow-500' : ''}
                ${endpoint.method === 'DELETE' ? 'bg-red-500' : ''}
                ${endpoint.method === 'PATCH' ? 'bg-purple-500' : ''}
              `}>
                {endpoint.method}
              </span>
              <span className="text-sm truncate">{endpoint.path}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 