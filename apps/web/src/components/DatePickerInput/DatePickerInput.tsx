import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { type DateCalendarProps } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { DatePickerDialog } from '../DatePickerDialog/DatePickerDialog';

type DatePickerInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  control: Control<T>;
  calendarProps?: Omit<DateCalendarProps, 'value' | 'onChange'>;
};

export function DatePickerInput<T extends FieldValues>({
  name,
  label,
  control,
  calendarProps,
}: DatePickerInputProps<T>) {
  const [open, setOpen] = useState(false);
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Exibir as datas formatadas e separadas por vírgula
  const displayValue =
    Array.isArray(value) && value.length > 0
      ? value
          .map((d: string | Dayjs) => dayjs(d).format('DD/MM/YYYY'))
          .sort(
            (a: string, b: string) =>
              dayjs(a, 'DD/MM/YYYY').unix() - dayjs(b, 'DD/MM/YYYY').unix(),
          )
          .join(', ')
      : '';

  const handleDateChange = (newDates: Dayjs[]) => {
    // Converte Dayjs[] para string[] conforme o schema espera
    onChange(newDates.map((d) => d.toISOString()));
  };

  return (
    <>
      <TextField
        fullWidth
        label={label}
        value={displayValue}
        error={!!error}
        helperText={error?.message}
        onClick={handleOpen}
        slotProps={{
          input: {
            readOnly: true,
            ref: ref,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleOpen} edge="end">
                  <CalendarIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiInputBase-root': {
            cursor: 'pointer',
          },
          '& .MuiOutlinedInput-input': {
            cursor: 'pointer',
          },
        }}
      />

      <DatePickerDialog
        open={open}
        onClose={handleClose}
        value={value}
        onChange={handleDateChange}
        label={label}
        calendarProps={calendarProps}
      />
    </>
  );
}
