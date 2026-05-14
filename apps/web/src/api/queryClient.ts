import { QueryClient } from '@tanstack/react-query';

const MINUTE = 1000 * 60;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: MINUTE * 5, // Tempo que o cache é considerado válido e não chama a queryFn pra atualizar o cache
      gcTime: MINUTE * 5, // Tempo que o cache fica armazenado após ficar inativo (é removido quando fica esse tempo inativo)
    },
  },
});
