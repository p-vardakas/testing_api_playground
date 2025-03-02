import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-center items-center space-x-6">
        <Link 
          href="/" 
          className="hover:text-gray-300 transition-colors"
        >
          Home
        </Link>
        <a 
          href="https://www.agileactors.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition-colors"
        >
          About
        </a>
      </div>
    </footer>
  );
}; 