import z from 'zod';

export const universidadeEnum = z.enum(['upf']);

export const tipoRefeicaoCardapioEnum = z.enum([
  'Almoço',
  'Jantar',
  'Almoço e Jantar',
]);

export const iconeRefeicaoSchema = z.object({
  nome: z.string(),
  iconeId: z.string(),
});

export const itemRefeicaoSchema = z.object({
  nome: z.string(),
  icone: iconeRefeicaoSchema.optional(),
});

export const cardapioDiaSchema = z.object({
  id: z.string().optional(),
  universidade: universidadeEnum,
  data: z.string(), // YYYY-MM-DD
  tipo: tipoRefeicaoCardapioEnum,
  menuDoDia: z.array(itemRefeicaoSchema),
  saladas: z.array(z.string()),
  suco: z.array(itemRefeicaoSchema).optional(),
});

export type CardapioDia = z.infer<typeof cardapioDiaSchema>;
export type ItemRefeicao = z.infer<typeof itemRefeicaoSchema>;

export const getCardapioQuerySchema = z.object({
  universidade: universidadeEnum.default('upf'),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  tipo: tipoRefeicaoCardapioEnum.optional(),
});

export type GetCardapioQuery = z.infer<typeof getCardapioQuerySchema>;
