import EventNoteIcon from '@mui/icons-material/EventNote';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { colorPalette } from '@/styles/colorPalette';

const drawerWidth = 260;

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export const Drawer = ({ open, onClose }: DrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Formulário', path: '/', icon: <ListAltIcon /> },
    { text: 'Minhas reservas', path: '/reservas', icon: <EventNoteIcon /> },
  ];

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 'bold',
            letterSpacing: 1,
            color: colorPalette.primary[800],
          }}
        >
          Vai no RU?
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                sx={{ m: 1, borderRadius: 1 }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? colorPalette.primary[800] : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <MuiDrawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }}
    >
      {drawerContent}
    </MuiDrawer>
  );
};
