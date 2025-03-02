interface CompanyValue {
  id: number;
  title: string;
  value: string;
}

// Helper to ensure consistent property order
const formatValue = (value: CompanyValue): CompanyValue => {
  return {
    id: value.id,
    title: value.title,
    value: value.value
  };
};

const initialValues: CompanyValue[] = [
  {
    id: 1,
    title: "Having a purpose",
    value: "Purpose is what drives us. It's our source of pride, enthusiasm and fulfillment. It drives our effort to continuously improve. It guides our development path and growth. Having a purpose leads to self awareness, self discipline, motivation and the feeling that we make a meaningful impact."
  },
  {
    id: 2,
    title: "Being Adventurous",
    value: "We do not fear the new. We learn new things, we experiment. We embrace change, and we are not afraid to disrupt our comfort zone. We challenge ourselves to create new ideas, to work with new practices, to generate new revenue streams. We are passionate about what we do, and most of all we are curious."
  },
  {
    id: 3,
    title: "Being Agile",
    value: "Being Agile is about inspecting and adapting. We inspect our environment and we adapt to it. We avoid just following practices. We understand and realise the need, and we act accordingly. We are flexible and resilient. We don't wait to be told what to do - we act. We move forward in small steps. We are 'results and quality' oriented."
  },
  {
    id: 4,
    title: "Respect and Empower",
    value: "We strongly believe that to achieve a purpose everyone needs respect and empowerment. That's why we respect people, diverse cultures and backgrounds. Respect is about empathy, professionalism and caring. We support people to make them stronger and more confident. To bring out their best. We support our colleagues and work for the success of the team. We value autonomy and collaboration. We learn to influence and inspire."
  },
  {
    id: 5,
    title: "Authenticity and Trust",
    value: "Authenticity and Trust are fundamental to our culture and mindset. Because authenticity is about honesty, transparency, accountability and commitment, while trust is the base of our environment. We are not afraid to share our weaknesses, fears or concerns with our colleagues and partners. We invite them to practice the same, thus creating a trustful environment, which serves as a vehicle for solid and coherent teams, and as a driver for self-awareness and personal development."
  },
  {
    id: 6,
    title: "Evolving through our clients",
    value: "We are focused on best serving the needs of our clients by forming cross functional teams of technology professionals and delivering state-of-the-art, high quality software and data engineering services. We continuously develop and evolve our competencies to best meet the business needs of our clients in a technology environment where change is the new status quo."
  }
];

// Global variable to store values
let globalValues = [...initialValues];

// Load from localStorage if available
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('companyValues');
  if (stored) {
    try {
      globalValues = JSON.parse(stored);
    } catch (e) {
      // If parse fails, keep initial values
    }
  }
}

const listeners: Listener[] = [];

const notifyListeners = (): void => {
  listeners.forEach(listener => listener());
};

const persistValues = (values: CompanyValue[]): void => {
  globalValues = values;
  if (typeof window !== 'undefined') {
    localStorage.setItem('companyValues', JSON.stringify(values));
  }
};

// Add type for listener function
type Listener = () => void;

// Add validation
const validateValue = (value: Partial<CompanyValue>): boolean => {
  if (value.title && value.title.length < 3) return false;
  if (value.value && value.value.length < 10) return false;
  return true;
};

export const store = {
  getValues: (): CompanyValue[] => {
    return globalValues.map(formatValue);
  },

  setValues: (newValues: CompanyValue[]): void => {
    persistValues(newValues.map(formatValue));
    notifyListeners();
  },

  addValue: (value: Omit<CompanyValue, 'id'>): CompanyValue => {
    if (!validateValue(value)) {
      throw new Error('Invalid value properties');
    }
    const newId = Math.max(...globalValues.map(v => v.id)) + 1;
    const newValue = formatValue({ id: newId, ...value });
    persistValues([...globalValues, newValue]);
    notifyListeners();
    return newValue;
  },

  updateValue: (id: number, updates: Partial<CompanyValue>): CompanyValue | null => {
    if (!validateValue(updates)) {
      throw new Error('Invalid update properties');
    }
    const index = globalValues.findIndex(v => v.id === id);
    if (index !== -1) {
      const newValues = [...globalValues];
      newValues[index] = formatValue({ ...newValues[index], ...updates });
      persistValues(newValues);
      notifyListeners();
      return newValues[index];
    }
    return null;
  },

  deleteValue: (id: number): void => {
    persistValues(globalValues.filter(v => v.id !== id));
    notifyListeners();
  },

  subscribe: (listener: () => void): () => void => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }
}; 