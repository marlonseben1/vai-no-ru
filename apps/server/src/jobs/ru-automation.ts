import { cron } from '@elysiajs/cron';
import { RESERVA_STATUS } from '@repo/shared';
import dayjs from 'dayjs';
import { prisma } from '@/db/client';
import { submitReserva } from '@/services/google-forms/google-forms.services';
import { ReservaService } from '@/services/reserva/reserva.services';

async function submitReservasPendentes(
  tentativasFiltro: number[],
): Promise<void> {
  const hoje = dayjs().format('YYYY-MM-DD');
  const agora = dayjs().format('HH:mm');
  console.log(`[${agora}] Verificando reservas para: ${hoje}`);

  const pendentes = await prisma.schedules.findMany({
    where: {
      data_reserva: hoje,
      status: RESERVA_STATUS.PENDENTE,
      tentativas: { in: tentativasFiltro },
    },
    include: { user: true },
  });

  for (const reserva of pendentes) {
    try {
      const sucesso = await submitReserva({
        nome: reserva.user.nome,
        matricula: reserva.user.matricula,
        perfil: reserva.user.perfil,
        email: reserva.user.email,
        refeicao: reserva.refeicao,
        dataReserva: reserva.data_reserva,
      });

      if (sucesso) {
        await ReservaService.marcarAgendada(reserva.id);
      } else {
        await ReservaService.registrarTentativaFalha(
          reserva.id,
          reserva.tentativas,
        );
      }
    } catch (error) {
      console.error(`Erro ao processar reserva ${reserva.id}:`, error);
    }
  }
}

export const submitDiaJob = cron({
  name: 'daily-ru-automation',
  pattern: '30 9,15 * * 1-5',
  async run() {
    await submitReservasPendentes([0]);
  },
});

export const submitNoiteJob = cron({
  name: 'daily-ru-automation-noturno',
  pattern: '0 23 * * 1-5',
  async run() {
    await submitReservasPendentes([0]);
  },
});

export const retryDiaJob = cron({
  name: 'daily-ru-automation-retry',
  pattern: '35,40 9,15 * * 1-5',
  async run() {
    await submitReservasPendentes([1, 2]);
  },
});

export const retryNoiteJob = cron({
  name: 'daily-ru-automation-retry-noturno',
  pattern: '5,10 23 * * 1-5',
  async run() {
    await submitReservasPendentes([1, 2]);
  },
});
