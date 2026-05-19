import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { RESERVA_STATUS, type RuUpfData, ruFormSchema } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { api } from '@/api/api';
import { QUERY_KEYS } from '@/api/queryKeys';
import { reservasApi } from '@/api/reservas/reservas';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/store/auth/authStore';

export const useFormulario = () => {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const { control, handleSubmit, reset } = useForm<RuUpfData>({
    resolver: zodResolver(ruFormSchema),
    defaultValues: {
      data: [],
      matricula: user?.matricula || '',
      nome: user?.name || '',
      perfil: (user?.perfil as RuUpfData['perfil']) || 'Aluno graduação UPF',
    },
  });

  const perfil = useWatch({ control, name: 'perfil' });
  const isAlunoUpf = perfil === 'Aluno graduação UPF';

  const { data: reservasData } = useQuery({
    queryKey: [QUERY_KEYS.reservas, 'bloqueados'],
    queryFn: () => reservasApi.fetchReservas({ pageSize: 100 }),
  });

  const hoje = dayjs().format('YYYY-MM-DD');
  const diasBloqueados: string[] = (reservasData?.data ?? [])
    .filter(
      (r) =>
        (r.status === RESERVA_STATUS.PENDENTE ||
          r.status === RESERVA_STATUS.AGENDADA) &&
        r.data_reserva >= hoje,
    )
    .map((r) => r.data_reserva.slice(0, 10));

  const onSubmit: SubmitHandler<RuUpfData> = async (data) => {
    try {
      await api.post('/reserva', data);
      updateUser({
        name: data.nome,
        perfil: data.perfil,
        matricula: data.matricula,
      });
      showToast('Reserva registrada com sucesso!', 'success');
      reset({ ...data, data: [] });
    } catch (_) {
      showToast('Erro ao agendar a reserva.', 'error');
    }
  };

  const onError: SubmitErrorHandler<RuUpfData> = (_errors) => {
    showToast('Por favor, corrija os erros no formulário.', 'error');
  };

  return {
    reset,
    logout,
    control,
    onError,
    onSubmit,
    isAlunoUpf,
    handleSubmit,
    userEmail: user?.email ?? '',
    diasBloqueados,
  };
};
