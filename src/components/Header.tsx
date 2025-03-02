import React from 'react';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="bg-white text-gray-900 py-4 border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-16">
        <div className="flex items-center">
          <Image
            src="/images/agile-actors-logo.webp"
            alt="Agile Actors Logo"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <div className="mx-4 h-8 w-px bg-gray-300" />
          <h1 className="text-2xl font-medium text-[#1a56db] mt-1">Testing API playground</h1>
        </div>
      </div>
    </header>
  );
}; 