import { RESERVA_STATUS } from '@repo/shared';
import dayjs from 'dayjs';
import type { Prisma } from '@/db/prisma/index.js';
import type { ReservaListParams } from '@/types/reserva.types';

function buildDataReservaConditions(
  params: ReservaListParams,
  today: string,
): Prisma.schedulesWhereInput[] {
  const conditions: Prisma.schedulesWhereInput[] = [];

  if (params.dataFiltro) {
    if (params.dataFiltro === 'essa_semana') {
      const diaSemana = dayjs().day();
      const diasDesdeSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
      const segunda = dayjs()
        .subtract(diasDesdeSegunda, 'day')
        .format('YYYY-MM-DD');
      const domingo = dayjs()
        .subtract(diasDesdeSegunda, 'day')
        .add(6, 'day')
        .format('YYYY-MM-DD');
      conditions.push({ data_reserva: { gte: segunda, lte: domingo } });
    } else if (params.dataFiltro === 'semana_passada') {
      const diaSemana = dayjs().day();
      const diasDesdeSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
      const segundaPassada = dayjs()
        .subtract(diasDesdeSegunda + 7, 'day')
        .format('YYYY-MM-DD');
      const domingoPassado = dayjs()
        .subtract(diasDesdeSegunda + 1, 'day')
        .format('YYYY-MM-DD');
      conditions.push({
        data_reserva: { gte: segundaPassada, lte: domingoPassado },
      });
    } else if (
      params.dataFiltro === 'personalizado' &&
      params.dataInicio &&
      params.dataFim
    ) {
      conditions.push({
        data_reserva: {
          gte: params.dataInicio,
          lte: params.dataFim,
        },
      });
    }
  }

  if (params.situacao !== undefined) {
    if (params.situacao === RESERVA_STATUS.INATIVA) {
      conditions.push({ data_reserva: { lt: today } });
    } else {
      conditions.push({ data_reserva: { gte: today } });
    }
  }

  return conditions;
}

export function buildWhereClause(
  userId: string,
  params: ReservaListParams,
  today: string,
): Prisma.schedulesWhereInput {
  const andConditions = buildDataReservaConditions(params, today);

  const statusCondition =
    params.situacao !== undefined && params.situacao !== RESERVA_STATUS.INATIVA
      ? { status: params.situacao }
      : undefined;

  return {
    user_id: userId,
    ...(params.refeicao ? { refeicao: params.refeicao } : {}),
    ...(statusCondition ?? {}),
    ...(andConditions.length > 0 ? { AND: andConditions } : {}),
  };
}
