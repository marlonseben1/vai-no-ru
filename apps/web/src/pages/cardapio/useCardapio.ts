import { useQuery } from '@tanstack/react-query';
import { cardapioApi } from '../../api/cardapio';
import { QUERY_KEYS } from '../../api/queryKeys';

export function useCardapio(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.cardapio, dataInicio, dataFim],
    queryFn: () => cardapioApi.fetchCardapio({ dataInicio, dataFim }),
  });
}
