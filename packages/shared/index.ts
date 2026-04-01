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

export const ruFormSchema = z.object({
  email: z.email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
  nome: z.string().min(3, 'O nome deve conter pelo menos 3 caracteres'),
  matricula: z
    .string()
    .min(1, 'Informe o número da matrícula')
    .regex(/^\d+$/, 'A matrícula deve conter apenas números'),
  refeicao: refeicaoEnum,
  perfil: perfilEnum,
  data: z.array(z.string()).min(1, 'Você deve informar pelo menos uma data'),
});

export type RuUpfData = z.infer<typeof ruFormSchema>;

export const GOOGLE_ENTRIES = {
  NOME: 'entry.1773563523',
  MATRICULA: 'entry.1642444040',
  REFEICAO: 'entry.24359638',
  PERFIL: 'entry.919059448',
  DATA: 'entry.438994047', // _year, _month, _day
} as const;
