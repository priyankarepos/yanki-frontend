import "./AdminChat.scss";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import OfflineUserAvtar from "../../Assets/images/OfflineUserAvtar.svg";
import { useEffect, useRef, useState } from "react";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import "./AdminChat.scss";
import TickDouble from "../../Assets/images/Tick-double.svg";
import SendIcon from "../../Assets/images/material-symbols_send.svg";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useNavigate, useParams } from "react-router-dom";
import {
  onReceiveMessage,
  stopConnection,
  startConnection,
} from "../../SignalR/signalRService";
import BackArrow from "../../Assets/images/back-arrow.svg";

const Conversation = ({ onUserList }) => {
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const isSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.smallScreen)
  );
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.mediumScreen)
  );
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  const { id } = useParams();

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
        reciverId: [id],
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
  }, [onUserList]);

  const handleBackArrowClick = () => {
    navigate(`${apiUrls.chatNavigateUrl}`);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <Box
      className={`${agentChatResponse.messageListContainer} ${
        isMediumScreen
          ? agentChatResponse.userListHideClass
          : agentChatResponse.userListShow
      }`}
    >
      {userList && (
        <Box className={agentChatResponse.chatHeader}>
          {isMediumScreen && (
            <img
              className={agentChatResponse.chatHeaderBackArrow}
              src={BackArrow}
              alt={agentChatResponse.backArrow}
              onClick={handleBackArrowClick}
            />
          )}
          <img
            className={`${agentChatResponse.chatHeaderUserImage} ${
              isMediumScreen
                ? agentChatResponse.userListHideImage
                : agentChatResponse.userListShowImage
            }`}
            src={OfflineUserAvtar}
            alt={userList.email}
          />
          <Box
            className={`${
              isMediumScreen
                ? agentChatResponse.chatHeaderInfoHide
                : agentChatResponse.chatHeaderInfo
            }`}
          >
            <Typography className={agentChatResponse.chatHeaderInfoEmail}>
              {userList.email}
            </Typography>
            <span className={agentChatResponse.chatHeaderInfoStatus}>
              Online
            </span>
          </Box>
        </Box>
      )}
      <Box className={agentChatResponse.messageContentContainer}>
        <Box
          className={agentChatResponse.messageContent}
          ref={chatContainerRef}
        >
          {messageList.map((message) => (
            <>
              {(message.senderId === id || message.senderId === currentUserId) && (
                <>
                  <Box
                    key={message.id}
                    className={`${agentChatResponse.messageItem}
                ${
                  message.senderId === currentUserId
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
                      message.senderId === currentUserId
                        ? agentChatResponse.timestampOutgoing
                        : agentChatResponse.timestampIncoming
                    }`}
                  >
                    {message.timestamp}
                  </span>
                </>
              )}
            </>
          ))}
        </Box>
        <Box className={agentChatResponse.chatBox}>
          <form>
            <Box className={agentChatResponse.chatInputContainer}>
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
                  isSmallScreen
                    ? agentChatResponse.inputFieldHide
                    : agentChatResponse.inputFieldShow
                }`}
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Conversation;
