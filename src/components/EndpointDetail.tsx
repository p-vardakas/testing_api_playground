import React, { useEffect, useState } from 'react';
import { ApiEndpoint } from './ApiEndpoint';
import { ResponseDisplay } from './ResponseDisplay';

interface Example {
  title: string;
  request: any;
  response: any;
}

interface EndpointDetailProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  description: string;
  fields: Array<{
    name: string;
    type: string;
    placeholder?: string;
  }>;
  examples: Example[];
  onSubmit: (data: any) => void;
  response: any;
  error?: string;
}

// Move function outside component
const generateCurlCommand = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  fields: Array<{
    name: string;
    type: string;
    placeholder?: string;
  }>
): string => {
  const baseUrl = 'http://localhost:3000';
  const apiEndpoint = endpoint || '/api/values';
  let finalEndpoint = apiEndpoint;

  // Replace ID in endpoint if present
  if (finalEndpoint.includes('{id}')) {
    finalEndpoint = finalEndpoint.replace('{id}', '1');
  }

  // Build the base curl command
  let curl = `curl -X ${method} '${baseUrl}${finalEndpoint}'`;

  // Special handling for auth endpoint
  if (apiEndpoint === '/api/auth') {
    return `curl -X POST 'http://localhost:3000/api/auth' \\
-H 'Content-Type: application/json' \\
-d '{
  "email": "test@test.com",
  "password": "test"
}'`;
  }

  // Add token header for all non-auth requests
  curl += ` \\\n-H 'Authorization: Bearer your-token-here'`;

  // Add Content-Type and body for POST, PUT, and PATCH requests
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    curl += ` \\\n-H 'Content-Type: application/json'`;
    curl += ` \\\n-d '{`;

    // For other endpoints, include all fields except 'id' and 'token' in body
    const bodyFields = fields
      .filter(f => f.name !== 'id' && f.name !== 'token')
      .map(f => `\n  "${f.name}": "${f.placeholder || 'value'}"`)
      .join(',');
    curl += bodyFields;
    curl += '\n}'
  }

  return curl;
};

export const EndpointDetail = ({
  method,
  endpoint,
  description,
  fields,
  examples,
  onSubmit,
  response,
  error
}: EndpointDetailProps) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-white">{description}</h1>
        <p className="text-gray-400 mb-6 font-mono">{endpoint}</p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Try it out</h3>
          <ApiEndpoint
            key={endpoint}
            method={method}
            endpoint={endpoint}
            fields={fields}
            onSubmit={onSubmit}
          />
          <ResponseDisplay response={response} error={error} />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Examples</h3>
          <div className="space-y-6">
            {examples.map((example, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{example.title}</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Request</h5>
                    <pre className="bg-gray-50 p-3 rounded mt-1 text-sm">
                      {JSON.stringify(example.request, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Response</h5>
                    <pre className="bg-gray-50 p-3 rounded mt-1 text-sm">
                      {JSON.stringify(example.response, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">cURL</h3>
          <pre className="bg-gray-50 p-3 rounded text-sm font-mono">
            {generateCurlCommand(method, endpoint, fields)}
          </pre>
        </div>
      </div>
    </div>
  );
}; 