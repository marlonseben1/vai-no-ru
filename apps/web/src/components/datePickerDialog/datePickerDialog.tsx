import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateCalendar,
  type DateCalendarProps,
} from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersDay,
  type PickersDayProps,
} from '@mui/x-date-pickers/PickersDay';
import type { ReservaDia } from '@repo/shared';
import type { Dayjs } from 'dayjs';
import { useCallback } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { refeicaoOptions } from '@/shared/constants/constants';
import { colorPalette } from '@/styles/colorPalette';
import { SelectFieldInput } from '../selectFieldInput/selectFieldInput';
import { useDatePickerDialog } from './useDatePickerDialog';

export type { ReservaDia as DateMeal };

interface DatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  value: ReservaDia[];
  onChange: (newValues: ReservaDia[]) => void;
  label?: string;
  calendarProps?: Omit<DateCalendarProps, 'value' | 'onChange'>;
  diasBloqueados?: string[];
}

function CustomDay({
  selectedDates,
  diasBloqueados,
  ...props
}: PickersDayProps & {
  selectedDates: Array<{ date: Dayjs; refeicao: string }>;
  diasBloqueados: string[];
}) {
  const isSelected = selectedDates.some((d) => d.date.isSame(props.day, 'day'));
  const isBloqueado = diasBloqueados.includes(props.day.format('YYYY-MM-DD'));

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <PickersDay {...props} selected={isSelected} />
      {isBloqueado && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: colorPalette.success.main,
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
}

export function DatePickerDialog({
  open,
  onClose,
  value,
  onChange,
  label,
  calendarProps,
  diasBloqueados,
}: DatePickerDialogProps) {
  const isMobile = useIsMobile();
  const {
    selectedDates,
    handleToggleDate,
    handleChangeRefeicao,
    handleRemoveDate,
  } = useDatePickerDialog({ value, onChange });

  const diaPersonalizado = useCallback(
    (props: PickersDayProps) => (
      <CustomDay
        {...props}
        selectedDates={selectedDates}
        diasBloqueados={diasBloqueados ?? []}
      />
    ),
    [selectedDates, diasBloqueados],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        fullWidth={isMobile}
        maxWidth={isMobile ? 'sm' : 'md'}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              margin: isMobile ? 2 : 4,
            },
          },
        }}
      >
        {label && (
          <DialogTitle sx={{ pb: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
            {label}
          </DialogTitle>
        )}
        <DialogContent
          sx={{
            p: isMobile ? 1 : 2,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            minHeight: isMobile ? 'auto' : 350,
            overflowX: 'hidden',
          }}
        >
          <Box
            sx={{
              minWidth: isMobile ? '100%' : 320,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <DateCalendar
              {...calendarProps}
              disablePast
              value={null}
              onChange={handleToggleDate}
              shouldDisableDate={(date) =>
                (diasBloqueados ?? []).includes(date.format('YYYY-MM-DD'))
              }
              slots={{ day: diaPersonalizado }}
            />
          </Box>
          {selectedDates.length > 0 && (
            <>
              {isMobile ? (
                <Divider sx={{ my: 1, width: '100%' }} />
              ) : (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 2, my: 2 }}
                />
              )}
              <Stack
                spacing={2}
                sx={{
                  px: isMobile ? 1 : 2,
                  py: 2,
                  minWidth: isMobile ? '100%' : 360,
                  maxWidth: isMobile ? '100%' : 400,
                  maxHeight: isMobile ? 300 : 350,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  width: isMobile ? '100%' : 'auto',
                  boxSizing: 'border-box',
                }}
              >
                {selectedDates
                  .slice()
                  .sort((a, b) => a.date.unix() - b.date.unix())
                  .map((d) => (
                    <Stack
                      key={d.date.toISOString()}
                      direction={isMobile ? 'column' : 'row'}
                      alignItems={isMobile ? 'flex-start' : 'center'}
                      justifyContent="space-between"
                      spacing={isMobile ? 1 : 2}
                      sx={{
                        p: 1.5,
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Typography
                        variant="bodyMD"
                        fontWeight="bold"
                        sx={{ whiteSpace: 'nowrap', minWidth: 80 }}
                      >
                        {d.date.format('DD/MM/YYYY')}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <SelectFieldInput
                            label="Refeição"
                            value={d.refeicao}
                            onChange={(e) =>
                              handleChangeRefeicao(
                                d.date,
                                e.target.value as ReservaDia['refeicao'],
                              )
                            }
                            options={refeicaoOptions}
                            selectProps={{
                              size: 'small',
                              sx: { fontSize: '0.875rem', bgcolor: 'white' },
                            }}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          sx={{ color: colorPalette.neutral[600] }}
                          onClick={() => handleRemoveDate(d.date)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  ))}
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2, py: 1.2, fontWeight: 'bold' }}
          >
            Confirmar Datas Selecionadas ({selectedDates.length})
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
