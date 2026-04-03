import dayjs, { Dayjs } from 'dayjs';
import type { DateMeal } from './DatePickerDialog';

interface UseDatePickerDialogProps {
  value: DateMeal[];
  onChange: (newValues: DateMeal[]) => void;
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
      const newDates = [...selectedDates, { date, refeicao: 'Jantar' }];
      onChange(
        newDates.map((d) => ({
          data: d.date.toISOString(),
          refeicao: d.refeicao,
        })),
      );
    }
  };

  const handleChangeRefeicao = (dateToChange: Dayjs, newMeal: string) => {
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
