import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    Typography,
    CssBaseline,
    AppBar,
    Toolbar,
    IconButton,
    Box,
    ListItemText,
    ListItemIcon,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkYankilogo from '../Assets/images/logo-dark.svg';
import "../Admin/AdminStyle.css"
import "./EnterpriseStyle.scss"
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';
import { Context } from '../App';
import UploadIcon from '@mui/icons-material/Upload';

const EnterpriseDashboard = () => {
    const { setDrawerOpen, drawerOpen } = useContext(Context);

    const navigate = useNavigate();

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div className='enterprise-dashboard'>
            <CssBaseline />
            <AppBar className='enterprise-dashboard-small-screen-bar'>
                <Toolbar className='enterprise-dashboard-tool-bar'>
                    <Box className='enterprise-dashboard-title-small-screen'>
                        {<Typography variant="h6">Networking Interface</Typography>}
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => toggleDrawer()}
                        className='enterprise-dashboard-menu-button'
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer open={isSmallScreen ? !drawerOpen : drawerOpen} onClose={() => toggleDrawer()} variant="persistent" className='enterprise-dashboard-sidebar' >
                <div className='enterprise-dashboard-sidebar-container'>
                    <Link to="/" className='enterprise-dashboard-link'>
                        <img
                            src={DarkYankilogo}
                            className='enterprise-dashboard-yanki-logo'
                            alt="Yanki logo"
                        />
                    </Link>
                    <List>
                        <NavLink
                            to="/enterprise/profile"
                            className='enterprise-dashboard-link enterprise-white-color'
                            activeClassName="active"
                        >
                            <ListItem className='highlightStyle' onClick={() => navigate("/enterprise/profile")}>
                                <ListItemIcon>
                                    <BusinessIcon className='enterprise-white-color'/>
                                </ListItemIcon>
                                <ListItemText primary="Enterprise Profile" />
                            </ListItem>
                        </NavLink>
                        <NavLink
                            to="/enterprise/departments"
                            className='enterprise-dashboard-link enterprise-white-color'
                            activeClassName="active"
                        >
                            <ListItem className='highlightStyle' onClick={() => navigate("/enterprise/departments")}>
                                <ListItemIcon>
                                    <AccountBalanceIcon className='enterprise-white-color' />
                                </ListItemIcon>
                                <ListItemText primary="Departments" />
                            </ListItem>
                        </NavLink>
                        <NavLink
                            to="/enterprise/upload-files"
                            className='enterprise-dashboard-link enterprise-white-color'
                            activeClassName="active"
                        >
                            <ListItem className='highlightStyle' onClick={() => navigate("/enterprise/upload-files")}>
                                <ListItemIcon>
                                    <UploadIcon className='enterprise-white-color' />
                                </ListItemIcon>
                                <ListItemText primary="Add Files" />
                            </ListItem>
                        </NavLink>
                    </List>

                </div>
            </Drawer>
        </div>
    );
};

export default EnterpriseDashboard;