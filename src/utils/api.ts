export const generateToken = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  const getRandomChars = (source: string, length: number) => 
    Array.from({ length }, () => source[Math.floor(Math.random() * source.length)]).join('');
  
  return getRandomChars(letters, 4) + getRandomChars(numbers, 3) + getRandomChars(letters, 3);
};

export const validateToken = (token: string | null): boolean => {
  if (!token || token.length !== 10) return false;
  
  const letterPattern = /^[A-Z]{4}\d{3}[A-Z]{3}$/;
  return letterPattern.test(token);
}; 