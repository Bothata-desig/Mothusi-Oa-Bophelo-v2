import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-teal-700 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>
            <h1 className="text-xl font-bold leading-tight">Mothusi oa Bophelo</h1>
            <p className="text-xs text-teal-100 opacity-90">Sesotho Medical Voice Assistant</p>
          </div>
        </div>
      </div>
    </header>
  );
};