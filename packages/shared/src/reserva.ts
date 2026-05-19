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

export type ReservaDia = z.infer<typeof reservaDiaSchema>;

export const ruFormSchema = z
  .object({
    nome: z.string().min(3, 'O nome deve conter pelo menos 3 caracteres'),
    matricula: z
      .string()
      .regex(/^\d*$/, 'A matrícula deve conter apenas números')
      .optional(),
    perfil: perfilEnum,
    data: z
      .array(reservaDiaSchema)
      .min(1, 'Você deve informar pelo menos uma data')
      .refine((dias) => {
        const hoje = new Date().toISOString().slice(0, 10);
        return dias.every((d) => d.data.slice(0, 10) >= hoje);
      }, 'Não é possível reservar datas passadas')
      .refine((dias) => {
        return dias.every((d) => {
          const diaSemana = new Date(d.data).getUTCDay();
          return diaSemana !== 0 && diaSemana !== 6;
        });
      }, 'Reservas só podem ser feitas de segunda a sexta'),
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

export const RESERVA_STATUS = {
  PENDENTE: 0,
  AGENDADA: 1,
  NAO_AGENDADA: 2,
  INATIVA: 3,
  CANCELADA: 4,
} as const;

export type ReservaStatus =
  (typeof RESERVA_STATUS)[keyof typeof RESERVA_STATUS];
