import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import {
  DateCalendar,
  type DateCalendarProps,
} from '@mui/x-date-pickers/DateCalendar';
import {
  PickersDay,
  type PickersDayProps,
} from '@mui/x-date-pickers/PickersDay';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  value: (string | Dayjs)[];
  onChange: (newValues: Dayjs[]) => void;
  label?: string;
  calendarProps?: Omit<DateCalendarProps, 'value' | 'onChange'>;
}

export function DatePickerDialog({
  open,
  onClose,
  value,
  onChange,
  label,
  calendarProps,
}: DatePickerDialogProps) {
  const selectedDates = Array.isArray(value) ? value.map((d) => dayjs(d)) : [];

  const handleToggleDate = (date: Dayjs | null) => {
    if (!date) return;

    const isSelected = selectedDates.some((d) => d.isSame(date, 'day'));
    const newDates = isSelected
      ? selectedDates.filter((d) => !d.isSame(date, 'day'))
      : [...selectedDates, date];

    onChange(newDates);
  };

  const CustomDay = (props: PickersDayProps) => {
    const isSelected = selectedDates.some((d) => d.isSame(props.day, 'day'));

    return <PickersDay {...props} selected={isSelected} />;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
            },
          },
        }}
      >
        {label && (
          <DialogTitle sx={{ pb: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
            {label}
          </DialogTitle>
        )}
        <DialogContent sx={{ p: 1 }}>
          <DateCalendar
            {...calendarProps}
            value={null}
            onChange={handleToggleDate}
            slots={{
              day: CustomDay,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2 }}
          >
            Confirmar ({selectedDates.length})
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
