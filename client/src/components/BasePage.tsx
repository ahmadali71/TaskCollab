// src/components/BasePage.tsx
import React from 'react';

interface BasePageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ title, description, children, actions }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      
      {/* Content */}
      {children}
    </div>
  );
};