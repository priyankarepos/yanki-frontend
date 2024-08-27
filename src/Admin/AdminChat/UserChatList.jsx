import { Box, useMediaQuery, Typography } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import UserInformations from "./UserInformations";
import { getConnectionPromise } from "../../SignalR/signalRService";
import OnlineUserAvatar from "../../Assets/images/OnlineUserAvtar.svg";

const UserChatList = () => {
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const { drawerOpen } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();
  const userListRef = useRef();
  const isSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.smallScreen)
  );
  const isLargeScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.largeScreen)
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
      unseenMessageCount: id ? 0 : 1,
    };
    setUserList([newUser]);
  }, []);

  useEffect(() => {
    userListRef.current = userList;
  }, [userList]);

  const handleUserStatus = (senderUser) => {
    setUserStatus((prevStatus) => {
      if (prevStatus[senderUser.userId]) {
        return {
          ...prevStatus,
          [senderUser.userId]: senderUser.status,
        };
      } else {
        return {
          ...prevStatus,
          [senderUser.userId]: senderUser.status,
        };
      }
    });
  };

  const initializeConnection = useCallback(() => {
    const connection = getConnectionPromise();

    if (connection) {
      connection.on(agentChatResponse.receiveMessage, (message) => {
        handleReceivedMessage(message);
      });

      connection.on(agentChatResponse.newUser, (senderUser) => {
        handleUserStatus(senderUser);
      });
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${apiUrls.userChatList}`);
      if (response.data.length === 0) {
        setUserList([]);
        initializeConnection();
      } else {
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
      }
      setIsLoading(true);
    };
    fetchUsers();
  }, [initializeConnection]);

  const updateUserMessage = async (userList, message) => {
    let userIndex = -1;

    if (userList.length > 0) {
      userIndex = userList.findIndex(
        (user) =>
          user.userId === message.senderId || message.receiverId === user.userId
      );
    }
    if (userIndex !== -1) {
      const updatedUserList = [...userList];
      updatedUserList[userIndex] = {
        ...updatedUserList[userIndex],
        lastMessage: message.content,
        lastMessageTime: message.timestamplabel,
        unseenMessageCount: message.receiverId
          ? 0
          : id === message.senderId
          ? 0
          : updatedUserList[userIndex].unseenMessageCount
          ? updatedUserList[userIndex].unseenMessageCount + 1
          : 1,
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
        lastMessageTime: message.timestamplabel,
        unseenMessageCount: 1,
      };

      const updatedUserList = [newUser, ...userList];
      return updatedUserList;
    }
  };

  const handleUserList = async (message) => {
    const prevUserList = userListRef.current;
    const updatedUserList = await updateUserMessage(prevUserList, message);
    fetchUserStatus();
    setUserList(updatedUserList);
  };

  const updateUserList = (id) => {
    setUserList((prevList) => {
      const userIndex = prevList.findIndex((user) => user.userId === id);

      if (userIndex !== -1) {
        const updatedList = [...prevList];
        updatedList[userIndex] = {
          ...updatedList[userIndex],
          unseenMessageCount: 0,
        };

        return updatedList;
      }
    });
  };

  useEffect(() => {
    if (!id && latestUser && !isLargeScreen) {
      updateUserList(latestUser);
      navigate(`${apiUrls.chatNavigateUrlById(latestUser)}`);
    }
  }, [id, latestUser, navigate, isLargeScreen]);

  const handleListItemClick = (id) => {
    updateUserList(id);

    navigate(`${apiUrls.chatNavigateUrlById(id)}`);
  };

  const handleUserInfoModalOpen = (res) => {
    setIsModalOpen(res);
  };

  const fetchUserStatus = async () => {
    var response = await axios.get(`${apiUrls.getUserStatus}`);
    const statusDict = response.data.reduce((acc, status) => {
      acc[status.userId] = status.status;
      return acc;
    }, {});
    setUserStatus(statusDict);
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  return (
    <Box
      className={`${agentChatResponse.eventRequestContainer} ${
        isLargeScreen
          ? agentChatResponse.agentChatContainerHide
          : agentChatResponse.agentChatContainerShow
      }`}
    >
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
        className={`${agentChatResponse.agentChatBackground} 
          ${agentChatResponse.enterpriseFormBox}
        } ${
          isLargeScreen
            ? agentChatResponse.enterpriseFormBoxHide
            : agentChatResponse.enterpriseFormBoxShow
        }`}
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth,
        }}
      >
        {isLoading && (
          <React.Fragment>
            {userList.length === 0 ? (
              <Typography className={agentChatResponse.noUserMessage}>
                No users have sent a message
              </Typography>
            ) : (
              <Box
                className={` ${
                  !isModalOpen ||
                  (!isModalOpen && !isLargeScreen) ||
                  (isModalOpen && !isLargeScreen)
                    ? agentChatResponse.chatContainer
                    : agentChatResponse.hideChatContainer
                }`}
              >
                {(!isModalOpen ||
                  (!isModalOpen && !isLargeScreen) ||
                  (isModalOpen && !isLargeScreen)) && (
                  <Box
                    className={` ${
                      !isModalOpen
                        ? agentChatResponse.chatInformationContainer
                        : agentChatResponse.chatInformationContainerModalOpen
                    }`}
                  >
                    {!isModalOpen && (
                      <Box
                        className={`${
                          isLargeScreen && id
                            ? agentChatResponse.userListHide
                            : agentChatResponse.userListContainer
                        }`}
                      >
                        {userList.map((user, index) => (
                          <Box
                            key={index}
                            className={`${
                              agentChatResponse.userInfoContainer
                            } ${
                              user.userId === id
                                ? agentChatResponse.activeChatSession
                                : agentChatResponse.deactivateChatSession
                            }`}
                            onClick={() => handleListItemClick(user.userId)}
                          >
                            <img
                              className={agentChatResponse.userImage}
                              src={
                                userStatus[user.userId] ===
                                agentChatResponse.online
                                  ? OnlineUserAvatar
                                  : OfflineUserAvtar
                              }
                              alt={user.email}
                            />

                            <Box className={agentChatResponse.userInfo}>
                              <Box className={agentChatResponse.userDetails}>
                                <Typography
                                  className={agentChatResponse.userEmail}
                                >
                                  {user.email}
                                </Typography>
                                <Box className={agentChatResponse.messageBox}>
                                  {user.unseenMessageCount !== 0 && (
                                    <span
                                      className={
                                        agentChatResponse.unseenMessageCount
                                      }
                                    >
                                      {user.unseenMessageCount}
                                    </span>
                                  )}
                                  <span
                                    className={
                                      agentChatResponse.lastMessageTime
                                    }
                                  >
                                    {user.lastMessageTime}
                                  </span>
                                </Box>
                              </Box>
                              <Typography
                                className={agentChatResponse.lastMessage}
                              >
                                {user.lastMessage}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                    {id && (
                      <Conversation
                        onUserList={handleUserList}
                        isModalOpen={isModalOpen}
                        userInfoModalOpen={handleUserInfoModalOpen}
                      />
                    )}
                  </Box>
                )}
                {isModalOpen && <UserInformations />}
              </Box>
            )}
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default UserChatList;
