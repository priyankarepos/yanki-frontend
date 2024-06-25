import React, { useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import { Context } from "../App";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TuneIcon from "@mui/icons-material/Tune";
import { Modal, Typography, Snackbar } from "@mui/material";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";
import "../Components/AnswerStyle.scss";

export default function ProfielCircle() {
  const navigate = useNavigate();
  const { activeTab } = React.useContext(Context);
  const location = useLocation();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [timer, setTimer] = useState(3);
  let timerInterval;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

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
  };

  const onClickSubscribeNotification = () => {
    handleClose();
    navigate("/notification");
  };

  const onClickAdmin = () => {
    handleClose();
    navigate("/admin/search-query-report");
  };

  const onClickMembershipPortal = () => {
    handleClose();
    navigate("/membership");
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
  };

  const handleDeleteAccount = () => {
    setConfirmDialogOpen(true);
    setConfirmationText(`Are you sure you want to delete your account?`);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${process.env.REACT_APP_API_HOST}/api/auth/delete-account`);
      if (response.status === 200) {
        setIsModalOpen(true)
        setTimer(3);
        timerInterval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(timerInterval);
          window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_REMEMBER);
          window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
          setIsModalOpen(false);
          navigate("/auth");
          sessionStorage.removeItem("selectedChatId");
        }, 3000);
      } else {
        setSnackbarMessage("Failed to delete account");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error deleting account:", error);
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Box className="user-top-header" sx={{ py: 2 }}>
          <Typography className="profile-logo" onClick={() => navigate("/")}>
            {location.pathname !== "/" && (
              <img
                src={
                  activeTab === 0
                    ? "/auth-logo-dark.svg"
                    : "/auth-logo-light.svg"
                }
                className="profile-yanki-logo"
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
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor:
                    activeTab === 1 ? "#8bbae5" : "defaultIconColor",
                }}
              >
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
          <MenuItem>
            <ListItemIcon>
              <EmailOutlinedIcon fontSize="small" />
            </ListItemIcon>
            {/* This ensures that the text doesn't wrap to the next line */}
            <span className="email-profile">
              {parsedUserObject?.userObject?.userEmail || ""}
            </span>
          </MenuItem>
          <MenuItem onClick={onClickChangePassword}>
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Change Password
          </MenuItem>
          {userRoles === "Admin" && activeTab === 0 && (
            <MenuItem onClick={onClickAdmin}>
              <ListItemIcon>
                <AdminPanelSettingsIcon fontSize="small" />
              </ListItemIcon>
              Go To Admin Panel
            </MenuItem>
          )}
          {userRoles === "Enterprise" && activeTab === 1 && (
            <MenuItem onClick={onClickNetworkingInterface}>
              <ListItemIcon>
                <Diversity2Icon fontSize="small" />
              </ListItemIcon>
              Networking Interface
            </MenuItem>
          )}
          <MenuItem onClick={onClickChangeNumber}>
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Change Phone Number
          </MenuItem>
          {userRoles !== "Enterprise" && (
            <MenuItem onClick={onClickSubscribeNotification}>
              <ListItemIcon>
                <NotificationsNoneIcon />
              </ListItemIcon>
              Notification Settings
            </MenuItem>
          )}
          {userRoles !== "Enterprise" && (
            <MenuItem onClick={onClickAICustomization}>
              <ListItemIcon>
                <TuneIcon />
              </ListItemIcon>
              AI Customization
            </MenuItem>
          )}
          {userRoles !== "Admin" &&
            <MenuItem onClick={onClickMembershipPortal}>
              <ListItemIcon>
                <SubscriptionsIcon fontSize="small" />
              </ListItemIcon>
              Subscription Plan
            </MenuItem>
          }
          <Divider />
          <MenuItem onClick={handleDeleteAccount}>
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            Delete Your Account
          </MenuItem>
          <Divider />
          <MenuItem onClick={onClickLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Container>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmDelete}
        confirmationText={confirmationText}
        loading={loading}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="admin-faq-model-style"
      >
        <Box className="admin-faq-model-content delete-account-content">
          <Typography sx={{ mb: 1 }}>
            Your account has been successfully deleted.
          </Typography>
          <Typography sx={{ mb: 1 }}>
            You will be redirected to the homepage in <strong>{timer}</strong>
          </Typography>
          <Typography sx={{ mb: 3 }}>
            If you have any questions or need further assistance, please contact our support team at&nbsp;
            <a
              className="linkStyle new-title-email"
              href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
              target="_blank"
              rel="noreferrer"
            >
              hello@yanki.ai
            </a>
          </Typography>
          <Typography>
            Thank you for using Yanki.
          </Typography>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
