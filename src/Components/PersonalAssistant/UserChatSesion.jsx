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
  startConnection,
  onReceiveMessage,
  stopConnection,
} from "../../SignalR/signalRService";

const UserChatSession = () => {
  const [messageList, setMessageList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down(agentChatResponse.smallScreen));


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

      setMessageList((prevMessages) => [...prevMessages, message]);
    };

    const initializeConnection = async () => {
      await startConnection();
      onReceiveMessage(handleReceivedMessage);
    };

    initializeConnection();

    return () => {
      stopConnection();
    };
  }, []);

  useEffect(() => {
    const currentUserInfo = window.localStorage.getItem(
      agentChatResponse.yankiUser
    );
    if (currentUserInfo) {
      const parsedUserInfo = JSON.parse(currentUserInfo);
      const {
        userObject: { userId }, 
      } = parsedUserInfo;
      setCurrentUserId(userId);
    }
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await axios.get(`${apiUrls.getUserMessage}`);

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
    };

    fetchMessage();
  }, []);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrls.sendMessage}`, {
        content: searchQuery,
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

      setMessageList((prevMessages) => [...prevMessages, message]);

      setSearchQuery("");
    } catch {}
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <Paper sx={{ p: 2 }}>
      <Box className={agentChatResponse.chatAgentContainer}>
        <Typography className={agentChatResponse.chatAgentHeading}>
          {agentChatResponse.chatYankiAgent}
        </Typography>
        <Typography className={agentChatResponse.chatAgentTitle}>
          {agentChatResponse.chatYankiAgentTitle}
        </Typography>
        <Box className={`${ isSmallScreen ? agentChatResponse.smallUserChatContainer : agentChatResponse.userChatContainer}`} ref={chatContainerRef}>
          {messageList.map((message) => (
            <div>
              <Box className={agentChatResponse.messageContainer}>
                <Box
                  className={`${
                    message.senderId === currentUserId
                      ? agentChatResponse.messageOutgoingContainer
                      : agentChatResponse.messageIncomingContainer
                  }`}
                >
                  {message.senderId !== currentUserId && (
                    <Avatar className={agentChatResponse.agentAvtar}>
                      <img src={AgentLogo} alt={agentChatResponse.agentLogo} />
                    </Avatar>
                  )}
                  <Box
                    key={message.id}
                    className={`${agentChatResponse.message}
                ${
                  message.senderId === currentUserId
                    ? agentChatResponse.outgoing
                    : agentChatResponse.incoming
                }
              `}
                  >
                    <Typography>{message.content}</Typography>
                    <img src={TickDouble} alt={TickDouble} />
                    <span
                      className={`${agentChatResponse.userMessageTime} ${
                        message.senderId === currentUserId
                          ? agentChatResponse.outgoingTime
                          : agentChatResponse.incomingTime
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </Box>
                  {message.senderId === currentUserId && (
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
          <form>
            <Box className={`${ isSmallScreen ? agentChatResponse.smallChatWithAgent : agentChatResponse.chatWithAgent}`}>
              <TextField
                fullWidth
                name={agentChatResponse.searchQuery}
                value={searchQuery}
                onChange={handleChange}
                placeholder={agentChatResponse.chatwithAgentPlaceholder}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      className={agentChatResponse.sendButton}
                      type={agentChatResponse.submit}
                      onClick={onSubmit}
                    >
                      <span className={agentChatResponse.sendButtonMessage}>Send</span>
                      <img
                        src={SendIcon}
                        alt={agentChatResponse.userAvtar}
                      />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Paper>
  );
};
export default UserChatSession;
