import type { SelectOption } from '@/components/SelectFieldInput/SelectFieldInput';
import { perfilEnum, refeicaoEnum } from '@repo/shared';

export const refeicaoOptions: SelectOption[] = refeicaoEnum.options.map(
  (label) => ({
    value: label,
    label,
  }),
);

export const perfilOptions: SelectOption[] = perfilEnum.options.map(
  (label) => ({
    value: label,
    label,
  }),
);
