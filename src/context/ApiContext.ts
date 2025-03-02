import { createContext, useContext, useState } from 'react';

interface CompanyValue {
  id: number;
  title: string;
  value: string;
}

// Initial values
export const initialValues: CompanyValue[] = [
  { id: 1, title: "Having a purpose", value: "Purpose is what drives us..." },
  { id: 2, title: "Being Adventurous", value: "We do not fear the new..." },
  // ... other values
];

// Create a singleton instance for server-side access
let globalCompanyValues = [...initialValues];

export const getCompanyValues = () => globalCompanyValues;
export const setCompanyValues = (values: CompanyValue[]) => {
  globalCompanyValues = values;
};

// Context remains the same for client-side
const ApiContext = createContext<{
  companyValues: CompanyValue[];
  setCompanyValues: (values: CompanyValue[]) => void;
}>({
  companyValues: initialValues,
  setCompanyValues: () => {},
});

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [companyValues, setValues] = useState(initialValues);

  const handleSetValues = (values: CompanyValue[]) => {
    setValues(values);
    setCompanyValues(values); // Update global values
  };

  return (
    <ApiContext.Provider value={{ companyValues, setCompanyValues: handleSetValues }}>
      {children}
    </ApiContext.Provider>
  );
}; 