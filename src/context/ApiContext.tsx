import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { store } from '@/lib/store';

interface CompanyValue {
  id: number;
  title: string;
  value: string;
}

interface ApiContextType {
  companyValues: CompanyValue[];
  setCompanyValues: (values: CompanyValue[]) => void;
}

const ApiContext = createContext<ApiContextType>({
  companyValues: store.getValues(),
  setCompanyValues: () => {},
});

export const useApi = () => useContext(ApiContext);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [companyValues, setValues] = useState(() => store.getValues());

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      setValues(store.getValues());
    });

    return () => unsubscribe();
  }, []);

  return (
    <ApiContext.Provider value={{ companyValues, setCompanyValues: store.setValues }}>
      {children}
    </ApiContext.Provider>
  );
}; 