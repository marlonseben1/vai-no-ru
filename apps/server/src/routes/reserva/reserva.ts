import { ruFormSchema } from '@repo/shared';
import { Elysia, t } from 'elysia';
import { authPlugin } from '@/plugins/auth';
import {
  cancelarReserva,
  getHistoricoReserva,
  getReservasByUser,
  processReserva,
  reativarReserva,
} from '@/services/reserva/reserva';

export const reservaRoutes = new Elysia()
  .use(authPlugin)
  .post(
    '/reserva',
    async ({ body, currentUserId }) => {
      await processReserva(body, currentUserId);
      return {
        success: true,
        message: `Agendamento de ${body.data.length} dias concluído.`,
      };
    },
    { body: ruFormSchema },
  )
  .get(
    '/reservas',
    async ({ currentUserId, query }) => {
      return getReservasByUser(currentUserId, {
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
        order: query.order,
      });
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
        sort: t.Optional(t.String()),
        order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
      }),
    },
  )
  .delete('/reservas/:id', async ({ currentUserId, params, set }) => {
    const result = await cancelarReserva(params.id, currentUserId);
    if (!result.success) {
      set.status = result.reason === 'cannot_cancel' ? 422 : 404;
      return {
        success: false,
        message:
          result.reason === 'cannot_cancel'
            ? 'Esta reserva não pode ser cancelada.'
            : 'Reserva não encontrada.',
      };
    }

    return { success: true, message: 'Reserva cancelada com sucesso.' };
  })
  .get('/reservas/:id/historico', async ({ currentUserId, params, set }) => {
    const historico = await getHistoricoReserva(params.id, currentUserId);
    if (!historico) {
      set.status = 404;
      return { success: false, message: 'Reserva não encontrada.' };
    }
    return historico;
  })
  .put('/reservas/:id', async ({ currentUserId, params, set }) => {
    const result = await reativarReserva(params.id, currentUserId);
    if (!result.success) {
      set.status = result.reason === 'cannot_reactivate' ? 422 : 404;
      return {
        success: false,
        message:
          result.reason === 'cannot_reactivate'
            ? 'Esta reserva não pode ser reativada.'
            : 'Reserva não encontrada.',
      };
    }

    return { success: true, message: 'Reserva reativada com sucesso.' };
  });
