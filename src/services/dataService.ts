import { store } from '@/lib/store';

interface CompanyValue {
  id: number;
  title: string;
  value: string;
}

export const DataService = {
  getValues: () => store.getValues(),
  
  addValue: (value: Omit<CompanyValue, 'id'>) => {
    return store.addValue(value);
  },
  
  updateValue: (id: number, value: Partial<CompanyValue>) => {
    return store.updateValue(id, value);
  },
  
  deleteValue: (id: number) => {
    store.deleteValue(id);
    return true;
  }
}; 