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
import AssignmentIcon from "../Assets/images/AssignmentIcon.svg";
import CreateAdminIcon from "../Assets/images/add-team.svg";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import RuleIcon from "../Assets/images/RuleIcon.svg";
import CategoryIcon from "../Assets/images/CategoryIcon.svg";
import AddIcon from "../Assets/images/plus-sign.svg";
import AccountBalanceIcon from "../Assets/images/AccountBalanceIcon.svg";
import Upload from "../Assets/images/upload.svg";
import EventIcon from "../Assets/images/calendar-04.svg";
import AddLocationAltIcon from "../Assets/images/EventIcon.svg";
import LiveHelpIcon from "../Assets/images/LiveHelpIcon.svg";
import BubbleChatUser from "../Assets/images/bubble-chat-user.svg";
import { messages } from "../Utils/stringConstant/stringConstant";

const AdminDashboard = () => {
  const { setDrawerOpen, drawerOpen } = useContext(Context);

  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="admin-dashboard-container">
      <CssBaseline />
      <AppBar
        position="fixed"
        className="admin-dashboard-appbar"
      >
        <Toolbar>
          <Link to="/" className="admin-dashboard-logo">
            <img
              src={DarkYankilogo}
              alt="Yanki logo"
              width={messages.imgSize150}
              height={messages.imgSize44}
            />
          </Link>
          <Box className="admin-dashbard-topbar">
            <Box className="additional-components">
              {/* Add your additional components here if needed */}
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer()}
              className="admin-dashboard-menu-button"
              style={{
                marginLeft: drawerOpen ? "-5px" : "-10px",
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
        <div className="admin-dashboard-sidebar">
          <List>
            <NavLink
              to="/admin/search-query-report"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/search-query-report");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={AssignmentIcon} alt={messages.assignmentIcon} />
                </ListItemIcon>
                <ListItemText primary="Search Query Report" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/change-role"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/change-role");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={CreateAdminIcon} alt={messages.createAdminIcon} />
                </ListItemIcon>
                <ListItemText primary="Create Admin" />
              </ListItem>
            </NavLink>

            <NavLink
              to="/admin/chat"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/chat");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={BubbleChatUser} alt={messages.bubbleChatUser} />
                </ListItemIcon>
                <ListItemText primary={messages.adminChat} />
              </ListItem>
            </NavLink>

            <NavLink
              to="/admin/enterprise-request"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/enterprise-request");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={RuleIcon} alt={messages.ruleIcon} />
                </ListItemIcon>
                <ListItemText primary="Enterprise Request" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/enterprise-categories"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/enterprise-categories");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={CategoryIcon} alt={messages.categoryIcon} />
                </ListItemIcon>
                <ListItemText primary="Enterprise Categories" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/create-enterprise"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/enterprise-categories");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={AddIcon} alt={messages.addIcon} />
                </ListItemIcon>
                <ListItemText primary="Create Enterprise" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/create-department"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/enterprise-department");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={AccountBalanceIcon} alt={messages.accountBalanceIcon} />
                </ListItemIcon>
                <ListItemText primary="Create Department" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/upload-files"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/upload-files");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={Upload} alt={messages.upload} />
                </ListItemIcon>
                <ListItemText primary="Upload Files" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/event-request"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/event-request");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={EventIcon} alt={messages.eventIcon} />
                </ListItemIcon>
                <ListItemText primary="Event Requests" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/add-event-location"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/add-event-location");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={AddLocationAltIcon} alt={messages.addLocationAltIcon} />
                </ListItemIcon>
                <ListItemText primary="Add Event Location" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/admin/add-faq"
              className={({ isActive }) =>
                isActive ? 'admin-dashboard-navlink active' : 'admin-dashboard-navlink'
              }
            >
              <ListItem
                className="highlightStyle"
                onClick={() => {
                  { isSmallScreen && setDrawerOpen(!drawerOpen) }
                  navigate("/admin/add-faq");
                }}
              >
                <ListItemIcon className={messages.adminDashboardSidebarIcon}>
                  <img src={LiveHelpIcon} alt={messages.liveHelpIcon} />
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
