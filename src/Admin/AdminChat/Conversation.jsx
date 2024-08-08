import "./AdminChat.scss";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import OfflineUserAvtar from "../../Assets/images/OfflineUserAvtar.svg";
import React, { useEffect, useRef, useState } from "react";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import "./AdminChat.scss";
import TickDouble from "../../Assets/images/Tick-double.svg";
import SendIcon from "../../Assets/images/material-symbols_send.svg";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useNavigate, useParams } from "react-router-dom";
import BackArrow from "../../Assets/images/backArrowIcon.svg";
import messageIcon from "../../Assets/images/messageIcon.svg";
import threedotIcon from "../../Assets/images/threedotIcon.svg";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CloseIcon from "../../Assets/images/closeIcon.svg";
import { getConnectionPromise } from "../../SignalR/signalRService";
import OnlineUserAvatar from "../../Assets/images/OnlineUserAvtar.svg";

const Conversation = ({ onUserList, isModalOpen, userInfoModalOpen }) => {
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [isChatFinished, setIsChatFinished] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const isSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.smallScreen)
  );
  const isLargeScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.largeScreen)
  );
  const isLgOrXlScreen = useMediaQuery((theme) =>
    theme.breakpoints.up(agentChatResponse.mediumScreen)
  );
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrls.getUserListById(id)}`);
        setUserList(response.data);
      } catch (err) {}
    };
    fetchUsers();
  }, [id]);

  useEffect(() => {
    const fetchUsersMessage = async () => {
      try {
        const response = await axios.get(`${apiUrls.getAdminMessage(id)}`);
        const processedMessages = response.data.map((message) => {
          const date = new Date(message.timestamp);
          const options = {
            hour: agentChatResponse.numeric,
            minute: agentChatResponse.numeric,
            hour12: true,
          };
          const localTimeString = date.toLocaleTimeString(undefined, options);

          return { ...message, timestamp: localTimeString };
        });

        setMessageList(processedMessages);
      } catch (err) {}
    };
    fetchUsersMessage();
  }, [id]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrls.sendMessage}`, {
        content: searchQuery,
        reciverId: id,
        userType: agentChatResponse.admin,
      });
      let message = response.data.data;

      const date = new Date(message.timestamp);

      const options = {
        hour: agentChatResponse.numeric,
        minute: agentChatResponse.numeric,
        hour12: true,
      };
      const localTimeString = date.toLocaleTimeString(undefined, options);

      message.timestamp = localTimeString;

      onUserList(message);

      setMessageList((prevMessages) => [...prevMessages, message]);

      setSearchQuery("");
    } catch {}
  };

  useEffect(() => {
    const handleReceivedMessage = (message) => {
      const date = new Date(message.timestamp);

      const options = {
        hour: agentChatResponse.numeric,
        minute: agentChatResponse.numeric,
        hour12: true,
      };
      const localTimeString = date.toLocaleTimeString(undefined, options);

      message.timestamp = localTimeString;

      onUserList(message);

      if (message.senderId === id && message.senderId !== message.receiverId) {
        setMessageList((prevMessages) => [...prevMessages, message]);
      }
    };

    const initializeConnection = async () => {
      const connection = await getConnectionPromise();      

      if (connection) {
        connection.on(agentChatResponse.receiveMessage, (message) => {          
          handleReceivedMessage(message);
        });

        connection.on(agentChatResponse.newUser, (senderUser) => {
          if(senderUser.userId === id ) {
            setUserStatus(senderUser)
          } 
        });
      }
    };

    initializeConnection();
  }, []);

  const handleBackArrowClick = () => {
    navigate(`${apiUrls.chatNavigateUrl}`);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    const fetchUserStatus = async () => {
        var response = await axios.get(`${apiUrls.getUserStatus}`);
        const currentUserDetails = response.data.find(user => user.userId === id);
        setUserStatus(currentUserDetails)
    };
    fetchUserStatus();
  }, []);

  const handleFinishedChat = () => {
    try {
      var response = axios.put(apiUrls.finishChat(id));
      if (response) {
        setIsChatFinished(true);
        setSnackbarMessage(agentChatResponse.chatFinished);
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage(agentChatResponse.errorFinishChat, err);
      setSnackbarOpen(true);
    }
  };

  const handleClick = (e) => {
    setOpenMenu(e.currentTarget);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };

  const handleUserInfo = () => {
    userInfoModalOpen(true);
  };

  const handleClosModal = () => {
    userInfoModalOpen(false);
  };

  return (
    <Box
      className={`${agentChatResponse.messageListContainer} ${
        isLargeScreen || isModalOpen
          ? agentChatResponse.userListHideClass
          : agentChatResponse.userListShow
      }`}
    >
      {userList && (
        <Box
          className={`${agentChatResponse.chatHeader} ${
            isLargeScreen ? agentChatResponse.chatHeaderHideUserList : ""
          }`}
        >
          <Box className={agentChatResponse.headerInformation}>
            {(isLargeScreen || isModalOpen) && (
              <IconButton className={agentChatResponse.chatHeaderBackArrow}>
                <img
                  src={BackArrow}
                  alt={agentChatResponse.backArrow}
                  onClick={isModalOpen ? handleClosModal : handleBackArrowClick}
                />
              </IconButton>
            )}
            <img
              className={`${agentChatResponse.chatHeaderUserImage} ${
                isLargeScreen
                  ? agentChatResponse.userListHideImage
                  : agentChatResponse.userListShowImage
              }`}
              src={ userStatus.status === "online" ? OnlineUserAvatar : OfflineUserAvtar}
              alt={userList.email}
            />
            <Box
              className={`${
                isLargeScreen
                  ? agentChatResponse.chatHeaderInfoHide
                  : agentChatResponse.chatHeaderInfo
              }`}
            >
              <Typography className={agentChatResponse.chatHeaderInfoEmail}>
                {userList.email}
              </Typography>
              <span className={agentChatResponse.chatHeaderInfoStatus}>
                {userStatus.status}
              </span>
            </Box>
          </Box>

          {isLgOrXlScreen ? (
            <Box className={agentChatResponse.additionalInformation}>
              {!isChatFinished && (
                <IconButton
                  className={agentChatResponse.finishChatContainer}
                  onClick={handleFinishedChat}
                >
                  <img src={messageIcon} alt={agentChatResponse.messageIcon} />
                  <span className={agentChatResponse.finishChat}>Finish Chat</span>
                </IconButton>
              )}
              {!isModalOpen ? (
                <IconButton
                  className={agentChatResponse.currentUserInformation}
                  onClick={handleUserInfo}
                >
                  <img src={threedotIcon} alt={agentChatResponse.threedotIcon} />
                </IconButton>
              ) : (
                <IconButton
                  className={agentChatResponse.userInformationCloseIcon}
                  onClick={handleClosModal}
                >
                  <img src={CloseIcon} alt={agentChatResponse.closeIcon} />
                </IconButton>
              )}
            </Box>
          ) : (
            <Box>
              {!isModalOpen ? (
                <React.Fragment>
                  <IconButton
                    className={agentChatResponse.currentUserInformation}
                    onClick={handleClick}
                  >
                    <img src={threedotIcon} alt={agentChatResponse.threedotIcon} />
                  </IconButton>
                  <Menu
                    anchorEl={openMenu}
                    open={Boolean(openMenu)}
                    onClose={handleClose}
                    className={agentChatResponse.chatMenuDropdown}
                    MenuListProps={{ className: agentChatResponse.chatMenuDropdownList }}
                  >
                    {!isChatFinished && (
                      <MenuItem onClick={handleFinishedChat}>
                        <ListItemIcon>
                          <img
                            className={agentChatResponse.finishChatIcon}
                            src={messageIcon}
                            alt={agentChatResponse.messageIcon}
                          />
                        </ListItemIcon>
                        <ListItemText primary={agentChatResponse.finishChatTitle} />
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleUserInfo}>
                      <ListItemIcon>
                        <PermIdentityIcon />
                      </ListItemIcon>
                      <ListItemText primary={agentChatResponse.userinfoTitle} />
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              ) : (
                <IconButton
                  className={agentChatResponse.userInformationCloseIcon}
                  onClick={handleClosModal}
                >
                  <img src={CloseIcon} alt={agentChatResponse.closeIcon} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      )}
      <Box
        className={`${agentChatResponse.messageContentContainer} ${
          isChatFinished ? agentChatResponse.finished : ""
        }`}
      >
        <div className={agentChatResponse.chatBackground}></div>
        <Box
          className={agentChatResponse.messageContent}
          ref={chatContainerRef}
        >
          {messageList.map((message) => (
            <React.Fragment key={message.id}>
              <Box
                key={message.id}
                className={`${agentChatResponse.messageItem}
                ${
                  message.userType === agentChatResponse.admin
                    ? agentChatResponse.messageOutgoing
                    : agentChatResponse.messageIncoming
                }
              `}
              >
                <Typography>{message.content}</Typography>
                <img src={TickDouble} alt={TickDouble} />
              </Box>
              <span
                className={`${agentChatResponse.messageTime} ${
                  message.userType === agentChatResponse.admin
                    ? agentChatResponse.timestampOutgoing
                    : agentChatResponse.timestampIncoming
                }`}
              >
                {message.timestamp}
              </span>
            </React.Fragment>
          ))}
        </Box>
        <Box className={agentChatResponse.chatBox}>
          <form>
            <Box className={agentChatResponse.chatInputContainer}>
              {isChatFinished ? (
                <Box
                  className={`${agentChatResponse.chatFinishedNotice} ${
                    isModalOpen
                      ? agentChatResponse.inputFieldOpenModal
                      : isSmallScreen
                      ? agentChatResponse.inputFieldHide
                      : agentChatResponse.inputFieldShow
                  }`}
                >
                  The chat has been finished
                </Box>
              ) : (
                <TextField
                  fullWidth
                  name={agentChatResponse.searchQuery}
                  value={searchQuery}
                  onChange={handleChange}
                  placeholder={agentChatResponse.typeMessage}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position={agentChatResponse.start}>
                        <SentimentSatisfiedAltIcon
                          className={agentChatResponse.smileyIcon}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        type={agentChatResponse.submit}
                        onClick={onSubmit}
                      >
                        <img src={SendIcon} alt={SendIcon} />
                      </IconButton>
                    ),
                  }}
                  className={`${agentChatResponse.chatInputField} ${
                    isModalOpen
                      ? agentChatResponse.inputFieldOpenModal
                      : isSmallScreen
                      ? agentChatResponse.inputFieldHide
                      : agentChatResponse.inputFieldShow
                  }`}
                />
              )}
            </Box>
          </form>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Conversation;
