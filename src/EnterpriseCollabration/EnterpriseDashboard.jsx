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

const styles = {
    enterpriseDashboard: {
        display: 'flex',
        height: '100vh',
    },
    appBar: {
        backgroundColor: '#fff  ',
        color: "#2f587c",
    },
    menuButton: {
        marginLeft: 'auto',
    },
    title: {
        flexGrow: 1,
    },
    sidebar: {
        width: '270px',
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

const EnterpriseDashboard = () => {
    const { setDrawerOpen, drawerOpen } = useContext(Context);
    // const [drawerOpen, setDrawerOpen] = useState(true);
    // const [isDropdownOpen, setDropdownOpen] = useState(true);

    const navigate = useNavigate();

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    // const throttledToggleDrawer = throttle(toggleDrawer, 200);
    // useEffect(() => {
    //     if (isSmallScreen && !drawerOpen) {
    //         setDrawerOpen(false);
    //     }
    // }, [isSmallScreen, drawerOpen, setDrawerOpen]);

    // useEffect(() => {
    //     window.addEventListener("resize", throttledToggleDrawer);
    //     return () => {
    //         window.removeEventListener("resize", throttledToggleDrawer);
    //     };
    // }, [throttledToggleDrawer]);


    return (
        <div style={styles.enterpriseDashboard}>
            <CssBaseline />
            <AppBar position="fixed" style={styles.appBar} className='appBarSmallScreen'>
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Box className='titleSmallScreen' sx={{ display: 'flex', alignItems: 'center', width: "100%" }}>
                        {<Typography variant="h6">Networking Interface</Typography>}
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => toggleDrawer()}
                        style={styles.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer open={isSmallScreen ? !drawerOpen : drawerOpen} onClose={() => toggleDrawer()} variant="persistent" className='enterpriseSidebar' >
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
                    {/* <List>
                        <ListItem
                            button
                            className="highlightStyle"
                            onClick={toggleDropdown}
                        >
                            <ListItemIcon>
                                <NetworkWifiIcon />
                            </ListItemIcon>
                            <ListItemText primary="Networking Interface" />
                        </ListItem>
                        <Collapse in={isDropdownOpen} sx={{marginLeft:"20px",}}>
                            <List>
                                <NavLink
                                    to="/enterprise/profile"
                                    style={{ textDecoration: 'none', color: '#fff' }}
                                    activeClassName="active"
                                >
                                    <ListItem button onClick={()=>navigate("/enterprise/profile")}>
                                        <ListItemIcon>
                                            <BusinessIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Enterprise Profile" />
                                    </ListItem>
                                </NavLink>
                                <NavLink
                                    to="/enterprise/departments"
                                    style={{ textDecoration: 'none', color: '#fff' }}
                                    activeClassName="active"
                                >
                                    <ListItem button>
                                        <ListItemIcon>
                                            <AccountBalanceIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Departments" />
                                    </ListItem>
                                </NavLink>
                            </List>
                        </Collapse>
                    </List> */}
                    <List>
                        <NavLink
                            to="/enterprise/profile"
                            style={{ textDecoration: 'none', color: '#fff' }}
                            activeClassName="active"
                        >
                            <ListItem button className='highlightStyle' onClick={() => navigate("/enterprise/profile")}>
                                <ListItemIcon>
                                    <BusinessIcon style={{ color: '#fff', }} />
                                </ListItemIcon>
                                <ListItemText primary="Enterprise Profile" />
                            </ListItem>
                        </NavLink>
                        <NavLink
                            to="/enterprise/departments"
                            style={{ textDecoration: 'none', color: '#fff' }}
                            activeClassName="active"
                        >
                            <ListItem button className='highlightStyle' onClick={() => navigate("/enterprise/departments")}>
                                <ListItemIcon>
                                    <AccountBalanceIcon style={{ color: '#fff', }} />
                                </ListItemIcon>
                                <ListItemText primary="Departments" />
                            </ListItem>
                        </NavLink>
                        <NavLink
                            to="/enterprise/upload-files"
                            style={{ textDecoration: 'none', color: '#fff' }}
                            activeClassName="active"
                        >
                            <ListItem button className='highlightStyle' onClick={() => navigate("/enterprise/upload-files")}>
                                <ListItemIcon>
                                    <UploadIcon style={{ color: '#fff', }} />
                                </ListItemIcon>
                                <ListItemText primary="Add Files" />
                            </ListItem>
                        </NavLink>
                    </List>

                </div>
            </Drawer>
            {/* <Box style={{ ...styles.content, marginLeft: contentMargin }}>
                <Toolbar />
                <EnterpriseProfile />
                <Outlet />
            </Box> */}
        </div>
    );
};

export default EnterpriseDashboard;