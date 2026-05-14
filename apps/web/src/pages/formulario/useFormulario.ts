import { zodResolver } from '@hookform/resolvers/zod';
import { type RuUpfData, ruFormSchema } from '@repo/shared';
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { api } from '@/api/api';
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

  const onSubmit: SubmitHandler<RuUpfData> = async (data) => {
    try {
      await api.post('/reserva', data);
      updateUser({ name: data.nome, perfil: data.perfil, matricula: data.matricula });
      showToast('Reserva registrada com sucesso!', 'success');
      reset({ ...data, data: [] });
    } catch (_) {
      showToast('Erro ao agendar a reserva.', 'error');
    }
  };

  const onError: SubmitErrorHandler<RuUpfData> = (errors) => {
    console.log(errors);
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
  };
};
