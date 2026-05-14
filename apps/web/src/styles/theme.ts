import { createTheme, alpha, responsiveFontSizes } from '@mui/material';
import { colorPalette } from './colorPalette';

// Module augmentation to support custom typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    titleXXL: React.CSSProperties;
    titleXL: React.CSSProperties;
    titleLG: React.CSSProperties;
    titleMD: React.CSSProperties;
    titleSM: React.CSSProperties;
    titleXS: React.CSSProperties;
    bodyLG: React.CSSProperties;
    bodyMD: React.CSSProperties;
    bodySM: React.CSSProperties;
    bodyXS: React.CSSProperties;
    bodyXXS: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    titleXXL?: React.CSSProperties;
    titleXL?: React.CSSProperties;
    titleLG?: React.CSSProperties;
    titleMD?: React.CSSProperties;
    titleSM?: React.CSSProperties;
    titleXS?: React.CSSProperties;
    bodyLG?: React.CSSProperties;
    bodyMD?: React.CSSProperties;
    bodySM?: React.CSSProperties;
    bodyXS?: React.CSSProperties;
    bodyXXS?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    titleXXL: true;
    titleXL: true;
    titleLG: true;
    titleMD: true;
    titleSM: true;
    titleXS: true;
    bodyLG: true;
    bodyMD: true;
    bodySM: true;
    bodyXS: true;
    bodyXXS: true;
  }
}

const baseTheme = createTheme({
  palette: {
    primary: {
      light: colorPalette.primary[400],
      main: colorPalette.primary[500],
      dark: colorPalette.primary[700],
      contrastText: colorPalette.neutral[0],
    },
    background: {
      default: colorPalette.neutral[50],
      paper: colorPalette.neutral[0],
    },
    text: {
      primary: colorPalette.neutral[800],
      secondary: colorPalette.neutral[600],
    },
    divider: colorPalette.neutral[200],
    success: colorPalette.success,
    warning: colorPalette.warning,
    error: colorPalette.error,
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Inter", sans-serif',
    titleXXL: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      fontFamily: '"Poppins", sans-serif',
    },
    titleXL: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      fontFamily: '"Poppins", sans-serif',
    },
    titleLG: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
      fontFamily: '"Poppins", sans-serif',
    },
    titleMD: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Poppins", sans-serif',
    },
    titleSM: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Poppins", sans-serif',
    },
    titleXS: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Poppins", sans-serif',
    },
    bodyLG: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: '"Roboto", sans-serif',
    },
    bodyMD: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: '"Roboto", sans-serif',
    },
    bodySM: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: '"Roboto", sans-serif',
    },
    bodyXS: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: '"Roboto", sans-serif',
    },
    bodyXXS: {
      fontSize: '0.625rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: '"Roboto", sans-serif',
    },
    h1: { fontSize: '2.5rem', fontWeight: 800 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.75rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1.125rem', fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          titleXXL: 'h1',
          titleXL: 'h2',
          titleLG: 'h3',
          titleMD: 'h4',
          titleSM: 'h5',
          titleXS: 'h6',
          bodyLG: 'p',
          bodyMD: 'p',
          bodySM: 'p',
          bodyXS: 'p',
          bodyXXS: 'p',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          boxShadow: 'none',
          borderRadius: '8px',
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(colorPalette.primary[500], 0.2)}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: `0 4px 20px ${alpha(colorPalette.neutral[900], 0.05)}`,
          border: `1px solid ${colorPalette.neutral[100]}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colorPalette.primary[300],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colorPalette.primary[500],
            borderWidth: '2px',
          },
          '&.Mui-disabled': {
            backgroundColor: colorPalette.neutral[100],
          },
        },
        notchedOutline: {
          borderColor: colorPalette.neutral[200],
          transition: 'border-color 0.2s ease-in-out',
        },
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
