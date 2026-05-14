import type { CardapioDia, GetCardapioQuery } from '@repo/shared';
import { db } from '../../db/schema';

export function getCardapio(params: GetCardapioQuery): CardapioDia[] {
  let query = 'SELECT * FROM cardapio WHERE universidade = ?';
  const queryParams: (string | number)[] = [params.universidade];

  if (params.dataInicio) {
    query += ' AND data >= ?';
    queryParams.push(params.dataInicio);
  }

  if (params.dataFim) {
    query += ' AND data <= ?';
    queryParams.push(params.dataFim);
  }

  if (params.tipo) {
    query += ' AND tipo = ?';
    queryParams.push(params.tipo);
  }

  query += ' ORDER BY data ASC';

  const stmt = db.prepare(query);
  const rows = stmt.all(...queryParams) as {
    id: string;
    universidade: string;
    data: string;
    tipo: string;
    menu_do_dia: string;
    saladas: string;
    suco: string;
  }[];

  return rows.map((row) => ({
    id: row.id,
    universidade: row.universidade as CardapioDia['universidade'],
    data: row.data,
    tipo: row.tipo as CardapioDia['tipo'],
    menuDoDia: JSON.parse(row.menu_do_dia),
    saladas: JSON.parse(row.saladas),
    suco: row.suco ? JSON.parse(row.suco) : undefined,
  }));
}
