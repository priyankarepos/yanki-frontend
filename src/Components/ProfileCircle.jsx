import React, { useRef, useState } from "react";
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
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import "../Components/AnswerStyle.scss";
import DeleteAccountConfirmDialog from "./DeleteAccountDialog/DeleteAccountDialog";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import TranslateIcon from '@mui/icons-material/Translate';
import EmailIcon from "../Assets/images/mail-01.svg";
import AccountSettingIcon from "../Assets/images/account-setting-03.svg";
import LogoutIcon from "../Assets/images/logout-02.svg";
import SubscriptionIcon from "../Assets/images/Frame.svg";
import AiCustomizationIcon from "../Assets/images/list-setting.svg";
import NotificationIcon from "../Assets/images/notification-01.svg";
import RightArrowIcon from "../Assets/images/right arrow 6.svg";
import ChangePassword from "../Assets/images/square-lock-01.svg";
import ChangePhone from "../Assets/images/arrow-reload-vertical.svg";
import ChangeLanguage from "../Assets/images/language-square.svg";
import AccountDelete from "../Assets/images/delete-02.svg";
import BackArrowIcon from "../Assets/images/back-arrow.svg";
import { classNames, messages, sourceSelectionStrings } from "../Utils/stringConstant/stringConstant";
import { useTranslation } from "react-i18next";
import { stopConnection } from "../SignalR/signalRService";

