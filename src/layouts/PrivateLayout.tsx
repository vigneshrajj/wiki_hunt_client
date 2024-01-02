import { Box, Drawer } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppDrawer from '../components/AppDrawer';
import { useLogout, useRefreshToken, useUser } from '../api/api';

const drawerWidth = 250;

function Layout() {
  const { getUser } = useUser();
  const { refreshToken } = useRefreshToken();
  const { logout } = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    (async function() {
      const user = await getUser();
      if (!user) {
        localStorage.setItem('token', '');
        const token = localStorage.getItem('refreshToken');
        if (token) refreshToken(token);
        else logout();
      }
    })();
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <AppDrawer />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <AppDrawer />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout;
