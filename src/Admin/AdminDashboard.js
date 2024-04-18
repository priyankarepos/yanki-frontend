import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkYankilogo from "../Assets/images/logo-dark.svg";
import "./AdminStyle.css";
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreateAdminIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import RuleIcon from "@mui/icons-material/Rule";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import UploadIcon from "@mui/icons-material/Upload";
import EventIcon from '@mui/icons-material/Event';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

const styles = {
  enterpriseDashboard: {
    display: "flex",
    height: "100vh",
  },
  appBar: {
    backgroundColor: "#13538b  ",
    color: "#fff",
  },
  menuButton: {
    marginLeft: "auto",
  },
  title: {
    flexGrow: 1,
  },
  sidebar: {
    width: "280px",
    padding: "16px",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: "16px",
    marginLeft: "0",
    transition: "margin-left 0.3s",
  },
  logoStyle: {
    width: "150px",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  },
};

const AdminDashboard = () => {
  const { setDrawerOpen, drawerOpen } = useContext(Context);

  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div style={styles.enterpriseDashboard}>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={styles.appBar}
        className="appBarSmallScreen"
      >
        <Toolbar>
          <Link to="/" style={{ textDecoration: "none", width: "270px" }}>
            <img
              src={DarkYankilogo}
              style={styles.logoStyle}
              className="logo"
              alt="Yanki logo"
            />
          </Link>
          <Box className="admin-dashbard-topbar">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Add your additional components here if needed */}
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer()}
              style={{
                ...styles.menuButton,
                marginLeft: drawerOpen ? "-5px" : "-10px",
                transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        open={isSmallScreen ? !drawerOpen : drawerOpen}
        onClose={() => toggleDrawer()}
        variant="persistent"
      >
        <div style={styles.sidebar}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={DarkYankilogo}
              style={{
                ...styles.logoStyle,
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "16px",
              }}
              className="logo"
              alt="Yanki logo"
            />
          </Link>
          <List>
            <NavLink
              to="/admin/search-query-report"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/search-query-report")}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Search Query Report" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/change-role"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/change-role")}
              >
                <ListItemIcon>
                  <CreateAdminIcon />
                </ListItemIcon>
                <ListItemText primary="Create Admin" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/enterprise-request"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/enterprise-request")}
              >
                <ListItemIcon>
                  <RuleIcon />
                </ListItemIcon>
                <ListItemText primary="Enterprise Request" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/enterprise-categories"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/enterprise-categories")}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Enterprise Categories" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/create-enterprise"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/enterprise-categories")}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Enterprise" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/create-department"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/enterprise-department")}
              >
                <ListItemIcon>
                  <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary="Create Department" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/upload-files"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/upload-files")}
              >
                <ListItemIcon>
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary="Upload Files" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/event-request"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/event-request")}
              >
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Event Requests" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/add-event-location"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/add-event-location")}
              >
                <ListItemIcon>
                  <AddLocationAltIcon />
                </ListItemIcon>
                <ListItemText primary="Add Event Location" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/add-faq"
              className="admin-dashboard-navlink"
              activeClassName="active"
            >
              <ListItem
                className="highlightStyle"
                onClick={() => navigate("/admin/add-faq")}
              >
                <ListItemIcon>
                  <LiveHelpIcon />
                </ListItemIcon>
                <ListItemText primary="Add FAQ's" />
              </ListItem>
            </NavLink>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default AdminDashboard;
