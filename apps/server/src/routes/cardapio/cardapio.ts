import { getCardapioQuerySchema } from '@repo/shared';
import { Elysia } from 'elysia';
import { authPlugin } from '@/plugins/auth';
import { getCardapio } from '@/services/cardapio/cardapio';

export const cardapioRoutes = new Elysia()
  .use(authPlugin)
  .get(
  '/cardapio',
  ({ query, set }) => {
    try {
      const parsedQuery = getCardapioQuerySchema.parse(query);
      const cardapio = getCardapio(parsedQuery);
      return {
        success: true,
        data: cardapio,
      };
    } catch (error) {
      set.status = 400;
      return {
        success: false,
        message: 'Parâmetros inválidos.',
        error,
      };
    }
  },
);
