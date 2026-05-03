import { Box, CssBaseline, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar } from '../components/appbar/appbar';
import { Drawer } from '../components/drawer/drawer';

export const RootLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <CssBaseline />

      <AppBar onDrawerToggle={handleDrawerToggle} />

      <Box component="nav">
        <Drawer open={mobileOpen} onClose={handleDrawerToggle} />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
