import type { CardapioDia as SharedCardapioDia } from '@repo/shared';

export type CardapioDia = SharedCardapioDia;

export interface FetchCardapioParams {
  dataInicio: string;
  dataFim: string;
}

export interface CardapioResponse {
  success: boolean;
  data: CardapioDia[];
}
