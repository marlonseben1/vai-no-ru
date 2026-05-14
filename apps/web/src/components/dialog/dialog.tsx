import {
  Dialog as MuiDialog,
  type DialogProps as MuiDialogProps,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  type SxProps,
  type Theme,
} from '@mui/material';
import { createContext, useContext } from 'react';
import { MdClose } from 'react-icons/md';

interface DialogContextValue {
  onClose?: () => void;
}

const DialogContext = createContext<DialogContextValue>({});

function DialogRoot({ children, onClose, ...props }: MuiDialogProps) {
  const handleClose = onClose ? () => onClose({}, 'backdropClick') : undefined;
  return (
    <DialogContext.Provider value={{ onClose: handleClose }}>
      <MuiDialog onClose={onClose} {...props}>
        {children}
      </MuiDialog>
    </DialogContext.Provider>
  );
}

interface HeaderProps {
  children: React.ReactNode;
  closeIcon?: boolean;
  sx?: SxProps<Theme>;
}

function Header({ children, closeIcon, sx }: HeaderProps) {
  const { onClose } = useContext(DialogContext);
  return (
    <DialogTitle
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      {children}
      {closeIcon && (
        <IconButton size="small" onClick={onClose}>
          <MdClose />
        </IconButton>
      )}
    </DialogTitle>
  );
}

interface ContentProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

function Content({ children, sx }: ContentProps) {
  return <DialogContent sx={sx}>{children}</DialogContent>;
}

interface FooterProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

function Footer({ children, sx }: FooterProps) {
  return <DialogActions sx={sx}>{children}</DialogActions>;
}

export const Dialog = Object.assign(DialogRoot, {
  Header,
  Content,
  Footer,
});
