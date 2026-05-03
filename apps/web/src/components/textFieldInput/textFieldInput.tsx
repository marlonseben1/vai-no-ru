import { TextField, type TextFieldProps } from '@mui/material';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

interface TextFieldInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  placeholder: string;
  textFieldProps?: TextFieldProps;
}

export function TextFieldInput<T extends FieldValues>({
  name,
  label,
  control,
  required,
  placeholder,
  textFieldProps,
}: TextFieldInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <TextField
      fullWidth
      {...field}
      inputRef={field.ref}
      {...textFieldProps}
      required={required}
      placeholder={placeholder}
      label={label}
      error={!!error}
      helperText={error?.message}
      value={field.value ?? ''}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
}
