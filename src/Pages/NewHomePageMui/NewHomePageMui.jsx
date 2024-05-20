import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
  Typography,
  TextField,
  Button,
  Tooltip,
  Paper,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Context, ThemeModeContext } from "../../App";
import { useContext } from "react";
import ProfielCircle from "../../Components/ProfileCircle";
import { Outlet, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import Carousel from "react-multi-carousel";
import SearchHistoryItem from "../SearchHistoryItem";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ConfirmDialog from "../../EnterpriseCollabration/ConfirmDialog";
import {
  initialQuestions1,
  initialQuestions2,
  initialQuestions3,
  initialQuestions4,
} from "../../Utils/promptData/promptData";
import "./NewHomePageStyle.scss";
import { useNavigate } from "react-router-dom";

const NewHomePageMui = () => {
  const { activeTab } = React.useContext(Context);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [initialChatOpen, setInitialChatOpen] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [queryAnswer, setQueryAnswer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoverChatId, setHoverChatId] = useState(null);
  const [direction, setDirection] = useState("ltr");
  const [queryDirection, setQueryDirection] = useState("ltr");
  const [shouldScroll, setShouldScroll] = useState(true);
  const [remainingMsgData, setRemainingMsgData] = useState([]);
  const [updateCustomerId, setUpdateCustomerId] = useState('');
  const { themeMode } = useContext(ThemeModeContext);
  const { userLatitude, userLongitude, isLocationAllowed } =
    useContext(Context);
  const chatContainerRef = useRef(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery("(min-width: 567px)");
  const fontSize = isSmallScreen ? "14px" : "16px";
  const yankiUser = JSON.parse(
    window.localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN) ||
      "{}"
  );
  const userRoles = yankiUser?.userObject?.userRoles || "";
  const navigate = useNavigate();
  const onClickMembershipPortal = () => {
    navigate("/membership");
  };

  const fetchRemainingMessage = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/stripe/get-remaining-message-task`
      );

      if (response.status === 200) {
        setRemainingMsgData(response.data);
      } else {
        throw new Error("Failed to fetch remaining data");
      }
    } catch (error) {
      setSnackbarMessage("Error fetching data: " + error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchUpdateCustomerId = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/stripe/get-customer-id`);
        setUpdateCustomerId(response.data);
      } catch (error) {
        setSnackbarMessage('Error fetching data:', error);
        setSnackbarOpen(true);
      }
    };

    fetchUpdateCustomerId();
  }, []);

  useEffect(() => {
    fetchRemainingMessage();
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
      partialVisibilityGutter: 10,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      partialVisibilityGutter: 10,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      partialVisibilityGutter: 10,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 10,
    },
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSidebarState = () => {
    if (window.innerWidth >= 767) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  };

  const storedSearchQuery = sessionStorage.getItem("searchQuery");

  const onSubmit = async () => {
    sessionStorage.setItem("searchQuery", searchQuery);
    try {
      setShouldScroll(true);
      setIsSubmitting(true);
      setPageNumber(1);
      setIsError(false);
      setErrorMsg("");
      setQueryAnswer(null);
      setSearchQuery("");
      setDirection("ltr");

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const chatIdToUse =
        (searchHistory.length > 0 && searchHistory[0].chatId) || selectedChatId;
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/all-answers`,
        { prompt: searchQuery },
        {
          headers: {
            "Content-Type": "application/json",
            "Location-Allowed": isLocationAllowed,
            TimeZone: timezone,
            "User-Lat": userLatitude,
            "User-Long": userLongitude,
            "Chat-Id": chatIdToUse,
          },
        }
      );

      if (response.status === 200 || response.status >= 300) {
        if (
          remainingMsgData?.totalMessageLeft <= 0 &&
          remainingMsgData?.totalTaskLeft <= 0 &&
          updateCustomerId?.isPlanSubscribed
        ) {
          navigate("/membership");
          return;

        } else {
          setShouldScroll(true);
          setIsSubmitting(false);
          setQueryAnswer(response.data);
          setIsError(false);
          setErrorMsg("");
          const newChatId = response.data.chatId;
          if (!selectedChatId && !searchHistory.length) {
            setSelectedChatId(newChatId);
          }

          setSearchHistory((prevHistory) => {
            const updatedHistory = [
              ...prevHistory,
              { query: searchQuery, response: response.data },
            ];
            sessionStorage.removeItem("searchQuery");
            return updatedHistory;
          });
          fetchRemainingMessage();
        }
      }
    } catch (error) {
      if (
        remainingMsgData?.totalMessageLeft <= 0 &&
        remainingMsgData?.totalTaskLeft <= 0 ||
        !updateCustomerId?.isPlanSubscribed
      ) {
        navigate("/membership");
        return;

      }
      setIsSubmitting(false);
      setIsError(true);
      setQueryAnswer(null);
      sessionStorage.removeItem("searchQuery");
      if (error?.request?.status === 0) {
        setErrorMsg(
          typeof error?.message === "string"
            ? error?.message
            : "Something went wrong"
        );
      } else if (error?.request?.responseText) {
        setErrorMsg(error.request.responseText);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (queryAnswer?.isSucess === false) {
      setIsError(true);
      setErrorMsg(queryAnswer?.message);
    }
  }, [queryAnswer]);

  useEffect(() => {
    handleSidebarState();
    window.addEventListener("resize", handleSidebarState);
    return () => {
      window.removeEventListener("resize", handleSidebarState);
    };
  }, []);

  const fetchChatSessions = useCallback(async () => {
    if (hasMore) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/yanki-ai/chat-session-list?pageNumber=${pageNumber}&pageSize=60`
        );
        if (response.status === 200) {
          if (response.data.chatList.length > 0) {
            if (pageNumber === 1) {
              setChatSessions(response.data.chatList);
            } else {
              setChatSessions((prevData) => [
                ...prevData,
                ...response.data.chatList,
              ]);
            }
          } else {
            setHasMore(!hasMore);
          }
        }
      } catch (error) {
        setSnackbarMessage("Error:", error);
        setSnackbarOpen(false);
      }
    }
  }, [pageNumber, hasMore]);

  const handleChatSessionClick = useCallback(async (chatId) => {
    sessionStorage.setItem("selectedChatId", chatId);
    setSelectedChatId(chatId);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/chat-history?chatId=${chatId}&pageNumber=1&pageSize=20`
      );

      if (response.status === 200) {
        const chatHistoryArray = response.data.chatHistory;

        try {
          const parsedChatHistory = chatHistoryArray.map((chatEntry) => {
            const gptResponse = JSON.parse(chatEntry.gptResponse);

            return {
              query: chatEntry.userQuery,
              response: {
                chatId: chatEntry.chatId,
                response: {
                  contentResponse: gptResponse.contentResponse,
                  godavenPrayerDetails: gptResponse.godavenPrayerDetails,
                  isSucess: gptResponse.isSucess,
                  message: gptResponse.message,
                  torahAnytimeLectures: gptResponse.torahAnytimeLectures,
                  vimeoVideoDetails: gptResponse.vimeoVideoDetails,
                  enterpriseSelections: gptResponse.enterpriseSelections,
                  pdfNames: gptResponse.pdfNames,
                  userType: gptResponse.userType,
                  isExclusiveContent: gptResponse.isExclusiveContent,
                  isItKosher: gptResponse.isItKosher,
                  enterprisePdfNames: gptResponse.enterprisePdfNames,
                  safetyChecker: gptResponse.safetyChecker,
                  globalAssist: gptResponse.globalAssist,
                  isEvent: gptResponse.isEvent,
                  isPersonalAssistant: gptResponse.isPersonalAssistant,
                  firstAidVideos: gptResponse.firstAidVideos,
                  isViewReminder: gptResponse.isViewReminder,
                  isHelpAgent: gptResponse.isHelpAgent,
                  totalMessageLeft: gptResponse.totalMessageLeft,
                  totalTaskLeft: gptResponse.totalTaskLeft,
                },
              },
            };
          });

          setSearchHistory([...parsedChatHistory].reverse());

          const allResponses = parsedChatHistory.flat();

          setSearchHistory([...allResponses].reverse());
        } catch (parseError) {
          setSnackbarMessage("Error:", parseError);
          setSnackbarOpen(false);
        }
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    }
  }, []);

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/chat-history?chatId=${chatId}&pageNumber=1&pageSize=20`
      );

      if (response.status === 200) {
        setShouldScroll(true);
        sessionStorage.removeItem("searchQuery");
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions, isSubmitting]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory(selectedChatId);
    }
  }, [selectedChatId]);

  const handleQuestionClick = (question) => {
    setSearchQuery(question);
  };

  useEffect(() => {
    if (initialChatOpen && chatSessions.length > 0) {
      const storedChatId = sessionStorage.getItem("selectedChatId");
      const firstChatId = storedChatId;
      handleChatSessionClick(firstChatId);
      setInitialChatOpen(false);

      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [initialChatOpen, chatSessions, handleChatSessionClick]);

  const handleDeleteClick = (id) => {
    setConfirmDialogOpen(true);
    setSelectedChatId(id);
    setConfirmationText(`Are you sure you want to delete this chat?`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/delete-chat-session?chatId=${selectedChatId}`
      );

      if (response.status === 200) {
        const updatedChatSessions = chatSessions.filter(
          (session) => session.id !== selectedChatId
        );
        setChatSessions(updatedChatSessions);
        setSnackbarMessage(response?.data?.message);
        setSnackbarOpen(true);
        resetPage();
      } else {
        setSnackbarMessage("Failed to delete chat session");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(false);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore) {
      setPageNumber(pageNumber + 1);
    }
  };

  const resetPage = () => {
    setIsSubmitting(false);
    setIsError(false);
    setErrorMsg("");
    setQueryAnswer(null);
    setSearchQuery("");
    setSearchHistory([]);
    setSelectedChatId(null);
    sessionStorage.removeItem("selectedChatId");
    if (!isLargeScreen) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  };

  const handleMouseEnter = (chatId) => {
    setHoverChatId(chatId);
  };

  const handleMouseLeave = () => {
    setHoverChatId(null);
  };

  useEffect(() => {
    document.documentElement.classList.add("custom-html-css");
    document.body.classList.add("custom-body-css");
    return () => {
      document.documentElement.classList.add("custom-html-css");
      document.body.classList.remove("custom-body-css");
    };
  }, []);

  // It might be used in future

  // useEffect(() => {
  //   const chatContainerNode = chatContainerRef.current;

  //   const scrollToBottom = () => {
  //     chatContainerNode.scrollTop = chatContainerNode.scrollHeight;
  //   };

  //   scrollToBottom();

  //   chatContainerNode.style.scrollBehavior = "auto";

  //   const observer = new MutationObserver(scrollToBottom);
  //   observer.observe(chatContainerNode, { childList: true, subtree: true });

  //   return () => {
  //     chatContainerNode.style.scrollBehavior = "smooth";
  //     observer.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    const chatContainerNode = chatContainerRef.current;

    const scrollToBottom = () => {
      chatContainerNode.scrollTop = chatContainerNode.scrollHeight;
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (shouldScroll) {
            scrollToBottom();
            chatContainerNode.style.scrollBehavior = "auto";
            setShouldScroll(false);
          }
        }
      });
    });

    observer.observe(chatContainerNode, {
      childList: true,
      subtree: true,
    });

    scrollToBottom();
    chatContainerNode.style.scrollBehavior = "auto";

    return () => {
      observer.disconnect();
    };
  }, [shouldScroll]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);

    const containsHebrew = /[\u0590-\u05FF]/.test(e.target.value);
    const containsEnglish = /[a-zA-Z]/.test(e.target.value);
    let newDirection;

    if (containsEnglish && containsHebrew) {
      newDirection = "ltr";
    } else if (containsHebrew) {
      newDirection = "rtl";
    } else {
      newDirection = "ltr";
    }

    setDirection(newDirection);
    setQueryDirection(newDirection);
  };

  return (
    <Box className="ya-home-wrapper">
      <CssBaseline />
      <AppBar
        className={`ya-home-header ${
          activeTab === 0
            ? "ya-home-darkblue-background"
            : "ya-home-white-background"
        } `}
      >
        <Toolbar>
          {!drawerOpen && (
            <Box className="ya-home-sidebar-box">
              <img
                src={
                  activeTab === 0
                    ? "/auth-logo-dark.svg"
                    : "/auth-logo-light.svg"
                }
                className="ya-logo-img"
                alt="logo"
              />
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                className={`${
                  activeTab === 1
                    ? "ya-home-lightblue-color"
                    : "ya-home-white-color"
                }`}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          <ProfielCircle />
        </Toolbar>
      </AppBar>

      <Box>
        <Drawer
          open={drawerOpen}
          onClose={toggleDrawer}
          variant="persistent"
          className="sidebarStyle"
        >
          <div className="ya-sidebar-styles">
            {drawerOpen && (
              <Box className="ya-sidebar-styles-box">
                <Link to="/">
                  <img
                    src={
                      activeTab === 0
                        ? "/auth-logo-dark.svg"
                        : "/auth-logo-light.svg"
                    }
                    className="ya-logo-img"
                    alt="logo"
                  />
                </Link>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer}
                  className={`${
                    activeTab === 1
                      ? "ya-home-lightblue-color"
                      : "ya-home-white-color"
                  }`}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
            <IconButton
              color="primary"
              className={`ya-new-chat-btn ${
                activeTab === 0
                  ? "ya-home-new-chat-dark-theme"
                  : "ya-home-new-chat-light-theme"
              }`}
              onClick={resetPage}
            >
              <AddIcon />
              &nbsp; New Chat
            </IconButton>
            <Box className="ya-new-chat-box" onScroll={handleScroll}>
              <span
                className={`${
                  activeTab === 0 ? "ya-home-blue-color" : "ya-home-gray-color"
                }`}
              >
                Recent Chat
              </span>
              {chatSessions.map((chatSession) => (
                <div key={chatSession.id}>
                  <IconButton
                    className={`ya-chat-session-btn ${
                      chatSession.id === selectedChatId
                        ? "ya-home-active-session-btn"
                        : activeTab === 0
                        ? "ya-home-new-chat-dark-theme"
                        : "ya-home-new-chat-light-theme"
                    }`}
                    color="primary"
                    onClick={() => handleChatSessionClick(chatSession.id)}
                    onMouseEnter={() => handleMouseEnter(chatSession.id)}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <ChatBubbleIcon />
                    <Typography className="ya-chat-session-name">
                      &nbsp; {chatSession.name}
                    </Typography>
                    {chatSession.id === hoverChatId && (
                      <IconButton
                        className={`ya-home-delete-btn ${
                          chatSession.id === selectedChatId
                            ? "ya-home-active-session-btn"
                            : activeTab === 0
                            ? "ya-home-new-chat-dark-theme"
                            : "ya-home-new-chat-light-theme"
                        }`}
                        onClick={() => handleDeleteClick(chatSession.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </IconButton>
                </div>
              ))}
            </Box>
          </div>
        </Drawer>

        <Box className="ya-answer-wrapper-position">
          <Box
            className={`ya-answer-wrapper ${
              activeTab === 0
                ? "ya-answer-wrapper-dark-theme"
                : "ya-answer-wrapper-light-theme"
            } ${
              drawerOpen && !isSmallScreen
                ? "ya-answer-drawn-close"
                : "ya-answer-drawn-open"
            }`}
          >
            <Box>
              <Box
                className={`ya-answer-container ${
                  activeTab === 0
                    ? "ya-answer-container-dark-theme"
                    : "ya-answer-container-light-theme"
                } ${
                  isSmallScreen
                    ? "ya-answer-container-smallScreen-border"
                    : "ya-answer-container-border"
                } `}
                sx={{
                  width: { xs: "100%", sm: "96%" },
                }}
              >
                <Box className="ya-answer" ref={chatContainerRef}>
                  {searchHistory.map((entry, index) => (
                    <SearchHistoryItem
                      key={index}
                      query={entry.query}
                      response={entry?.response?.response}
                      errorMsg={errorMsg}
                      isError={isError}
                      searchQuery={searchQuery}
                      fetchRemainingMessage={fetchRemainingMessage}
                    />
                  ))}
                  {storedSearchQuery && (
                    <Paper
                      elevation={3}
                      className="ya-question-box"
                      dir={queryDirection}
                    >
                      <div sx={{ p: 2 }}>
                        <Box sx={{ p: 2 }} className="ya-question-box-flex">
                          <ChatBubbleOutlineIcon
                            fontSize="small"
                            className={`ya-ChatBubbleOutlineIcon ${
                              activeTab === 0
                                ? "ya-home-white-color"
                                : "ya-home-lightblue-color"
                            }`}
                          />
                          <Typography
                            className={`ya-question-box-text ${
                              activeTab === 0
                                ? "ya-home-white-color"
                                : "ya-home-lightblue-color"
                            }`}
                          >
                            {storedSearchQuery}
                          </Typography>
                        </Box>
                      </div>
                    </Paper>
                  )}
                  {isSubmitting && (
                    <Box className="ya-progress-bar-box">
                      <Typography className="text-center">
                        <CircularProgress />
                      </Typography>
                    </Box>
                  )}
                  {searchHistory.length <= 0 && !isSubmitting && (
                    <Box className="ya-answer-container-response">
                      <Typography className="ya-main-text-heading">
                        What mitzvah can AI help you with?
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box className="ya-search-container">
                  <Box
                    className={`fixed-search-Box ${
                      drawerOpen && !isSmallScreen
                        ? "ya-answer-drawn-close"
                        : "ya-answer-container-question"
                    }`}
                  >
                    {isLargeScreen &&
                      searchHistory.length <= 0 &&
                      !isSubmitting && (
                        <>
                          <Carousel
                            responsive={responsive}
                            itemClass="carousel-item"
                            swipeable={true}
                            draggable={false}
                            showDots={false}
                            arrows={false}
                            autoPlay={true}
                            autoPlaySpeed={2000}
                            infinite={true}
                            className="new-home-initial-questions"
                            customTransition="transform 500ms ease 0s"
                          >
                            {initialQuestions1.map((question, index) => (
                              <div key={question.id} className="carousel-item">
                                <Button
                                  className={`ya-slider-btn ${
                                    activeTab === 0
                                      ? "ya-search-dark-theme"
                                      : "ya-search-light-theme"
                                  }`}
                                  onClick={() =>
                                    handleQuestionClick(question.text)
                                  }
                                >
                                  <Tooltip title={question.text}>
                                    {question.text}
                                  </Tooltip>
                                </Button>
                              </div>
                            ))}
                          </Carousel>
                          <Carousel
                            responsive={responsive}
                            itemClass="carousel-item"
                            swipeable={true}
                            draggable={false}
                            showDots={false}
                            arrows={false}
                            autoPlay={true}
                            autoPlaySpeed={2000}
                            infinite={true}
                            customTransition="transform 500ms ease 0s"
                            className="new-home-initial-questions"
                          >
                            {initialQuestions2.map((question, index) => (
                              <div key={question.id} className="carousel-item">
                                <Button
                                  className={`ya-slider-btn ${
                                    activeTab === 0
                                      ? "ya-search-dark-theme"
                                      : "ya-search-light-theme"
                                  }`}
                                  onClick={() =>
                                    handleQuestionClick(question.text)
                                  }
                                >
                                  <Tooltip title={question.text}>
                                    {question.text}
                                  </Tooltip>
                                </Button>
                              </div>
                            ))}
                          </Carousel>
                          <Carousel
                            responsive={responsive}
                            itemClass="carousel-item"
                            swipeable={true}
                            draggable={false}
                            showDots={false}
                            arrows={false}
                            autoPlay={true}
                            autoPlaySpeed={2000}
                            infinite={true}
                            customTransition="transform 500ms ease 0s"
                            className="new-home-initial-questions"
                          >
                            {initialQuestions3.map((question, index) => (
                              <div key={question.id} className="carousel-item">
                                <Button
                                  className={`ya-slider-btn ${
                                    activeTab === 0
                                      ? "ya-search-dark-theme"
                                      : "ya-search-light-theme"
                                  }`}
                                  onClick={() =>
                                    handleQuestionClick(question.text)
                                  }
                                >
                                  <Tooltip title={question.text}>
                                    {question.text}
                                  </Tooltip>
                                </Button>
                              </div>
                            ))}
                          </Carousel>
                          <Carousel
                            responsive={responsive}
                            itemClass="carousel-item"
                            swipeable={true}
                            draggable={false}
                            showDots={false}
                            arrows={false}
                            autoPlay={true}
                            autoPlaySpeed={2000}
                            infinite={true}
                            customTransition="transform 500ms ease 0s"
                            className="new-home-initial-questions"
                          >
                            {initialQuestions4.map((question, index) => (
                              <div key={question.id} className="carousel-item">
                                <Button
                                  className={`ya-slider-btn ${
                                    activeTab === 0
                                      ? "ya-search-dark-theme"
                                      : "ya-search-light-theme"
                                  }`}
                                  onClick={() =>
                                    handleQuestionClick(question.text)
                                  }
                                >
                                  <Tooltip title={question.text}>
                                    {question.text}
                                  </Tooltip>
                                </Button>
                              </div>
                            ))}
                          </Carousel>
                        </>
                      )}
                    {!isLargeScreen &&
                      searchHistory.length <= 0 &&
                      !isSubmitting && (
                        <div className="home-table-scroll">
                          <>
                            {[
                              initialQuestions1,
                              initialQuestions2,
                              initialQuestions3,
                              initialQuestions4,
                            ].map((questions, index) => (
                              <Typography
                                className="ya-mobile-prompt"
                                key={index}
                              >
                                {questions.map((question) => (
                                  <span
                                    key={question.id}
                                    onClick={() =>
                                      handleQuestionClick(question.text)
                                    }
                                    className={`ya-home-table-btn ${
                                      activeTab === 0
                                        ? "ya-search-dark-theme"
                                        : "ya-search-light-theme"
                                    }`}
                                  >
                                    <Tooltip title={question.text}>
                                      {question.text}
                                    </Tooltip>
                                  </span>
                                ))}
                              </Typography>
                            ))}
                          </>
                        </div>
                      )}

                    <form>
                      {userRoles !== "Admin" && (
                        <Box className="ya-task-msg-text">
                          <Typography>
                            Remaining messages:{" "}
                            {remainingMsgData?.totalMessageLeft > 1200 ? "Unlimited" : remainingMsgData?.totalMessageLeft} and tasks:{" "}
                            {remainingMsgData?.totalTaskLeft}
                          </Typography>
                          <Typography>
                            <span onClick={onClickMembershipPortal}>
                              Subscribe to Pro
                            </span>
                          </Typography>
                        </Box>
                      )}
                      <Box
                        className={
                          activeTab === 0
                            ? "ya-home-search-wrapper"
                            : "ya-home-search-wrapper ya-home-search-wrapper-light"
                        }
                      >
                        <TextField
                          fullWidth
                          name="searchQuery"
                          value={searchQuery}
                          onChange={handleChange}
                          placeholder="What else can you do?"
                          dir={direction}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon
                                  className={`${
                                    activeTab === 1
                                      ? "ya-home-lightblue-color"
                                      : "ya-home-white-color"
                                  }`}
                                />
                              </InputAdornment>
                            ),
                          }}
                          className={`ya-search-query-container ${
                            activeTab === 0
                              ? "ya-search-query-container-dark-theme"
                              : "ya-search-query-container-light-theme"
                          }`}
                          sx={{
                            fontSize,
                          }}
                          error={isError}
                        />
                        <Box className="ya-send-btn-box">
                          <IconButton
                            variant="contained"
                            type="submit"
                            disabled={!searchQuery || isSubmitting}
                            onClick={onSubmit}
                            className="ya-send-icon"
                            sx={{
                              backgroundColor:
                                themeMode === "dark" ? "#6fa8dd" : "#fff",
                              color: themeMode === "dark" ? "#fff" : "#2a2b35",
                              "&:hover": {
                                backgroundColor: "primary.dark",
                              },
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </form>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Outlet />
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmDelete}
        confirmationText={confirmationText}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default NewHomePageMui;
