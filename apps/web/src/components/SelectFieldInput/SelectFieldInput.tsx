import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from '@mui/material';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly string[] | SelectOption[];
  selectProps?: SelectProps;
}

export function SelectFieldInput<T extends FieldValues>({
  name,
  label,
  control,
  options,
  selectProps,
}: SelectFieldInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const labelId = `${name}-label`;

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel id={labelId} shrink>
        {label}
      </InputLabel>
      <Select
        {...field}
        {...selectProps}
        labelId={labelId}
        label={label}
        value={field.value ?? ''}
      >
        {options.map((option) => {
          const isString = typeof option === 'string';
          const value = isString ? option : option.value;
          const displayLabel = isString ? option : option.label;

          return (
            <MenuItem key={value} value={value}>
              {displayLabel}
            </MenuItem>
          );
        })}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}
