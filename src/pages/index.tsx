import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { EndpointList } from '@/components/EndpointList';
import { EndpointDetail } from '@/components/EndpointDetail';
import { useApi } from '@/context/ApiContext';
import { generateToken, validateToken } from '@/utils/api';
import { Footer } from '@/components/Footer';
import Head from 'next/head';

interface EndpointDetailProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  id: string;
  path: string;
  description: string;
  fields: { name: string; type: string; placeholder: string }[];
  examples: { title: string; request: any; response: any }[];
}

const ENDPOINTS = [
  {
    id: 'auth',
    method: 'POST',
    path: '/api/auth',
    description: 'Authenticate',
    fields: [
      { name: 'email', type: 'email', placeholder: 'test@test.com' },
      { name: 'password', type: 'password', placeholder: 'test' }
    ],
    examples: [
      {
        title: 'Successful Authentication',
        request: { email: 'test@test.com', password: 'test' },
        response: {
          status: 200,
          data: { token: 'ABCD123XYZ' }
        }
      },
      {
        title: 'Invalid Credentials',
        request: { email: 'wrong@email.com', password: 'wrong' },
        response: {
          status: 401,
          data: { error: 'Invalid credentials' }
        }
      }
    ]
  },
  {
    id: 'values-list',
    method: 'GET',
    path: '/api/values',
    description: 'Retrieve values',
    fields: [
      { name: 'token', type: 'text', placeholder: 'Authentication token' },
      { name: 'limit', type: 'number', placeholder: 'Number of items per page' }
    ],
    examples: [
      {
        title: 'Get Paginated Values',
        request: {
          token: 'ABCD123XYZ',
          limit: 2
        },
        response: {
          status: 200,
          data: [
            {
              id: 1,
              title: "Having a purpose",
              value: "Purpose is what drives us. It's our source of pride..."
            },
            {
              id: 2,
              title: "Being Adventurous",
              value: "We do not fear the new. We learn new things..."
            }
          ],
          total: 6,
          page: 1,
          limit: 2
        }
      },
      {
        title: 'Invalid Token',
        request: {
          token: 'invalid',
          limit: 10
        },
        response: {
          status: 401,
          data: { error: 'Invalid token' }
        }
      }
    ]
  },
  {
    id: 'values-get-single',
    method: 'GET',
    path: '/api/values/{id}',
    description: 'Retrieve a value by ID',
    fields: [
      { name: 'token', type: 'text', placeholder: 'Authentication token' },
      { name: 'id', type: 'number', placeholder: 'Value ID' }
    ],
    examples: [
      {
        title: 'Get Single Value',
        request: {
          token: 'ABCD123XYZ',
          id: 1
        },
        response: {
          status: 200,
          data: {
            id: 1,
            title: "Having a purpose",
            value: "Purpose is what drives us. It's our source of pride..."
          }
        }
      },
      {
        title: 'Value Not Found',
        request: {
          token: 'ABCD123XYZ',
          id: 999
        },
        response: {
          status: 404,
          data: { error: 'Value not found' }
        }
      }
    ]
  },
  {
    id: 'values-post',
    method: 'POST',
    path: '/api/values',
    description: 'Create a new value',
    fields: [
      { name: 'token', type: 'text', placeholder: 'Authentication token' },
      { name: 'title', type: 'text', placeholder: 'Value name' },
      { name: 'value', type: 'text', placeholder: 'Value description' }
    ],
    examples: [
      {
        title: 'Create New Value',
        request: {
          token: 'ABCD123XYZ',
          title: 'Innovation',
          value: 'We embrace new technologies and ideas'
        },
        response: {
          status: 201,
          data: {
            id: 7,
            title: 'Innovation',
            value: 'We embrace new technologies and ideas'
          }
        }
      },
      {
        title: 'Invalid Token',
        request: {
          token: 'invalid',
          title: 'Innovation',
          value: 'Description'
        },
        response: {
          status: 401,
          data: { error: 'Invalid token' }
        }
      }
    ]
  },
  {
    id: 'values-put',
    method: 'PUT',
    path: '/api/values/{id}',
    description: 'Update a value',
    fields: [
      { name: 'token', type: 'text', placeholder: 'Authentication token' },
      { name: 'id', type: 'number', placeholder: 'Value ID' },
      { name: 'title', type: 'text', placeholder: 'New value name' },
      { name: 'value', type: 'text', placeholder: 'New value description' }
    ],
    examples: [
      {
        title: 'Update Custom Value',
        request: {
          token: 'ABCD123XYZ',
          id: 7,
          title: 'Innovation',
          value: 'Updated description about innovation'
        },
        response: {
          status: 200,
          data: {
            id: 7,
            title: 'Innovation',
            value: 'Updated description about innovation'
          }
        }
      },
      {
        title: 'Attempt to Update Predefined Value',
        request: {
          token: 'ABCD123XYZ',
          id: 1,
          title: 'Having a purpose',
          value: 'New description'
        },
        response: {
          status: 403,
          data: { error: 'Cannot modify predefined values' }
        }
      },
      {
        title: 'Value Not Found',
        request: {
          token: 'ABCD123XYZ',
          id: 999,
          title: 'Test',
          value: 'Test'
        },
        response: {
          status: 404,
          data: { error: 'Value not found' }
        }
      }
    ]
  },
  {
    id: 'values-patch',
    method: 'PATCH',
    path: '/api/values/{id}',
    description: 'Update value fields',
    fields: [
      { name: 'token', type: 'text', placeholder: 'Authentication token' },
      { name: 'id', type: 'number', placeholder: 'Value ID' },
      { name: 'title', type: 'text', placeholder: 'New value title (optional)' },
      { name: 'value', type: 'text', placeholder: 'New value description (optional)' }
    ],
    examples: [
      {
        title: 'Update Value Description',
        request: {
          token: 'ABCD123XYZ',
          id: 7,
          value: 'Updated description'
        },
        response: {
          status: 200,
          data: {
            id: 7,
            title: 'Existing Title',
            value: 'Updated description'
          }
        }
      },
      {
        title: 'Value Not Found',
        request: {
          token: 'ABCD123XYZ',
          id: 999,
          title: 'New Title'
        },
        response: {
          status: 404,
          data: { error: 'Value not found' }
        }
      }
    ]
  },
  {
    id: 'values-delete',
    method: 'DELETE',
    path: '/api/values/{id}',
    description: 'Delete a value',
    fields: [
      { name: 'token', type: 'text', placeholder: 'Authentication token' },
      { name: 'id', type: 'number', placeholder: 'Value ID' }
    ],
    examples: [
      {
        title: 'Delete Custom Value',
        request: {
          token: 'ABCD123XYZ',
          id: 7
        },
        response: {
          status: 204,
          data: {}
        }
      },
      {
        title: 'Attempt to Delete Predefined Value',
        request: {
          token: 'ABCD123XYZ',
          id: 1
        },
        response: {
          status: 403,
          data: { error: 'Cannot delete predefined values' }
        }
      },
      {
        title: 'Value Not Found',
        request: {
          token: 'ABCD123XYZ',
          id: 999
        },
        response: {
          status: 404,
          data: { error: 'Value not found' }
        }
      }
    ]
  }
] as const;

