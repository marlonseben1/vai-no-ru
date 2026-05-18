import { RESERVA_STATUS, type RuUpfData } from '@repo/shared';
import dayjs from 'dayjs';
import { prisma } from '@/db/client';
import type {
  PaginatedReservas,
  ReservaAcao,
  ReservaHistoricoItem,
  ReservaItem,
  ReservaListParams,
} from '@/types/reserva';

export type { PaginatedReservas, ReservaItem, ReservaListParams };

const ALLOWED_SORT_COLUMNS = [
  'data_reserva',
  'refeicao',
  'status',
  'created_at',
] as const;
type AllowedSortColumn = (typeof ALLOWED_SORT_COLUMNS)[number];

type ClienteTx = Pick<typeof prisma, 'reserva_historico'>;

async function registrarHistorico(
  cliente: ClienteTx,
  reservaId: string,
  acao: ReservaAcao,
): Promise<void> {
  await cliente.reserva_historico.create({
    data: {
      id: crypto.randomUUID(),
      reserva_id: reservaId,
      acao,
    },
  });
}

export async function getReservasByUser(
  userId: string,
  params: ReservaListParams,
): Promise<PaginatedReservas> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 10));
  const order = params.order === 'asc' ? 'asc' : 'desc';
  const sortColumn: AllowedSortColumn = ALLOWED_SORT_COLUMNS.includes(
    params.sort as AllowedSortColumn,
  )
    ? (params.sort as AllowedSortColumn)
    : 'data_reserva';

  const offset = (page - 1) * pageSize;
  const today = dayjs().format('YYYY-MM-DD');

  const [total, rows] = await Promise.all([
    prisma.schedules.count({ where: { user_id: userId } }),
    prisma.schedules.findMany({
      where: { user_id: userId },
      orderBy: { [sortColumn]: order },
      skip: offset,
      take: pageSize,
      select: {
        id: true,
        data_reserva: true,
        refeicao: true,
        status: true,
        created_at: true,
      },
    }),
  ]);

  const data: ReservaItem[] = rows.map((r) => ({
    id: r.id,
    data_reserva: r.data_reserva,
    refeicao: r.refeicao,
    status: (r.data_reserva < today
      ? RESERVA_STATUS.INATIVA
      : r.status) as ReservaItem['status'],
    created_at: r.created_at ? dayjs(r.created_at).toISOString() : '',
  }));

  return { data, total, page, pageSize };
}

export async function getHistoricoReserva(
  reservaId: string,
  userId: string,
): Promise<ReservaHistoricoItem[] | null> {
  const reserva = await prisma.schedules.findFirst({
    where: { id: reservaId, user_id: userId },
    select: { id: true, created_at: true },
  });

  if (!reserva) return null;

  const historico = await prisma.reserva_historico.findMany({
    where: { reserva_id: reservaId },
    orderBy: { created_at: 'asc' },
    select: { id: true, reserva_id: true, acao: true, created_at: true },
  });

  if (historico.length === 0) {
    const entradaCriada: ReservaHistoricoItem = {
      id: 'retroativo',
      reserva_id: reservaId,
      acao: 'criada',
      created_at: reserva.created_at
        ? dayjs(reserva.created_at).toISOString()
        : '',
    };
    return [entradaCriada];
  }

  return historico.map((h) => ({
    id: h.id,
    reserva_id: h.reserva_id,
    acao: h.acao as ReservaAcao,
    created_at: h.created_at ? dayjs(h.created_at).toISOString() : '',
  }));
}

export async function cancelarReserva(
  reservaId: string,
  userId: string,
): Promise<
  { success: true } | { success: false; reason: 'not_found' | 'cannot_cancel' }
> {
  return prisma.$transaction(async (tx) => {
    const reserva = await tx.schedules.findFirst({
      where: { id: reservaId, user_id: userId },
      select: { id: true, status: true, data_reserva: true },
    });

    if (!reserva) return { success: false, reason: 'not_found' as const };

    const ePassado = reserva.data_reserva < dayjs().format('YYYY-MM-DD');
    const podeCancelar =
      !ePassado &&
      (reserva.status === RESERVA_STATUS.PENDENTE ||
        reserva.status === RESERVA_STATUS.NAO_AGENDADA);

    if (!podeCancelar)
      return { success: false, reason: 'cannot_cancel' as const };

    await tx.schedules.update({
      where: { id: reservaId },
      data: { status: RESERVA_STATUS.CANCELADA },
    });
    await registrarHistorico(tx, reservaId, 'cancelada');

    return { success: true as const };
  });
}

export async function reativarReserva(
  reservaId: string,
  userId: string,
): Promise<
  | { success: true }
  | { success: false; reason: 'not_found' | 'cannot_reactivate' }
> {
  return prisma.$transaction(async (tx) => {
    const reserva = await tx.schedules.findFirst({
      where: { id: reservaId, user_id: userId },
      select: { id: true, status: true, data_reserva: true },
    });

    if (!reserva) return { success: false, reason: 'not_found' as const };

    const ePassado = reserva.data_reserva < dayjs().format('YYYY-MM-DD');
    const podeReativar =
      !ePassado && reserva.status === RESERVA_STATUS.CANCELADA;

    if (!podeReativar)
      return { success: false, reason: 'cannot_reactivate' as const };

    await tx.schedules.update({
      where: { id: reservaId },
      data: { status: RESERVA_STATUS.PENDENTE },
    });
    await registrarHistorico(tx, reservaId, 'reativada');

    return { success: true as const };
  });
}

export async function processReserva(
  body: RuUpfData,
  userId: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.users.update({
      where: { id: userId },
      data: {
        nome: body.nome,
        perfil: body.perfil,
        matricula: body.matricula ?? null,
        updated_at: new Date(),
      },
    });

    const datas = body.data.map((item) =>
      dayjs(item.data).format('YYYY-MM-DD'),
    );
    const existentes = await tx.schedules.findMany({
      where: { user_id: userId, data_reserva: { in: datas } },
      select: { data_reserva: true },
    });
    const datasExistentes = new Set(existentes.map((e) => e.data_reserva));

    for (const item of body.data) {
      const formattedDate = dayjs(item.data).format('YYYY-MM-DD');

      if (datasExistentes.has(formattedDate)) continue;

      const reservaId = crypto.randomUUID();
      await tx.schedules.create({
        data: {
          id: reservaId,
          user_id: userId,
          data_reserva: formattedDate,
          refeicao: item.refeicao,
          status: RESERVA_STATUS.PENDENTE,
        },
      });
      await registrarHistorico(tx, reservaId, 'criada');
    }
  });
}
