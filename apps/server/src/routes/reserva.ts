import { jwt } from '@elysiajs/jwt';
import { ruFormSchema } from '@repo/shared';
import { Elysia } from 'elysia';
import { processReserva } from '../services/reserva';

if (!process.env.JWT_SECRET) {
  throw new Error('A variável JWT_SECRET não está definida');
}

export const reservaRoutes = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET,
    }),
  )
  .onBeforeHandle(async ({ jwt, headers: { authorization }, set }) => {
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null;

    if (!token) {
      set.status = 401;
      return { success: false, message: 'Token ausente.' };
    }

    const payload = await jwt.verify(token);
    if (!payload) {
      set.status = 401;
      return { success: false, message: 'Token inválido.' };
    }
  })
  .post(
    '/reserva',
    ({ body }) => {
      const userId = processReserva(body);

      return {
        success: true,
        message: `Agendamento de ${body.data.length} dias concluído.`,
        userId,
      };
    },
    {
      body: ruFormSchema,
    },
  );
