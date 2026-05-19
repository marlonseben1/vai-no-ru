import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import type { DateCalendarProps } from '@mui/x-date-pickers/DateCalendar';
import type { ReservaDia } from '@repo/shared';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { DatePickerDialog } from '../datePickerDialog/datePickerDialog';

type DatePickerInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  control: Control<T>;
  calendarProps?: Omit<DateCalendarProps, 'value' | 'onChange'>;
  diasBloqueados?: string[];
};

export function DatePickerInput<T extends FieldValues>({
  name,
  label,
  control,
  calendarProps,
  diasBloqueados,
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

  const displayValue =
    Array.isArray(value) && value.length > 0
      ? value
          .map((d: ReservaDia) => dayjs(d.data).format('DD/MM/YYYY'))
          .sort(
            (a: string, b: string) =>
              dayjs(a, 'DD/MM/YYYY').unix() - dayjs(b, 'DD/MM/YYYY').unix(),
          )
          .join(', ')
      : '';

  const handleDateChange = (newValues: ReservaDia[]) => {
    onChange(newValues);
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
        diasBloqueados={diasBloqueados}
      />
    </>
  );
}
