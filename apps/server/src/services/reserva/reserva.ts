import { RESERVA_STATUS, type RuUpfData } from '@repo/shared';
import dayjs from 'dayjs';
import { db } from '@/db/schema';
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

function registrarHistorico(reservaId: string, acao: ReservaAcao) {
  db.prepare(
    `INSERT INTO reserva_historico (id, reserva_id, acao) VALUES (?, ?, ?)`,
  ).run(crypto.randomUUID(), reservaId, acao);
}

export function getReservasByUser(
  userId: string,
  params: ReservaListParams,
): PaginatedReservas {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 10));
  const order = params.order === 'asc' ? 'ASC' : 'DESC';
  const sortColumn: AllowedSortColumn = ALLOWED_SORT_COLUMNS.includes(
    params.sort as AllowedSortColumn,
  )
    ? (params.sort as AllowedSortColumn)
    : 'data_reserva';

  const offset = (page - 1) * pageSize;

  const { count } = db
    .prepare('SELECT COUNT(*) as count FROM schedules WHERE user_id = ?')
    .get(userId) as { count: number };

  const data = db
    .prepare(
      `SELECT id, data_reserva, refeicao,
              CASE WHEN data_reserva < date('now') THEN ? ELSE status END as status,
              created_at
       FROM schedules
       WHERE user_id = ?
       ORDER BY ${sortColumn} ${order}
       LIMIT ? OFFSET ?`,
    )
    .all(RESERVA_STATUS.INATIVA, userId, pageSize, offset) as ReservaItem[];

  return { data, total: count, page, pageSize };
}

export function getHistoricoReserva(
  reservaId: string,
  userId: string,
): ReservaHistoricoItem[] | null {
  const reserva = db
    .prepare(`SELECT id, created_at FROM schedules WHERE id = ? AND user_id = ?`)
    .get(reservaId, userId) as { id: string; created_at: string } | null;

  if (!reserva) return null;

  const historico = db
    .prepare(
      `SELECT id, reserva_id, acao, created_at FROM reserva_historico WHERE reserva_id = ? ORDER BY created_at ASC`,
    )
    .all(reservaId) as ReservaHistoricoItem[];

  if (historico.length === 0) {
    const entradaCriada: ReservaHistoricoItem = {
      id: 'retroativo',
      reserva_id: reservaId,
      acao: 'criada',
      created_at: reserva.created_at,
    };
    return [entradaCriada];
  }

  return historico;
}

export function cancelarReserva(
  reservaId: string,
  userId: string,
): { success: true } | { success: false; reason: 'not_found' | 'cannot_cancel' } {
  const reserva = db
    .prepare(
      `SELECT id, status, data_reserva FROM schedules WHERE id = ? AND user_id = ?`,
    )
    .get(reservaId, userId) as {
    id: string;
    status: number;
    data_reserva: string;
  } | null;

  if (!reserva) return { success: false, reason: 'not_found' };

  const ePassado = reserva.data_reserva < dayjs().format('YYYY-MM-DD');
  const podeCancelar =
    !ePassado &&
    (reserva.status === RESERVA_STATUS.PENDENTE ||
      reserva.status === RESERVA_STATUS.NAO_AGENDADA);

  if (!podeCancelar) return { success: false, reason: 'cannot_cancel' };

  db.prepare('UPDATE schedules SET status = ? WHERE id = ?').run(
    RESERVA_STATUS.CANCELADA,
    reservaId,
  );
  registrarHistorico(reservaId, 'cancelada');
  return { success: true };
}

export function reativarReserva(
  reservaId: string,
  userId: string,
): { success: true } | { success: false; reason: 'not_found' | 'cannot_reactivate' } {
  const reserva = db
    .prepare(
      `SELECT id, status, data_reserva FROM schedules WHERE id = ? AND user_id = ?`,
    )
    .get(reservaId, userId) as {
    id: string;
    status: number;
    data_reserva: string;
  } | null;

  if (!reserva) return { success: false, reason: 'not_found' };

  const ePassado = reserva.data_reserva < dayjs().format('YYYY-MM-DD');
  const podeReativar = !ePassado && reserva.status === RESERVA_STATUS.CANCELADA;

  if (!podeReativar) return { success: false, reason: 'cannot_reactivate' };

  db.prepare('UPDATE schedules SET status = ? WHERE id = ?').run(
    RESERVA_STATUS.PENDENTE,
    reservaId,
  );
  registrarHistorico(reservaId, 'reativada');
  return { success: true };
}

export function processReserva(body: RuUpfData, userId: string) {
  db.prepare(
    `UPDATE users SET nome=?, perfil=?, matricula=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
  ).run(body.nome, body.perfil, body.matricula ?? null, userId);

  const inserirSchedule = db.prepare(`
    INSERT OR IGNORE INTO schedules (id, user_id, data_reserva, refeicao, status)
    VALUES ($id, $user_id, $data, $refeicao, $status)
  `);

  const transaction = db.transaction((dates: RuUpfData['data']) => {
    for (const item of dates) {
      const reservaId = crypto.randomUUID();
      const inserido = inserirSchedule.run({
        $id: reservaId,
        $user_id: userId,
        $data: dayjs(item.data).format('YYYY-MM-DD'),
        $refeicao: item.refeicao,
        $status: RESERVA_STATUS.PENDENTE,
      });

      if (inserido.changes > 0) {
        registrarHistorico(reservaId, 'criada');
      }
    }
  });

  transaction(body.data);
}
