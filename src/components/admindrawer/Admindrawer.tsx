import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { NavLink, Outlet } from 'react-router-dom'
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ContentCut from '@mui/icons-material/ContentCut';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AppBar from '@mui/material/AppBar';
import { Avatar, ListItemAvatar, ListItemButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'js-cookie';

const drawerWidth = 240;

const StyledNavLink = styled(NavLink)({
    textDecoration: "none",
    "&.active": {
        background: "#efefef",
    }
})

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
}));

export function Admindrawer(props: { adminDate: any; }) {
    const { adminDate } = props
    const nav = useNavigate()
    const drawerpath = [{ name: 'Home', path: 'sspanel' }, { name: 'Product', path: 'product' }, { name: 'Orders', path: 'orderlist' }, { name: 'Users', path: 'userlist' }]
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(op => !op);
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    };

    const logOut = () => {
        Cookies.remove("token")
        nav("/admin/login")
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton onClick={handleDrawerOpen} size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Smart Store</Typography>
                    <Box>                        
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            {adminDate._id && (<Avatar alt="Remy Sharp" {...stringAvatar(adminDate?.fullName)} />)}
                        </IconButton>                        
                        <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }} keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }} open={Boolean(anchorEl)} onClose={handleCloseUserMenu} >
                            <MenuItem>
                                <ListItemIcon>
                                    <AccountCircle />
                                </ListItemIcon>
                                <ListItemText>{"My Profile"}</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={logOut}>
                                <ListItemIcon>
                                    <ContentCut fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{"Log Out"}</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    zIndex: 0
                },
            }} variant="persistent" anchor="left" open={open}>
                <DrawerHeader />
                <Divider />
                <List>
                    {
                        drawerpath.map((text, index) => (
                            <ListItem key={index} component={StyledNavLink} to={text.path} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <InboxIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                    </ListItemIcon>
                                    <ListItemText primary={text.name} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <Outlet />
            </Main>
        </Box>
    );
}

function stringToColor(string: string) {
    let hash = 0;
    let i;
    for (i = 0; i < string?.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name?.split(' ')[0][0]}${name?.split(' ')[1][0]}`,
    };
}