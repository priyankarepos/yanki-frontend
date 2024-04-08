import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import { Context } from "../App";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TuneIcon from '@mui/icons-material/Tune';
import { Typography } from "@mui/material";
import { useLocation } from 'react-router-dom';

export default function ProfielCircle() {
  const navigate = useNavigate();
  const { activeTab } = React.useContext(Context);
  const location = useLocation();

  const yankiUser = window.localStorage.getItem(
    process.env.REACT_APP_LOCALSTORAGE_TOKEN
  );

  let parsedUserObject;

  try {
    if (yankiUser) {
      parsedUserObject = JSON.parse(yankiUser);
    }
  } catch (e) {
    parsedUserObject = undefined;
  }

  const userRoles = parsedUserObject?.userObject?.userRoles || "";
  const userStatus = parsedUserObject?.userObject?.status || "";
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    if (e?.target?.name === "theme-switcher") {
      return;
    } else {
      setAnchorEl(null);
    }
  };

  const onClickChangePassword = () => {
    handleClose();
    navigate("/change-password");
  };

  const onClickChangeNumber = () => {
    handleClose();
    navigate("/change-phone-number");
  };

  const onClickAICustomization = () => {
    handleClose();
    navigate("/ai-customization");
  }

  const onClickSubscribeNotification = () => {
    handleClose();
    navigate("/notification");
  }

  const onClickAdmin = () => {
    handleClose();
    navigate("/admin/search-query-report");
  }

  const onClickLogout = () => {
    window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_REMEMBER);
    window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
    handleClose();
    navigate("/auth");
    sessionStorage.removeItem("selectedChatId");
  };

  const onClickNetworkingInterface = () => {
    handleClose();
    if (userStatus === "Pending" || userStatus === "Rejected") {
      navigate("/enterprise-status");
    } else if (userStatus === "Approved") {
      navigate("/enterprise/profile");
    }
  }


  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Box
          className="user-top-header"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            textAlign: "center",
            justifyContent: "space-between",
            py: 2,
          }}
        >
          <Typography sx={{cursor:"pointer"}} onClick={() => navigate("/")}>
            {location.pathname !== "/" && (
              <img
                src={
                  activeTab === 0
                    ? "/auth-logo-dark.svg"
                    : "/auth-logo-light.svg"
                }
                style={{ width: "10em" }}
                alt="logo"
              />
            )}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, backgroundColor: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* <MenuItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "default",
            }}
            name="dark-mode-switch"
          >
            Dark mode: <ThemeSwitcher />
          </MenuItem> */}
          <MenuItem>
            <ListItemIcon>
              <EmailOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', // This ensures that the text doesn't wrap to the next line
            }}>{parsedUserObject?.userObject?.userEmail || ""}</span>
          </MenuItem>
          <MenuItem onClick={onClickChangePassword}>
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Change Password
          </MenuItem>
          {userRoles === "Admin" && activeTab === 0 && <MenuItem onClick={onClickAdmin}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Go To Admin Panel
          </MenuItem>}
          {userRoles === "Enterprise" && activeTab === 1 && <MenuItem onClick={onClickNetworkingInterface}>
            <ListItemIcon>
              <Diversity2Icon fontSize="small" />
            </ListItemIcon>
            Networking Interface
          </MenuItem>}
          <MenuItem onClick={onClickChangeNumber}>
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Change Phone Number
          </MenuItem>
          {userRoles !== "Enterprise" && <MenuItem onClick={onClickSubscribeNotification}>
            <ListItemIcon>
              <NotificationsNoneIcon />
            </ListItemIcon>
            Notifications
          </MenuItem>}
          {userRoles !== "Enterprise" && <MenuItem onClick={onClickAICustomization}>
            <ListItemIcon>
              <TuneIcon />
            </ListItemIcon>
            AI Customization
          </MenuItem>}
          <Divider />
          <MenuItem onClick={onClickLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Container>
    </React.Fragment>
  );
}