export default function ProfielCircle({ chatId, chatSessionId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeTab } = React.useContext(Context);
  const location = useLocation();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [timer, setTimer] = useState(5);
  let timerInterval;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";
  const isChatRoute = location.pathname.startsWith(`/${chatId}`);

  const yankiUser = window.localStorage.getItem(
    import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const open = Boolean(anchorEl);
  const accountSettingsIconRef = useRef(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAccountSettingClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleClose = (e) => {
    if (
      e?.target?.dataset?.noclose ||
      accountSettingsIconRef.current?.contains(e.target)
    ) {
      return;
    } else {
      setAnchorEl(null);
    }
  };

  const onClickChangePassword = () => {
    navigate("/change-password");
  };

  const onClickChangeNumber = () => {
    navigate("/change-phone-number");
  };

  const onClickChangeLanguage = () => {
    navigate("/change-language");
  };

  const onClickAICustomization = () => {
    navigate("/ai-customization");
  };

  const onClickSubscribeNotification = () => {
    navigate("/notification");
  };

  const onClickAdmin = () => {
    navigate("/admin/search-query-report");
  };

  const onClickMembershipPortal = () => {
    navigate("/membership");
  };

  const onClickLogout = () => {
    stopConnection();

    window.localStorage.removeItem(
      import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
    );
    window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN);
    window.localStorage.removeItem(messages.i18nextLng);
    localStorage.removeItem(sourceSelectionStrings.localStorageKey);
    navigate("/auth");

  };

  const onClickNetworkingInterface = () => {
    if (userStatus === "Pending" || userStatus === "Rejected") {
      navigate("/enterprise-status");
    } else if (userStatus === "Approved") {
      navigate("/enterprise/profile");
    }
  };

  const handleDeleteAccount = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_HOST}/api/auth/delete-account`
      );
      if (response.status === 200) {
        setConfirmDialogOpen(false);
        setIsModalOpen(true);
        setTimer(5);
        timerInterval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(timerInterval);
          window.localStorage.removeItem(
            import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
          );
          window.localStorage.removeItem(
            import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
          );
          setIsModalOpen(false);
          navigate("/auth");
        }, 5000);
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

  const showLogo =
    location.pathname !== "/" &&
    (location.pathname === "/notification" ||
      location.pathname === "/membership" ||
      location.pathname === "/ai-customization") &&
    location.pathname !== "/change-password";

  const showAccountSettings =
    location.pathname === "/" ||
    location.pathname === `/${chatId}` ||
    location.pathname === `/chat/${chatSessionId}` ||
    location.pathname === "/notification" ||
    location.pathname === "/membership" ||
    location.pathname === "/ai-customization";

  return (
    <React.Fragment>
      <Container className={isChatRoute ? classNames.muiContainerUserMenu : ''} maxWidth={classNames.xLWidth}>
        <Box className="user-top-header" sx={{ py: 2 }}>
          <Typography className="profile-logo" onClick={() => navigate("/")}>
            {showLogo && (
              <img
                src={
                  activeTab === 0
                    ? "/auth-logo-dark.svg"
                    : "/auth-logo-light.svg"
                }
                className="profile-yanki-logo"
                alt="logo"
                width={messages.imgSize200}
                height={messages.imgSize60}
              />
            )}
          </Typography>
          {showAccountSettings && (
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
          )}
        </Box>
        {!settingsOpen ? (
          <Menu
            className={activeTab === 0 && "menu-li-color"}
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
                {activeTab === 0 ? (
                  <img src={EmailIcon} alt="EmailIcon" />
                ) : (
                  <EmailOutlinedIcon fontSize="small" />
                )}
              </ListItemIcon>
              <span className="email-profile">
                {parsedUserObject?.userObject?.userEmail || ""}
              </span>
            </MenuItem>
            <MenuItem
              onClick={handleAccountSettingClick}
              data-noclose="true"
              ref={accountSettingsIconRef}
            >
              <ListItemIcon>
                {activeTab === 0 ? (
                  <img src={AccountSettingIcon} alt="AccountSettingIcon" />
                ) : (
                  <ManageAccountsIcon fontSize="small" />
                )}
              </ListItemIcon>
              {t('accountSettingsTxt')}
              <ListItemIcon className="account-setting-menu">
                {activeTab === 0 ? (
                  <img src={RightArrowIcon} alt="EmailIcon" />
                ) : (
                  <KeyboardArrowRightIcon fontSize="small" />
                )}
              </ListItemIcon>
            </MenuItem>

            {userRoles === "Admin" && activeTab === 0 && (
              <MenuItem onClick={onClickAdmin}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon
                    className={activeTab === 0 && "go-to-admin-icon"}
                    fontSize="small"
                  />
                </ListItemIcon>
                {t('goToAdminPanelTxt')}
              </MenuItem>
            )}
            {userRoles === "Enterprise" && activeTab === 1 && (
              <MenuItem onClick={onClickNetworkingInterface}>
                <ListItemIcon>
                  <Diversity2Icon
                    className={activeTab === 0 && "go-to-admin-icon"}
                    fontSize="small"
                  />
                </ListItemIcon>
                {t('networkingInterfaceTxt')}
              </MenuItem>
            )}
            {userRoles !== "Enterprise" && (
              <div>
                <MenuItem onClick={onClickSubscribeNotification}>
                  <ListItemIcon>
                    {activeTab === 0 ? (
                      <img src={NotificationIcon} alt="LogoutIcon" />
                    ) : (
                      <NotificationsNoneIcon />
                    )}
                  </ListItemIcon>
                  {t('notificationSettingsTxt')}
                </MenuItem>
                <MenuItem onClick={onClickAICustomization}>
                  <ListItemIcon>
                    {activeTab === 0 ? (
                      <img src={AiCustomizationIcon} alt="LogoutIcon" />
                    ) : (
                      <TuneIcon />
                    )}
                  </ListItemIcon>
                  {t('aICustomizationTxt')}
                </MenuItem>
              </div>
            )}
            {userRoles !== "Admin" && <Divider sx={{ mx: 2 }} />}
            {userRoles !== "Admin" && (
              <MenuItem onClick={onClickMembershipPortal}>
                <ListItemIcon>
                  {activeTab === 0 ? (
                    <img src={SubscriptionIcon} alt="SubscriptionIcon" />
                  ) : (
                    <SubscriptionsIcon fontSize="small" />
                  )}
                </ListItemIcon>
                {t('subscriptionPlanTxt')}
              </MenuItem>
            )}
            <Divider sx={{ mx: 2 }} />
            <MenuItem onClick={onClickLogout}>
              <ListItemIcon>
                {activeTab === 0 ? (
                  <img src={LogoutIcon} alt="LogoutIcon" />
                ) : (
                  <Logout fontSize="small" />
                )}
              </ListItemIcon>
              {t('logoutTxt')}
            </MenuItem>
          </Menu>
        ) : (
          <Menu
            className={activeTab === 0 && "menu-li-color"}
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
            <MenuItem
              onClick={handleAccountSettingClick}
              data-noclose="true"
              ref={accountSettingsIconRef}
            >
              <ListItemIcon>
                {activeTab === 0 ? (
                  <img src={BackArrowIcon} alt="BackArrowIcon" />
                ) : (
                  <KeyboardArrowLeftIcon fontSize="small" />
                )}
              </ListItemIcon>
              {t('accountSettingsTxt')}
            </MenuItem>
            <Divider sx={{ mx: 2 }} />
            <MenuItem onClick={onClickChangePassword}>
              <ListItemIcon>
                {activeTab === 0 ? (
                  <img src={ChangePassword} alt="ChangePassword" />
                ) : (
                  <LockOutlinedIcon fontSize="small" />
                )}
              </ListItemIcon>
              {t('changePasswordTxt')}
            </MenuItem>
            <MenuItem onClick={onClickChangeNumber}>
              <ListItemIcon>
                {activeTab === 0 ? (
                  <img src={ChangePhone} alt="ChangePhone" />
                ) : (
                  <PhoneMissedIcon fontSize="small" />
                )}
              </ListItemIcon>
              {t('changePhoneNumberTxt')}
            </MenuItem>
            {activeTab === 0 &&<MenuItem onClick={onClickChangeLanguage}>
              <ListItemIcon>
                {activeTab === 0 ? (
                  <img src={ChangeLanguage} alt="ChangeLanguage" />
                ) : (
                  <TranslateIcon fontSize="small" />
                )}
              </ListItemIcon>
              {t('changeLanguageTxt')}
            </MenuItem>}
            <MenuItem onClick={handleDeleteAccount}>
              <ListItemIcon>
                {activeTab === 0 ? (
                  <img src={AccountDelete} alt="AccountDelete" />
                ) : (
                  <DeleteOutlineIcon fontSize="small" />
                )}
              </ListItemIcon>
              {t('deleteYourAccountTxt')}
            </MenuItem>
          </Menu>
        )}
      </Container>
      <DeleteAccountConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmDelete}
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
          <Typography sx={{ mb: 1 }} className={`${activeTab === 1 && classNames.whiteColor}`}>
            {t('accountDeletedMessage')}
          </Typography>
          <Typography sx={{ mb: 1 }} className={`${activeTab === 1 && classNames.whiteColor}`}>
            {t('redirectMessage')} <strong>{timer}</strong>
          </Typography>
          <Typography sx={{ mb: 3 }} className={`${activeTab === 1 && classNames.whiteColor}`}>
            {t('contactSupportMessage')}&nbsp;
            <a
              className="linkStyle new-title-email"
              href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
              target="_blank"
              rel="noreferrer"
            >
              hello@yanki.ai
            </a>
          </Typography>
          <Typography className={`${activeTab === 1 && classNames.whiteColor}`}>
            {t('thankYouMessage')}
          </Typography>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
