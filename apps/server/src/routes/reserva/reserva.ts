import { jwt } from '@elysiajs/jwt';
import { ruFormSchema } from '@repo/shared';
import { Elysia, t } from 'elysia';
import {
  cancelarReserva,
  getHistoricoReserva,
  getReservasByUser,
  processReserva,
  reativarReserva,
} from '@/services/reserva/reserva';

if (!process.env.JWT_SECRET) {
  throw new Error('A variável JWT_SECRET não está definida');
}

export const reservaRoutes = new Elysia()
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET }))
  .derive(async ({ jwt, headers: { authorization } }) => {
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null;

    if (!token) return { currentUserId: null as string | null };

    const payload = await jwt.verify(token);
    if (!payload) return { currentUserId: null as string | null };
    return {
      currentUserId: payload.sub
        ? String(payload.sub)
        : (null as string | null),
    };
  })
  .onBeforeHandle(({ currentUserId, set }) => {
    if (!currentUserId) {
      set.status = 401;
      return { success: false, message: 'Token ausente ou inválido.' };
    }
  })
  .post(
    '/reserva',
    ({ body, currentUserId }) => {
      processReserva(body, currentUserId!);
      return {
        success: true,
        message: `Agendamento de ${body.data.length} dias concluído.`,
      };
    },
    { body: ruFormSchema },
  )
  .get(
    '/reservas',
    ({ currentUserId, query }) => {
      return getReservasByUser(currentUserId!, {
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
  .delete('/reservas/:id', ({ currentUserId, params, set }) => {
    const result = cancelarReserva(params.id, currentUserId!);
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
  .get('/reservas/:id/historico', ({ currentUserId, params, set }) => {
    const historico = getHistoricoReserva(params.id, currentUserId!);
    if (!historico) {
      set.status = 404;
      return { success: false, message: 'Reserva não encontrada.' };
    }
    return historico;
  })
  .put('/reservas/:id', ({ currentUserId, params, set }) => {
    const result = reativarReserva(params.id, currentUserId!);
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
