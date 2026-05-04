import z from 'zod';

export const refeicaoEnum = z.enum(['Almoço', 'Jantar', 'Almoço e jantar']);

export const perfilEnum = z.enum([
  'Aluno graduação UPF',
  'Aluno pós-graduação UPF',
  'Aluno Creati UPF',
  'Aluno Integrado UPF',
  'Professor ou Comunidade externa',
  'Funcionário UPF',
  'Residente multiprofissional',
  'Estudante rede municipal/estadual',
]);

export const reservaDiaSchema = z.object({
  data: z.string(),
  refeicao: refeicaoEnum,
});

export const ruFormSchema = z
  .object({
    email: z.email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
    nome: z.string().min(3, 'O nome deve conter pelo menos 3 caracteres'),
    matricula: z
      .string()
      .regex(/^\d*$/, 'A matrícula deve conter apenas números')
      .optional(),
    perfil: perfilEnum,
    data: z
      .array(reservaDiaSchema)
      .min(1, 'Você deve informar pelo menos uma data'),
  })
  .superRefine((data, ctx) => {
    if (
      data.perfil === 'Aluno graduação UPF' &&
      (!data.matricula || data.matricula.trim() === '')
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o número da matrícula',
        path: ['matricula'],
      });
    }
  });

export type RuUpfData = z.infer<typeof ruFormSchema>;

export const GOOGLE_ENTRIES = {
  NOME: 'entry.1773563523',
  MATRICULA: 'entry.1642444040',
  REFEICAO: 'entry.24359638',
  PERFIL: 'entry.919059448',
  DATA: 'entry.438994047', // _year, _month, _day
  PROD: {
    NOME: 'entry.1773563523',
    MATRICULA: 'entry.1642444040',
    REFEICAO: 'entry.24359638',
    PERFIL: 'entry.919059448',
    DATA: 'entry.438994047', // _year, _month, _day
  },
  STAGING: {
    EMAIL: 'entry.1492417277',
    DATA: 'entry.1801437263',
    REFEICAO: 'entry.1988784789',
    NOME: 'entry.1076655601',
    PERFIL: 'entry.336191021',
    MATRICULA: 'entry.1251347209',
  },
} as const;

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
