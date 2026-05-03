import { perfilEnum, refeicaoEnum } from '@repo/shared';
import type { SelectOption } from '@/components/selectFieldInput/selectFieldInput';

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

export const MOBILE_BREAKPOINT = {
  width: 599,
  height: 1000,
  width_px: '599px',
  height_px: '1000px',
};
