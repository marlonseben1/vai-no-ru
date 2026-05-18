import { cron } from '@elysiajs/cron';
import dayjs from 'dayjs';
import { prisma } from '../db/client';

export const ruAutomationJob = cron({
  name: 'daily-ru-automation',
  pattern: '30 9,15 * * 1-5',
  async run() {
    const today = dayjs().format('YYYY-MM-DD');
    const now = dayjs().format('HH:mm');

    console.log(`[${now}] Verificando reservas para: ${today}`);

    const pending = await prisma.schedules.findMany({
      where: { data_reserva: today, processado: 0 },
      select: { id: true, refeicao: true, status: true },
    });

    for (const row of pending) {
      try {
        // TODO: Aqui entrará a função de fetch para o Google Forms

        await prisma.schedules.update({
          where: { id: row.id },
          data: { processado: 1 },
        });
      } catch (error) {
        console.error(`Erro ao processar reserva ${row.id}:`, error);
      }
    }
  },
});
