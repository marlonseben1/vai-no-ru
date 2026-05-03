import { cors } from '@elysiajs/cors';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Elysia } from 'elysia';
import { ruAutomationJob } from './jobs/ru-automation';
import { authRoutes } from './routes/auth';
import { reservaRoutes } from './routes/reserva';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');

const app = new Elysia()
  .use(cors())
  .use(ruAutomationJob)
  .use(reservaRoutes)
  .use(authRoutes)
  .listen(3003);

console.log(
  `🦊 Elysia (upf-ru-autofiller) rodando na porta ${app.server?.port}`,
);
