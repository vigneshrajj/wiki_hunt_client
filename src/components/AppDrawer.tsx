import { BookmarkBorderOutlined, LogoutOutlined, SearchOutlined } from '@mui/icons-material';
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useLogout } from '../api/api';

const AppDrawer = () => {
  const location = useLocation();
  const { logout } = useLogout();


  return (
    <List>
      <Link style={{ color: 'black' }} to={'search'}>
        <ListItem>
            <ListItemButton selected={!!matchPath(location.pathname, '/search')}>
              <ListItemIcon>
                <SearchOutlined />
              </ListItemIcon>
              <ListItemText primary={'Search'} />
            </ListItemButton>
        </ListItem>
      </Link>
      <Link style={{ color: 'black' }} to={'saved'}>
        <ListItem>
            <ListItemButton selected={!!matchPath(location.pathname, '/saved')}>
              <ListItemIcon>
                <BookmarkBorderOutlined />
              </ListItemIcon>
              <ListItemText primary={'Saved'} />
            </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
      <ListItem>
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary={'Logout'} />
        </ListItemButton>
      </ListItem>
    </List>
)
};

export default AppDrawer;