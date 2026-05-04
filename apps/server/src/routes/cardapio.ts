import { getCardapioQuerySchema } from '@repo/shared';
import { Elysia } from 'elysia';
import { getCardapio } from '../services/cardapio';

export const cardapioRoutes = new Elysia().get(
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
