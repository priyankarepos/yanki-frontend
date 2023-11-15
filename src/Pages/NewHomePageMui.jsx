import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet, Link } from "react-router-dom";
import {
    Drawer,
    Typography,
    CssBaseline,
    AppBar,
    Toolbar,
    IconButton,
    TextField,
    Button,
    Box,
    CircularProgress,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileCircle from "../Components/ProfileCircle";
import { useContext } from "react";
import { Context, ThemeModeContext } from "../App";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import InputAdornment from "@mui/material/InputAdornment";
import "./HomeStyle.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SearchHistoryItem from "./SearchHistoryItem";
// import InfiniteScroll from 'react-infinite-scroll-component';


const styles = {
    sidebar: {
        width: "270px",
        padding: "16px",
        color: "#fff",
        border: "none",
    },
    content: {
        marginLeft: "0",
        transition: "margin-left 0.3s",
        position: "relative",
    },
    logoStyle: {
        width: "150px",
    },
};

const NewHomePageMui = () => {
    const { activeTab } = React.useContext(Context);
    const [drawerOpen, setDrawerOpen] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("isSubmitting", isSubmitting);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [queryAnswer, setQueryAnswer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    console.log("searchQuery", searchQuery);
    const { userLatitude, userLongitude, isLocationAllowed } = useContext(Context);
    const { themeMode } = useContext(ThemeModeContext);
    const [searchHistory, setSearchHistory] = useState([]);
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    // const [pageNumber, setPageNumber] = useState(0)
    // const [hasMore, setHasMore] = useState(true);
    const [initialChatOpen, setInitialChatOpen] = useState(true);

    console.log("chatSessions", chatSessions);

    const onSubmit = async () => {
        try {
            setIsSubmitting(true);
            setIsError(false);
            setErrorMsg("");
            setQueryAnswer(null);
            setSearchQuery("");

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const chatIdToUse = selectedChatId || (searchHistory.length > 0 ? searchHistory[0].chatId : null);
            console.log("chatIdToUse", chatIdToUse);
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

            if (response.status === 200) {
                setIsSubmitting(false);
                setQueryAnswer(response.data);
                setIsError(false);
                setErrorMsg("");

                const newChatId = response.data.chatId;

                if (!selectedChatId && !searchHistory.length) {
                    setSelectedChatId(newChatId);
                }

                // setChatSessions((prevSessions) => [
                //     { id: newChatId, name: `${searchQuery}...` },
                //     ...prevSessions,
                // ]);

                setSearchHistory((prevHistory) => [
                    ...prevHistory,
                    { query: searchQuery, response: response.data },
                ]);
            }

        } catch (error) {
            setIsSubmitting(false);
            setIsError(true);
            setQueryAnswer(null);
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

    const resetPage = () => {
        setIsSubmitting(false);
        setIsError(false);
        setErrorMsg("");
        setQueryAnswer(null);
        setSearchQuery("");
        setSearchHistory([]);
        setSelectedChatId(null);
        sessionStorage.removeItem("selectedChatId");
    };


    useEffect(() => {
        if (queryAnswer?.isSucess === false) {
            setIsError(true);
            setErrorMsg(queryAnswer?.message);
        }
    }, [queryAnswer]);

    const fetchChatSessions = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/chat-session-list?pageNumber=1&pageSize=500`
            );

            if (response.status === 200) {
                // const newChatSessions = response.data.chatList;

                // if (newChatSessions.length === 0) {
                //     setHasMore(false);
                // } else {
                //     setChatSessions(newChatSessions);
                //     setPageNumber((pageNumber) => pageNumber + 1);
                // }

                if (response.status === 200) {
                    setChatSessions(response.data.chatList);
                }
            }
        } catch (error) {
            console.error("Error fetching chat sessions:", error);
        }
    };


    useEffect(() => {
        if (initialChatOpen && chatSessions.length > 0) {
            const storedChatId = sessionStorage.getItem("selectedChatId");
            // const firstChatId = storedChatId || chatSessions[0].id;
            const firstChatId = storedChatId;
            handleChatSessionClick(firstChatId);
            setInitialChatOpen(false);
        }
    }, [initialChatOpen, chatSessions]);

    const handleChatSessionClick = async (chatId) => {
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
                                    contentResponse: gptResponse.ContentResponse,
                                    godavenPrayerDetails: gptResponse.GodavenPrayerDetails,
                                    isSucess: gptResponse.IsSucess,
                                    message: gptResponse.Message,
                                    torahAnytimeLectures: gptResponse.TorahAnytimeLectures,
                                    videoResult: gptResponse.VideoResult,
                                }
                            }

                        };
                    });

                    setSearchHistory([...parsedChatHistory].reverse());

                    const allResponses = parsedChatHistory.flat();

                    setSearchHistory([...allResponses].reverse());

                } catch (parseError) {
                    console.error("Error parsing chat history:", parseError);

                }
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);

        }
    };
    const fetchChatHistory = async (chatId) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/chat-history?chatId=${chatId}&pageNumber=1&pageSize=20`
            );

            if (response.status === 200) {

                console.log(response.data.chatHistory);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
            console.log("Full error response:", error.response);
        }
    };

    useEffect(() => {
        fetchChatSessions();
    }, [isSubmitting])

    useEffect(() => {
        if (selectedChatId) {
            fetchChatHistory(selectedChatId);
        }
    }, [selectedChatId]);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleQuestionClick = (question) => {
        setSearchQuery(question);
    };
    const initialQuestions = [
        { id: 1, text: "What time is latest shachris ?" },
        { id: 2, text: "Where is the next minyan nere me ?" },
        { id: 3, text: "Display mincha in sphard nusach ?" },
        { id: 4, text: "Play a class of Rabbi Krohn ?" },
        { id: 5, text: "Play something about roash hasana" },
        { id: 6, text: "What is the date for purim" },
    ];
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const handleSidebarState = () => {
        if (window.innerWidth >= 767) {
            setDrawerOpen(true);
        } else {
            setDrawerOpen(false);
        }
    };

    useEffect(() => {
        handleSidebarState();
        window.addEventListener("resize", handleSidebarState);
        return () => {
            window.removeEventListener("resize", handleSidebarState);
        };
    }, []);


    const contentMargin = drawerOpen && !isSmallScreen ? "270px" : "0";
    const fontSize = isSmallScreen ? "14px" : "16px";

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 4,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    return (
        <Box style={styles.adminDashboard}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    background: activeTab === 0 ? "#063762" : "#fff",
                    boxShadow: "none",
                }}
            >
                <Toolbar>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            marginX: "auto",
                            width: "280px",
                        }}
                    >
                        <img
                            src={
                                activeTab === 0
                                    ? "/auth-logo-dark.svg"
                                    : "/auth-logo-light.svg"
                            }
                            style={{ width: queryAnswer ? "10em" : "10em" }}
                            alt="logo"
                        />
                        {!drawerOpen &&<IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            style={{ ...styles.menuButton, color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}
                        >
                            <MenuIcon />
                        </IconButton>}
                    </Box>
                    <ProfileCircle />
                </Toolbar>
            </AppBar>
            <Drawer
                open={drawerOpen}
                onClose={toggleDrawer}
                variant="persistent"
                className="sidebarStyle"
            >
                <div style={styles.sidebar}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <img
                                src={
                                    activeTab === 0
                                        ? "/auth-logo-dark.svg"
                                        : "/auth-logo-light.svg"
                                }
                                style={{ width: queryAnswer ? "10em" : "10em" }}
                                alt="logo"
                            />
                        </Link>
                        {drawerOpen && <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            style={{ ...styles.menuButton, color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}
                        >
                            <MenuIcon />
                        </IconButton>}
                    </Box>
                    <IconButton
                        color="primary"
                        style={{
                            backgroundColor:
                                activeTab === 0 ? "#13416a" : "#eaf5ff",
                            color: activeTab === 0 ? "#fff" : "#72a9de",
                            padding: "14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            width: "100%",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginTop: "10px",
                        }}
                        onClick={resetPage}
                    >
                        <AddIcon />
                        &nbsp; New Chat
                    </IconButton>
                    <Box sx={{ marginTop: "25px" }}>
                        <span style={{ color: activeTab === 0 ? "#6fa8dd" : "gray" }}>
                            Recent Chat
                        </span>
                        {/* <InfiniteScroll
                            dataLength={chatSessions.length}
                            next={fetchChatSessions}
                            hasMore={hasMore}
                            loader={<Typography><CircularProgress /></Typography>}
                        >
                            
                        </InfiniteScroll> */}
                        {chatSessions.map((chatSession) => (
                            <IconButton
                                key={chatSession.id}
                                color="primary"
                                style={{
                                    backgroundColor: activeTab === 0 ? "#13416a" : "#eaf5ff",
                                    color: activeTab === 0 ? "#fff" : "#72a9de",
                                    padding: "11px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    fontSize,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    marginTop: "10px",
                                }}
                                onClick={() => handleChatSessionClick(chatSession.id)}
                            >
                                <ChatBubbleIcon />
                                <Typography style={{
                                    width: "200px",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden", textAlign: "left"
                                }}>&nbsp; {chatSession.name}</Typography>
                            </IconButton>
                        ))}

                    </Box>
                </div>
            </Drawer>
            <Box
                style={{
                    ...styles.content,
                    marginLeft: contentMargin,
                    backgroundColor: activeTab === 0 ? "#063762" : "#fff",
                }}
            >
                <Toolbar style={{ minHeight: "0px", }} />
                <Box
                    sx={{
                        width: { xs: "100%", sm: "96%" },
                        marginX: "auto",
                        // margin: paperMargin,
                        padding: "20px",
                        height: "90vh",
                        background: activeTab === 0 ? "#13416a" : "#eaf5ff",
                        borderRadius: "20px",
                        // position: "relative",
                        bottom: "20px",
                        marginTop: "15px",
                    }}
                >
                    <Box className="answerBox">


                        {/* {queryAnswer?.isSucess && queryAnswer?.contentResponse && (
                            <SentenceAnswer answer={queryAnswer} />
                        )}

                        {queryAnswer?.isSucess &&
                            queryAnswer?.torahAnytimeLectures?.hits?.hits?.length && (
                                <TorahanytimeAnswer answer={queryAnswer} />
                            )}

                        {queryAnswer?.isSucess &&
                            queryAnswer?.godavenPrayerDetails?.length && (
                                <GovadenAnswer answer={queryAnswer} />
                            )}

                        {queryAnswer?.isSucess && queryAnswer?.enterprises?.length && (
                            <DemoEnterpriseChat answer={queryAnswer} />
                        )} */}

                        {/* {isError && <ErrorAnswer errorMsg={errorMsg} />} */}

                        <Box>
                            {searchHistory.map((entry, index) => (
                                <SearchHistoryItem key={index} query={entry.query} response={entry?.response?.response} errorMsg={errorMsg} isError={isError} searchQuery={searchQuery} />
                            ))}
                        </Box>
                        {isSubmitting && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Typography className="text-center">
                                    <CircularProgress />
                                </Typography>
                            </Box>
                        )}
                        {searchHistory.length <= 0 && !isSubmitting && <Box className="centerText">
                            <Typography style={{
                                fontSize: "33px", textAlign: "center", height: "60vh", display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: activeTab === 0 ? "#fff" : "#063762",
                            }}>Hi! Not sure where to start today ?</Typography>
                        </Box>}
                    </Box>

                    <Box sx={{ paddingLeft: drawerOpen && !isSmallScreen ? "280px" : "0px" }} className="fixedSearchBox">
                        {searchHistory.length <= 0 && !isSubmitting && (
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
                            >
                                {initialQuestions.map((question) => (
                                    <Button
                                        key={question.id}
                                        onClick={() => handleQuestionClick(question.text)}
                                        style={{
                                            backgroundColor:
                                                activeTab === 0 ? "#fff" : "#fff",
                                            color: activeTab === 0 ? "#13416a" : "#063762",
                                            padding: "8px 16px",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            display: "block",
                                            width: "100%",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            fontSize: "16px",
                                            textTransform: "none",
                                        }}
                                    >
                                        {question.text}
                                    </Button>
                                ))}
                            </Carousel>
                        )}
                        <form>
                            <Box
                                sx={{
                                    bottom: 0,
                                    backgroundColor: "transparent",
                                    boxShadow: "none",
                                    zIndex: 1000,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    name="searchQuery"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Message Yanki.."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon  style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        marginBottom: "1rem",
                                        backgroundColor: activeTab === 0 ? "#063762" : "#fff",
                                        color: activeTab === 0 ? "#fff" : "#8bbae5",
                                        borderRadius: "50px",
                                        fontSize,
                                    }}
                                    error={isError}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        textAlign: "center",
                                        justifyContent: "right",
                                        paddingBottom: "16px",
                                    }}
                                >
                                    <IconButton
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                        onClick={onSubmit}
                                        sx={{
                                            marginLeft: "16px",
                                            marginTop: "0px",
                                            backgroundColor: themeMode === "dark" ? "#6fa8dd" : "#fff",
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
            <Outlet />
        </Box>
    );
};

export default NewHomePageMui;
