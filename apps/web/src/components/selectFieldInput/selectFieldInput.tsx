import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  type SelectProps,
} from '@mui/material';
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface BaseSelectProps {
  label: string;
  options: readonly string[] | SelectOption[];
  selectProps?: SelectProps;
  value?: string | number;
  onChange?: (e: SelectChangeEvent<unknown>) => void;
  error?: string;
  name?: string;
}

function BaseSelect({
  label,
  options,
  selectProps,
  value,
  onChange,
  error,
  name,
}: BaseSelectProps) {
  const labelId = name ? `${name}-label` : 'select-label';

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel id={labelId} shrink>
        {label}
      </InputLabel>
      <Select
        {...selectProps}
        labelId={labelId}
        label={label}
        value={value ?? ''}
        onChange={onChange}
      >
        {options.map((option) => {
          const isString = typeof option === 'string';
          const optValue = isString ? option : option.value;
          const displayLabel = isString ? option : option.label;

          return (
            <MenuItem key={optValue} value={optValue}>
              {displayLabel}
            </MenuItem>
          );
        })}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

interface SelectFieldInputProps<T extends FieldValues> {
  name?: Path<T>;
  control?: Control<T>;
  label: string;
  options: readonly string[] | SelectOption[];
  selectProps?: SelectProps;
  value?: string | number;
  onChange?: (e: SelectChangeEvent<unknown>) => void;
}

export function SelectFieldInput<T extends FieldValues>({
  name,
  label,
  control,
  options,
  selectProps,
  value,
  onChange,
}: SelectFieldInputProps<T>) {
  if (!name || !control) {
    return (
      <BaseSelect
        label={label}
        options={options}
        selectProps={selectProps}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <ControlledSelect
      name={name}
      control={control}
      label={label}
      options={options}
      selectProps={selectProps}
    />
  );
}

interface ControlledSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly string[] | SelectOption[];
  selectProps?: SelectProps;
}

function ControlledSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  selectProps,
}: ControlledSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <BaseSelect
      name={name}
      label={label}
      options={options}
      selectProps={{ ...selectProps, ...field }}
      value={field.value}
      onChange={field.onChange}
      error={error?.message}
    />
  );
}
