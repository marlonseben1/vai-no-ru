import { jwt } from '@elysiajs/jwt';
import { Elysia } from 'elysia';

if (!process.env.JWT_SECRET) {
  throw new Error('A variável JWT_SECRET não está definida');
}

export const authPlugin = new Elysia()
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET }))
  .derive({ as: 'scoped' }, async ({ jwt, headers: { authorization } }) => {
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
  });
