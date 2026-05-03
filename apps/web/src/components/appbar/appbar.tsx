import MenuIcon from '@mui/icons-material/Menu';
import {
  IconButton,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { colorPalette } from '@/styles/colorPalette';
import { AccountMenu } from '../accountMenu/accountMenu';

interface AppBarProps {
  onDrawerToggle: () => void;
}

export const AppBar = ({ onDrawerToggle }: AppBarProps) => {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        bgcolor: colorPalette.neutral[50],
        color: colorPalette.primary[800],
      }}
      elevation={1}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          fontWeight="bold"
          sx={{ flexGrow: 1 }}
        >
          Vai no RU hoje?
        </Typography>
        <AccountMenu />
      </Toolbar>
    </MuiAppBar>
  );
};
