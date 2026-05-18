import { jwt } from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/db/client';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

if (!process.env.JWT_SECRET) {
  throw new Error('A variável JWT_SECRET não está definida no arquivo .env');
}

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET,
    }),
  )
  .post(
    '/google',
    async ({ body, jwt, set }) => {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: body.token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
          set.status = 401;
          return { error: 'Payload do Google inválido ou sem e-mail' };
        }

        const user = await prisma.users.findUnique({
          where: { email: payload.email },
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
            matricula: true,
          },
        });

        if (!user) {
          set.status = 403;
          return { error: 'Usuário não existe.' };
        }

        const authToken = await jwt.sign({
          sub: user.id,
        });

        return {
          token: authToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.nome,
            picture: payload.picture,
            perfil: user.perfil,
            matricula: user.matricula,
          },
        };
      } catch (_) {
        set.status = 401;
        return { error: 'Falha na autenticação' };
      }
    },
    {
      body: t.Object({
        token: t.String(),
      }),
    },
  );
