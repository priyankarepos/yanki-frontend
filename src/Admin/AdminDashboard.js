import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
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
import "./AdminStyle.css"
import "../EnterpriseCollabration/EnterpriseStyle.scss"
import AssignmentIcon from '@mui/icons-material/Assignment';
import CreateAdminIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { Context } from '../App';
import RuleIcon from '@mui/icons-material/Rule';
import CategoryIcon from '@mui/icons-material/Category';
import throttle from 'lodash/throttle';

const styles = {
    enterpriseDashboard: {
        display: 'flex',
        height: '100vh',
    },
    appBar: {
        backgroundColor: '#13538b  ',
        color: "#fff",
    },
    menuButton: {
        marginLeft: 'auto',
    },
    title: {
        flexGrow: 1,
    },
    sidebar: {
        width: '280px',
        padding: '16px',
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: '16px',
        marginLeft: '0',
        transition: 'margin-left 0.3s',
    },
    logoStyle: {
        width: '150px',
    },
    pagination: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
    },
};

const AdminDashboard = () => {
    const { setDrawerOpen, drawerOpen } = useContext(Context);

    const navigate = useNavigate();

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const throttledToggleDrawer = throttle(toggleDrawer, 200);
    useEffect(() => {
        if (isSmallScreen && !drawerOpen) {
            setDrawerOpen(false);
        }
    }, [isSmallScreen, drawerOpen, setDrawerOpen]);

    useEffect(() => {
        window.addEventListener("resize", throttledToggleDrawer);
        return () => {
            window.removeEventListener("resize", throttledToggleDrawer);
        };
    }, [throttledToggleDrawer]);

    return (
        <div style={styles.enterpriseDashboard}>
            <CssBaseline />
            <AppBar position="fixed" style={styles.appBar} className='appBarSmallScreen'>
                <Toolbar>
                    <Link
                        to="/"
                        style={{ textDecoration: 'none', width: "270px" }}
                    >
                        <img
                            src={DarkYankilogo}
                            style={styles.logoStyle}
                            className="logo"
                            alt="Yanki logo"
                        />
                    </Link>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "calc(100% - 270px)" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* Add your additional components here if needed */}
                        </Box>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => toggleDrawer()}
                            style={{
                                ...styles.menuButton,
                                marginLeft: drawerOpen ? "-5px" : "-10px", // Adjust the left shift value as needed
                                transition: 'margin-left 0.3s ease-in-out',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer open={drawerOpen} onClose={() => toggleDrawer()} variant="persistent">
                <div style={styles.sidebar}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <img
                            src={DarkYankilogo}
                            style={{
                                ...styles.logoStyle,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginBottom: '16px',
                            }}
                            className="logo"
                            alt="Yanki logo"
                        />
                    </Link>
                    <List>
                        <NavLink
                            to="/admin/search-query-report"
                            style={{ textDecoration: 'none', color: '#fff' }}
                            activeClassName="active"
                        >
                            <ListItem button className='highlightStyle' onClick={() => navigate("/admin/search-query-report")}>
                                <ListItemIcon>
                                    <AssignmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Search Query Report" />
                            </ListItem>
                        </NavLink>
                        <NavLink
                            to="/change-role"
                            style={{ textDecoration: 'none', color: '#fff' }}
                            activeClassName="active"
                        >
                            <ListItem button className='highlightStyle' onClick={() => navigate("/change-role")}>
                                <ListItemIcon>
                                    <CreateAdminIcon />
                                </ListItemIcon>
                                <ListItemText primary="Create Admin" />
                            </ListItem>
                        </NavLink>
                        <NavLink
                            to="/admin/enterprise-request"
                            style={{ textDecoration: 'none', color: '#fff' }}
                            activeClassName="active"
                        >
                            <ListItem button className='highlightStyle' onClick={() => navigate("/admin/enterprise-request")}>
                                <ListItemIcon>
                                    <RuleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Enterprise Request" />
                            </ListItem>
                        </NavLink>
                        <NavLink
                            to="/admin/enterprise-categories"
                            style={{ textDecoration: 'none', color: '#fff' }}
                            activeClassName="active"
                        >
                            <ListItem button className='highlightStyle' onClick={() => navigate("/admin/enterprise-categories")}>
                                <ListItemIcon>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="Enterprise Categories" />
                            </ListItem>
                        </NavLink>
                    </List>
                </div>
            </Drawer>
        </div>
    );
};

export default AdminDashboard;