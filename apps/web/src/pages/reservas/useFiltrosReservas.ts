import type { SelectChangeEvent } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import type {
  DataFiltroPreset,
  ReservaFiltros,
  ReservaStatus,
} from '@/api/reservas/reservas.types';

export function contarFiltrosAtivos(filtros: ReservaFiltros): number {
  let count = 0;
  if (filtros.dataFiltro) count++;
  if (filtros.refeicao) count++;
  if (filtros.situacao !== undefined) count++;
  return count;
}

export function useFiltrosConteudo(
  filtros: ReservaFiltros,
  onChange: (f: ReservaFiltros) => void,
) {
  function handleDataFiltro(e: SelectChangeEvent<unknown>) {
    const valor = e.target.value as DataFiltroPreset | '';
    onChange({
      ...filtros,
      dataFiltro: valor || undefined,
      dataInicio: undefined,
      dataFim: undefined,
    });
  }

  function handleRefeicao(e: SelectChangeEvent<unknown>) {
    onChange({ ...filtros, refeicao: (e.target.value as string) || undefined });
  }

  function handleSituacao(e: SelectChangeEvent<unknown>) {
    const valor = e.target.value as string | number;
    onChange({
      ...filtros,
      situacao: valor !== '' ? (Number(valor) as ReservaStatus) : undefined,
    });
  }

  function handleDataInicio(data: Dayjs | null) {
    onChange({
      ...filtros,
      dataInicio: data?.format('YYYY-MM-DD') ?? undefined,
    });
  }

  function handleDataFim(data: Dayjs | null) {
    onChange({ ...filtros, dataFim: data?.format('YYYY-MM-DD') ?? undefined });
  }

  return {
    handleDataFiltro,
    handleRefeicao,
    handleSituacao,
    handleDataInicio,
    handleDataFim,
  };
}

export function useFiltrosReservas(
  filtros: ReservaFiltros,
  onChange: (f: ReservaFiltros) => void,
) {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [pendentes, setPendentes] = useState<ReservaFiltros>({});
  const filtrosAtivos = contarFiltrosAtivos(filtros);

  function abrirDialog() {
    setPendentes(filtros);
    setDialogAberto(true);
  }

  function fecharDialog() {
    setDialogAberto(false);
  }

  function aplicar() {
    onChange(pendentes);
    setDialogAberto(false);
  }

  function limparPendentes() {
    setPendentes({});
  }

  function limparAplicados() {
    onChange({});
  }

  return {
    dialogAberto,
    pendentes,
    setPendentes,
    filtrosAtivos,
    abrirDialog,
    fecharDialog,
    aplicar,
    limparPendentes,
    limparAplicados,
  };
}
