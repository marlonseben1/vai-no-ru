import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { reservasApi } from '@/api/reservas';
import { QUERY_KEYS } from '@/api/queryKeys';
import type { ReservaFiltros } from '@/api/reservas/reservas.types';

export const PAGE_SIZE = 5;

export function useReservas(page: number, filtros: ReservaFiltros = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.reservas, page, filtros],
    queryFn: () =>
      reservasApi.fetchReservas({ page, pageSize: PAGE_SIZE, ...filtros }),
  });

  useEffect(() => {
    if (!query.data) return;
    const totalPages = Math.ceil(query.data.total / PAGE_SIZE);
    if (page < totalPages) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.reservas, page + 1, filtros],
        queryFn: () =>
          reservasApi.fetchReservas({
            page: page + 1,
            pageSize: PAGE_SIZE,
            ...filtros,
          }),
      });
    }
  }, [page, filtros, query.data, queryClient]);

  return query;
}
