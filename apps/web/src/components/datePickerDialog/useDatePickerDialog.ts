import { type ReservaDia, refeicaoEnum } from '@repo/shared';
import dayjs, { type Dayjs } from 'dayjs';

interface UseDatePickerDialogProps {
  value: ReservaDia[];
  onChange: (newValues: ReservaDia[]) => void;
}

export function useDatePickerDialog({
  value,
  onChange,
}: UseDatePickerDialogProps) {
  const selectedDates = Array.isArray(value)
    ? value.map((d) => ({ date: dayjs(d.data), refeicao: d.refeicao }))
    : [];

  const handleToggleDate = (date: Dayjs | null) => {
    if (!date) return;

    const isSelected = selectedDates.some((d) => d.date.isSame(date, 'day'));
    if (isSelected) {
      const newDates = selectedDates.filter((d) => !d.date.isSame(date, 'day'));
      onChange(
        newDates.map((d) => ({
          data: d.date.toISOString(),
          refeicao: d.refeicao,
        })),
      );
    } else {
      const newDates = [
        ...selectedDates,
        { date, refeicao: refeicaoEnum.options[0] as ReservaDia['refeicao'] },
      ];
      onChange(
        newDates.map((d) => ({
          data: d.date.toISOString(),
          refeicao: d.refeicao,
        })),
      );
    }
  };

  const handleChangeRefeicao = (
    dateToChange: Dayjs,
    newMeal: ReservaDia['refeicao'],
  ) => {
    const newDates = selectedDates.map((d) => {
      if (d.date.isSame(dateToChange, 'day')) {
        return { data: d.date.toISOString(), refeicao: newMeal };
      }
      return { data: d.date.toISOString(), refeicao: d.refeicao };
    });
    onChange(newDates);
  };

  const handleRemoveDate = (dateToRemove: Dayjs) => {
    const newDates = selectedDates.filter(
      (d) => !d.date.isSame(dateToRemove, 'day'),
    );
    onChange(
      newDates.map((d) => ({
        data: d.date.toISOString(),
        refeicao: d.refeicao,
      })),
    );
  };

  return {
    selectedDates,
    handleToggleDate,
    handleChangeRefeicao,
    handleRemoveDate,
  };
}
