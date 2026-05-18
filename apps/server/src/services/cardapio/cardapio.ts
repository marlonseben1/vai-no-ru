import type { CardapioDia, GetCardapioQuery } from '@repo/shared';
import { prisma } from '@/db/client';

export async function getCardapio(
  params: GetCardapioQuery,
): Promise<CardapioDia[]> {
  const rows = await prisma.cardapio.findMany({
    where: {
      universidade: params.universidade,
      data: {
        ...(params.dataInicio ? { gte: params.dataInicio } : {}),
        ...(params.dataFim ? { lte: params.dataFim } : {}),
      },
      ...(params.tipo ? { tipo: params.tipo } : {}),
    },
    orderBy: { data: 'asc' },
  });

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
