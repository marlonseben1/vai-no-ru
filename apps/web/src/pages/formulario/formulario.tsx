import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { perfilOptions } from '@/shared/constants/constants';
import { DatePickerInput } from '../../components/datePickerInput/datePickerInput';
import { SelectFieldInput } from '../../components/selectFieldInput/selectFieldInput';
import { TextFieldInput } from '../../components/textFieldInput/textFieldInput';
import { useFormulario } from './useFormulario';

export const Formulario = () => {
  const { reset, control, onError, onSubmit, isAlunoUpf, handleSubmit } =
    useFormulario();

  return (
    <Paper
      elevation={3}
      sx={{ borderRadius: 2, maxWidth: 800, mx: 'auto', p: 4, mt: 2 }}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            color="primary"
          >
            Reserva RU - UPF
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nunca mais perca o desconto na sua refeição no RU!
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={4}>
          <Grid size={12}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              mb={2}
            >
              Dados Pessoais
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldInput
                  name="nome"
                  required
                  control={control}
                  label="Nome completo"
                  placeholder="Seu nome"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldInput
                  name="email"
                  control={control}
                  required
                  label="E-mail"
                  placeholder="exemplo@upf.br"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              mb={2}
            >
              Sua Reserva
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <DatePickerInput
                  name="data"
                  control={control}
                  label="Datas e Refeições"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              mb={2}
            >
              Perfil e Identificação
            </Typography>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid size={{ xs: 12, md: isAlunoUpf ? 8 : 12 }}>
                <SelectFieldInput
                  control={control}
                  label="Seu Perfil"
                  name="perfil"
                  options={perfilOptions}
                />
              </Grid>
              {isAlunoUpf && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextFieldInput
                    name="matricula"
                    control={control}
                    required
                    label="Matrícula"
                    placeholder="Ex: 123456"
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid size={12}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<DeleteIcon />}
                onClick={() => reset()}
              >
                Limpar
              </Button>
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{ px: 4, fontWeight: 'bold' }}
              >
                Registrar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
