import {
  Avatar,
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import { useEffect, useRef, useState } from "react";
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

const UserChatSession = () => {
  const { t } = useTranslation();
  const [messageList, setMessageList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatFinish, setIsChatFinish] = useState(null);
  const chatContainerRef = useRef(null);
  const isSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.smallScreen)
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
      if (message.receiverId === currentUserId) {
        const date = new Date(message.timestamp);

        const options = {
          hour: agentChatResponse.numeric,
          minute: agentChatResponse.numeric,
          hour12: true,
        };
        const localTimeString = date.toLocaleTimeString(undefined, options);

        message.timestamplabel = localTimeString;
        
        setMessageList((prevMessages) => [...prevMessages, message]);
      }

      if(message.receiverId != null) {
        handleChangeStatus(message.receiverId)
      }
    };

    const initializeConnection = async () => {
      const connection = await getConnectionPromise();

      if(connection) {
        connection.on(agentChatResponse.receiveMessage, (message) => {          
          handleReceivedMessage(message);
        });
      }
    };

    initializeConnection();
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await axios.get(
        `${apiUrls.getUserMessage(chatSessionId)}`
      );      
            
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
    };

    fetchMessage();
  }, [chatSessionId]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
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
        className={`${
          chatSessionId
            ? agentChatResponse.agentChatSessionContainer
            : agentChatResponse.chatAgentContainer
        }`}
      >
        <Typography className={agentChatResponse.chatAgentHeading}>
          {t('chatWithYankiAgent')}
        </Typography>
        <Typography className={agentChatResponse.chatAgentTitle}>
          {t('describeNeedHelp')}
        </Typography>
        <Box
          className={`${
            isSmallScreen
              ? agentChatResponse.smallUserChatContainer
              : agentChatResponse.userChatContainer
          }`}
          ref={chatContainerRef}
        >
          {messageList.map((message) => (
            <div key={message.id}>
              <Box className={agentChatResponse.messageContainer}>
                <Box
                  className={`${
                    message.userType === agentChatResponse.user
                      ? agentChatResponse.messageOutgoingContainer
                      : agentChatResponse.messageIncomingContainer
                  }`}
                >
                  {message.userType !== agentChatResponse.user && (
                    <Avatar className={agentChatResponse.agentAvtar}>
                      <img src={AgentLogo} alt={agentChatResponse.agentLogo} />
                    </Avatar>
                  )}
                  <Box
                    key={message.id}
                    className={`${agentChatResponse.message}
                ${
                  message.userType === agentChatResponse.user
                    ? agentChatResponse.outgoing
                    : agentChatResponse.incoming
                }
              `}
                  >
                    <Typography>{message.content}</Typography>
                    <img src={TickDouble} alt={TickDouble} />
                    <span
                      className={`${agentChatResponse.userMessageTime} ${
                        message.userType === agentChatResponse.user
                          ? agentChatResponse.outgoingTime
                          : agentChatResponse.incomingTime
                      }`}
                    >
                      {message.timestamplabel}
                    </span>
                  </Box>
                  {message.userType === agentChatResponse.user && (
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

        <Box className={agentChatResponse.chatWithAgentContainer}>
          {!isChatFinish ? (
            <form>
              <Box
                className={`${
                  isSmallScreen
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
                        <span className={agentChatResponse.sendButtonMessage}>
                          {t('send')}
                        </span>
                        <img src={SendIcon} alt={agentChatResponse.userAvtar} />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </form>
          ) : (
            <Typography className={agentChatResponse.chatFinishedTitle}>{t('chatFinishedByAdmin')}</Typography>
          ) }
        </Box>
      </Box>
    </Paper>
  );
};
export default UserChatSession;
