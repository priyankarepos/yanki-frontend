import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import AgentLogo from "../../Assets/images/AgentProfile.svg";
import OfflineUserAvtar from "../../Assets/images/OfflineUserProfile.svg";
import TickDouble from "../../Assets/images/Tick-double.svg";
import "./PersonalAssistant.scss";
import SendIcon from "../../Assets/images/sendIcon.svg";
import {
  getConnectionPromise,
} from "../../SignalR/signalRService";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { classNames } from "../../Utils/stringConstant/stringConstant";

const UserChatSession = () => {
  const { t } = useTranslation();
  const [messageList, setMessageList] = useState([]); ``
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatFinish, setIsChatFinish] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetch, setIsDataFetch] = useState(null);
  const [showAvalibleMessage, setShowAvalibleMessage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const chatContainerRef = useRef(null);
  const isSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.smallScreen)
  );
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.up(agentChatResponse.mediumScreen)
  );

  const { chatSessionId } = useParams();

  const yankiUser = JSON.parse(
    window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN) ||
    "{}"
  );
  const currentUserId = yankiUser?.userObject?.userId || "";

  const handleChangeStatus = async (receiverId) => {
    await axios.put(apiUrls.changeStatusByUser(receiverId));
  }

  useEffect(() => {
    const handleReceivedMessage = (message) => {

      if (message.senderId === currentUserId && message.receiverId === null) {
        setShowAvalibleMessage(true);
      } else {
        setShowAvalibleMessage(false);
      }

      if (message.receiverId === currentUserId) {
        const date = new Date(message.timestamp);

        const options = {
          hour: agentChatResponse.numeric,
          minute: agentChatResponse.numeric,
          hour12: true,
        };
        const localTimeString = date.toLocaleTimeString(undefined, options);

        message.timestamplabel = localTimeString;

        setMessageList((prevMessages) => {

          let messageExist = prevMessages.find((prev) => prev.id === message.id);

          if (!messageExist) {
            return [...prevMessages, message];
          } else {
            return prevMessages;
          }
        })

        if (message.receiverId != null) {
          handleChangeStatus(message.receiverId)
        }
      };
    }

    const initializeConnection = async () => {
      const connection = await getConnectionPromise();

      if (connection) {
        connection.on(agentChatResponse.receiveMessage, (message) => {
          handleReceivedMessage(message);
        });

        connection.on(agentChatResponse.finishChatConnection, () => {
          setIsChatFinish(true);
          setShowAvalibleMessage(false);
        });
      }
    };

    initializeConnection();
  }, []);

  useEffect(() => {
    setIsDataFetch(true);
    const fetchMessage = async () => {
      try {
        const response = await axios.get(
          `${apiUrls.getUserMessage(chatSessionId)}`
        );

        let totalMessage = response.data.messages.length;
        if (response.data.messages[totalMessage - 1].senderId === currentUserId && response.data.messages[totalMessage - 1].receiverId === null) {
          setShowAvalibleMessage(true);
        }

        setIsChatFinish(response.data.isChatSessionActive);

        const processedMessages = response.data.messages.map((message) => {
          const date = new Date(message.timestamp);
          const options = {
            hour: agentChatResponse.numeric,
            minute: agentChatResponse.numeric,
            hour12: true,
          };
          const localTimeString = date.toLocaleTimeString(undefined, options);

          return { ...message, timestamplabel: localTimeString };
        });

        setMessageList(processedMessages);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      } finally {
        setIsDataFetch(false);
      }
    };
    fetchMessage();
  }, [chatSessionId]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrls.sendMessage}`, {
        content: searchQuery,
        userType: agentChatResponse.user,
      });

      let message = response.data.data;

      const date = new Date(message.timestamp);

      const options = {
        hour: agentChatResponse.numeric,
        minute: agentChatResponse.numeric,
        hour12: true,
      };
      const localTimeString = date.toLocaleTimeString(undefined, options);

      message.timestamplabel = localTimeString;

      setMessageList((prevMessages) => [...prevMessages, message]);

      setSearchQuery("");
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <Paper sx={{ p: 2 }} className={agentChatResponse.agentChatSessionContainer}>
      <Box
        className={`${chatSessionId
            ? agentChatResponse.agentChatSessionContainer
            : agentChatResponse.chatAgentContainer
          }`}
      >
        <Typography className={`${isSmallScreen ? agentChatResponse.chatAgentHeadingSmallScreen : agentChatResponse.chatAgentHeading}`}>
          {t('chatWithYankiAgent')}
        </Typography>
        <Typography className={agentChatResponse.chatAgentTitle}>
          {t('describeNeedHelp')}
        </Typography>
        <Box
          className={` ${agentChatResponse.userChatContainer} ${showAvalibleMessage && !isChatFinish
            ? agentChatResponse.userChatContainerAvalibaleMessage
            : isMediumScreen
              ? agentChatResponse.largeUserChatContainer
              : agentChatResponse.smallUserChatContainer
            }`}
          ref={chatContainerRef}
        >
          {isDataFetch && (
            <Typography className={agentChatResponse.adminFaqProgressbar}>
              <CircularProgress />
            </Typography>
          )}
          {messageList.map((message) => (
            <div key={message.id}>
              <Box className={agentChatResponse.messageContainer}>
                <Box
                  className={`${message.userType === agentChatResponse.user
                      ? agentChatResponse.messageOutgoingContainer
                      : agentChatResponse.messageIncomingContainer
                    }`}
                >
                  {message.userType !== agentChatResponse.user && !isSmallScreen && (
                    <Avatar className={agentChatResponse.agentAvtar}>
                      <img src={AgentLogo} alt={agentChatResponse.agentLogo} />
                    </Avatar>
                  )}
                  <Box
                    key={message.id}
                    className={`${isSmallScreen ? agentChatResponse.messageSmallScreen : agentChatResponse.message}
                ${message.userType === agentChatResponse.user
                        ? agentChatResponse.outgoing
                        : agentChatResponse.incoming
                      }
              `}
                  >
                    <Typography>{message.content}</Typography>
                    <img src={TickDouble} alt={TickDouble} />
                    <span
                      className={`${agentChatResponse.userMessageTime} ${isSmallScreen ? agentChatResponse.userMessageTimeSmallScreen : agentChatResponse.userMessageTimeLargeScreen} ${message.userType === agentChatResponse.user
                        ? agentChatResponse.outgoingTime
                        : agentChatResponse.incomingTime
                        }`}
                    >
                      {message.timestamplabel}
                    </span>
                  </Box>
                  {message.userType === agentChatResponse.user && !isSmallScreen && (
                    <Avatar className={agentChatResponse.userAvtar}>
                      <img
                        src={OfflineUserAvtar}
                        alt={agentChatResponse.userAvtar}
                      />
                    </Avatar>
                  )}
                </Box>
              </Box>
            </div>
          ))}
        </Box>

        <Box className={agentChatResponse.agentSearchContainer}>
          {showAvalibleMessage && !isChatFinish && (
            <Box className={agentChatResponse.agentUnavailableMessage}>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {t('agentAvailableMessage')}
              </Typography>
            </Box>
          )}

          {!isDataFetch &&
            <Box className={agentChatResponse.chatWithAgentContainer}>
              {!isChatFinish ? (
                <form>
                  <Box
                    className={`${isSmallScreen
                      ? agentChatResponse.smallChatWithAgent
                      : agentChatResponse.chatWithAgent
                      }`}
                  >
                    <TextField
                      fullWidth
                      name={agentChatResponse.searchQuery}
                      value={searchQuery}
                      onChange={handleChange}
                      placeholder={t('chatWithAgent')}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            className={agentChatResponse.sendButton}
                            type={agentChatResponse.submit}
                            onClick={onSubmit}
                            disabled={!searchQuery.trim()}
                          >
                            {isLoading ? (
                              <CircularProgress size={24} className={classNames.copyLinkLoader} />
                            ) : (
                              <React.Fragment>
                                <span className={agentChatResponse.sendButtonMessage}>
                                  {t('send')}
                                </span>
                                <img src={SendIcon} alt={agentChatResponse.userAvtar} />
                              </React.Fragment>
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </form>
              ) : (
                <Typography className={agentChatResponse.chatFinishedTitle}>{t('chatFinishedByAdmin')}</Typography>
              )}
            </Box>
          }
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Paper>
  );
};
export default UserChatSession;
