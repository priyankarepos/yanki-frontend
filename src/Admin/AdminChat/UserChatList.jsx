import { Box, useMediaQuery, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../App";
import AdminDashboard from "../AdminDashboard";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import axios from "axios";
import OfflineUserAvtar from "../../Assets/images/OfflineUserAvtar.svg";
import Conversation from "./Conversation";
import "./AdminChat.scss";
import {
  startConnection,
  stopConnection,
  onReceiveMessage,
} from "../../SignalR/signalRService";

const UserChatList = () => {
  const [userList, setUserList] = useState([]);
  const { drawerOpen } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();
  const isSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.smallScreen)
  );
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.mediumScreen)
  );
  const latestUser = userList[0]?.userId;

  const handleReceivedMessage = useCallback(async (message) => {
    const response = await axios.get(
      `${apiUrls.getUserListById(message.senderId)}`
    );

    const date = new Date(message.timestamp);

    const options = {
      hour: agentChatResponse.numeric,
      minute: agentChatResponse.numeric,
      hour12: true,
    };
    const localTimeString = date.toLocaleTimeString(undefined, options);

    const newUser = {
      userId: response.data.userId,
      email: response.data.email,
      lastMessage: message.content,
      lastMessageTime: localTimeString,
    };

    setUserList([newUser]);
    stopConnection();
  }, []);

  const initializeConnection = useCallback(async () => {
    await startConnection();
    onReceiveMessage(handleReceivedMessage);
  
    return () => {
      stopConnection();
    };
  }, [handleReceivedMessage]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrls.userChatList}`);
        if (response.data.length === 0) {
          setUserList([]);
          await initializeConnection();
        }

        const processedMessages = response.data.map((message) => {
          const date = new Date(message.lastMessageTime);
          const options = {
            hour: agentChatResponse.numeric,
            minute: agentChatResponse.numeric,
            hour12: true,
          };
          const localTimeString = date.toLocaleTimeString(undefined, options);

          return { ...message, lastMessageTime: localTimeString };
        });

        setUserList(processedMessages);
      } catch (err) {}
    };
    fetchUsers();
  }, [initializeConnection]);

  const updateUserMessage = async (userList, message) => {
    let userIndex = -1;

    if (userList.length > 0) {
      userIndex = userList.findIndex(
        (user) =>
          user.userId === message.senderId ||
          message.receiverId.includes(user.userId)
      );
    }
    if (userIndex !== -1) {
      const updatedUserList = [...userList];
      updatedUserList[userIndex] = {
        ...updatedUserList[userIndex],
        lastMessage: message.content,
        lastMessageTime: message.timestamp,
      };

      return updatedUserList;
    } else {
      const response = await axios.get(
        `${apiUrls.getUserListById(message.senderId)}`
      );

      const newUser = {
        userId: response.data.userId,
        email: response.data.email,
        lastMessage: message.content,
        lastMessageTime: message.timestamp,
      };

      const updatedUserList = [newUser, ...userList];
      return updatedUserList;
    }
  };

  const handleUserList = async (message) => {
    const prevUserList = userList;
    const updatedUserList = await updateUserMessage(prevUserList, message);
    setUserList(updatedUserList);
  };

  useEffect(() => {
    if (!id && latestUser && !isMediumScreen) {
      navigate(`${apiUrls.chatNavigateUrlById(latestUser)}`);
    }
  }, [id, latestUser, navigate, isMediumScreen]);

  const handleListItemClick = (id) => {
    navigate(`${apiUrls.chatNavigateUrlById(id)}`);
  };

  return (
    <Box className={`${agentChatResponse.eventRequestContainer} ${isMediumScreen ? agentChatResponse.agentChatContainerHide : agentChatResponse.agentChatContainerShow}`}>
      <Box
        sx={{
          width:
            drawerOpen && !isSmallScreen
              ? agentChatResponse.drawerOpenWidth
              : agentChatResponse.zeroWidth,
        }}
      >
        <AdminDashboard />
      </Box>
      <Box
        className={`${agentChatResponse.enterpriseFormBox} ${
          isMediumScreen
            ? agentChatResponse.enterpriseFormBoxHide
            : agentChatResponse.enterpriseFormBoxShow
        }`}
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth,
        }}
      >
        {userList.length === 0 ? (
          <Typography className={agentChatResponse.noUserMessage}>
            No users have sent a message
          </Typography>
        ) : (
          <Box className={agentChatResponse.chatContainer}>
            <Box
              className={`${
                isMediumScreen && id
                  ? agentChatResponse.userListHide
                  : agentChatResponse.userListContainer
              }`}
            >
              {userList.map((user, index) => (
                <Box
                  className={`${agentChatResponse.userInfoContainer} ${
                    user.userId === id
                      ? agentChatResponse.activeChatSession
                      : agentChatResponse.deactivateChatSession
                  }`}
                  onClick={() => handleListItemClick(user.userId)}
                >
                  <img
                    className={agentChatResponse.userImage}
                    src={OfflineUserAvtar}
                    alt={user.email}
                  />
                  <Box className={agentChatResponse.userInfo}>
                    <Box className={agentChatResponse.userDetails}>
                      <Typography className={agentChatResponse.userEmail}>
                        {user.email}
                      </Typography>
                      <span className={agentChatResponse.lastMessageTime}>
                        {user.lastMessageTime}
                      </span>
                    </Box>
                    <Typography className={agentChatResponse.lastMessage}>
                      {user.lastMessage}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            {id && <Conversation onUserList={handleUserList} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserChatList;
