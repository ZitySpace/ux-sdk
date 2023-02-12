import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export const queryContext = React.createContext<QueryClient | undefined>(
  undefined
);

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient} context={queryContext}>
      {children}
    </QueryClientProvider>
  );
};
