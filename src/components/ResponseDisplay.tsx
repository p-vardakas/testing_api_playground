import React from 'react';

interface ResponseDisplayProps {
  response: any;
  error?: string;
}

export const ResponseDisplay = ({ response, error }: ResponseDisplayProps) => {
  if (!response && !error) return null;
  
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Response:</h3>
      <pre className={`p-4 rounded-lg font-mono text-sm overflow-x-auto ${
        error ? 'bg-red-100' : 'bg-gray-100'
      }`}>
        {error || JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}; 