export default function Home() {
  const { companyValues, setCompanyValues } = useApi();
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0].id);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setResponse(null);
    setError('');
  }, [selectedEndpoint]);

  const handleEndpointSelect = (id: string) => {
    setSelectedEndpoint(id);
    setResponse(null);
    setError('');
  };

  const handleAuth = async (data: { email: string; password: string }) => {
    if (data.email === 'test@test.com' && data.password === 'test') {
      const newToken = generateToken();
      setResponse({
        status: 200,
        data: { token: newToken }
      });
      setError('');
    } else {
      setResponse({
        status: 401,
        data: { error: 'Invalid credentials' }
      });
    }
  };

  const handleCompanyValues = async (
    method: string,
    data: { id?: number; title?: string; value?: string; limit?: number; token?: string }
  ) => {
    if (!validateToken(data.token)) {
      setResponse({
        status: 401,
        data: { error: 'Invalid or missing token' }
      });
      return;
    }

    switch (method) {
      case 'GET':
        if (currentEndpoint.id === 'values-get-single' && data.id) {
          const searchId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
          const value = companyValues.find(v => v.id === searchId);
          
          if (value) {
            setResponse({
              status: 200,
              data: value
            });
          } else {
            setResponse({
              status: 404,
              data: { error: 'Value not found' }
            });
          }
        } 
        else if (currentEndpoint.id === 'values-list') {
          const limit = Number(data.limit) || 10;
          const page = 1;
          const start = (page - 1) * limit;
          const paginatedValues = companyValues.slice(start, start + limit);
          
          setResponse({
            status: 200,
            data: paginatedValues,
            total: companyValues.length,
            page: page,
            limit: limit
          });
        }
        break;

      case 'POST':
        if (data.title && data.value) {
          const newId = Math.max(...companyValues.map(v => v.id)) + 1;
          const newValue = { id: newId, title: data.title, value: data.value };
          setCompanyValues([...companyValues, newValue]);
          setResponse({
            status: 201,
            data: newValue
          });
        }
        break;

      case 'PUT':
        if (data.id && data.title && data.value) {
          const updateId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
          const valueIndex = companyValues.findIndex(v => v.id === updateId);
          
          if (valueIndex === -1) {
            setResponse({
              status: 404,
              data: { error: 'Value not found' }
            });
          } else if (updateId <= 6) {
            setResponse({
              status: 403,
              data: { error: 'Cannot modify predefined values' }
            });
          } else {
            const updatedValue = { id: updateId, title: data.title, value: data.value };
            const newValues = [...companyValues];
            newValues[valueIndex] = updatedValue;
            setCompanyValues(newValues);
            setResponse({
              status: 200,
              data: updatedValue
            });
          }
        }
        break;

      case 'DELETE':
        if (data.id) {
          const deleteId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
          const value = companyValues.find(v => v.id === deleteId);
          
          if (!value) {
            setResponse({
              status: 404,
              data: { error: 'Value not found' }
            });
          } else if (deleteId <= 6) {
            setResponse({
              status: 403,
              data: { error: 'Cannot delete predefined values' }
            });
          } else {
            setCompanyValues(companyValues.filter(v => v.id !== deleteId));
            setResponse({
              status: 204,
              data: {}
            });
          }
        }
        break;

      case 'PATCH':
        if (data.id) {
          const patchId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
          const valueIndex = companyValues.findIndex(v => v.id === patchId);
          
          if (valueIndex === -1) {
            setResponse({
              status: 404,
              data: { error: 'Value not found' }
            });
          } else if (patchId <= 6) {
            setResponse({
              status: 403,
              data: { error: 'Cannot modify predefined values' }
            });
          } else {
            // Get the existing value
            const existingValue = companyValues[valueIndex];
            
            // Create updated value with optional fields
            const updatedValue = {
              id: patchId,
              title: data.title || existingValue.title,
              value: data.value || existingValue.value
            };

            const newValues = [...companyValues];
            newValues[valueIndex] = updatedValue;
            setCompanyValues(newValues);
            setResponse({
              status: 200,
              data: updatedValue
            });
          }
        }
        break;
    }
  };

  const currentEndpoint = ENDPOINTS.find(e => e.id === selectedEndpoint)!;

  const handleSubmit = (data: any) => {
    if (currentEndpoint.id === 'auth') {
      handleAuth(data);
    } else {
      handleCompanyValues(currentEndpoint.method, data);
    }
  };

  return (
    <>
      <Head>
        <title>Testing API Playground</title>
      </Head>
      <div className="min-h-screen bg-[#111827] flex flex-col">
        <Header />
        <div className="container mx-auto max-w-7xl px-16 flex mt-16">
          <div className="w-[300px] -mt-8">
            <EndpointList
              endpoints={ENDPOINTS}
              selectedEndpoint={selectedEndpoint}
              onSelect={handleEndpointSelect}
            />
          </div>
          <div className="flex-1 max-w-[800px] -mt-8">
            <EndpointDetail
              {...currentEndpoint}
              onSubmit={handleSubmit}
              response={response}
              error={error}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 