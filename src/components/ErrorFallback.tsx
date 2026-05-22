import { Component, ReactNode } from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <details style={{ whiteSpace: 'pre-wrap' }}>
        {error.toString()}
      </details>
      <button onClick={resetError}>
        Try again
      </button>
    </div>
  );
};