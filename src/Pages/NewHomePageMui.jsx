import React, { useState, useEffect, useRef, useCallback } from "react";
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
    Tooltip,
    TableRow,
    TableCell,
    TableHead,
    Table,
    Snackbar,
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
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";


const styles = {
    sidebar: {
        width: "270px",
        padding: "16px",
        color: "#fff",
        border: "none",
        paddingLeft: "15px",
    },
    content: {
        marginLeft: "0",
        transition: "margin-left 0.3s",
        position: "relative",
    },
    logoStyle: {
        width: "150px",
    },
    profileCircle: {
        position: 'absolute',
        top: '10px',
        right: '10px',
    },
};

const NewHomePageMui = () => {
    const { activeTab } = React.useContext(Context);
    const [drawerOpen, setDrawerOpen] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [queryAnswer, setQueryAnswer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { userLatitude, userLongitude, isLocationAllowed } = useContext(Context);
    const { themeMode } = useContext(ThemeModeContext);
    const [searchHistory, setSearchHistory] = useState([]);
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    // const [pageNumber, setPageNumber] = useState(0)
    // const [hasMore, setHasMore] = useState(true);
    const [initialChatOpen, setInitialChatOpen] = useState(true);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [hoverChatId, setHoverChatId] = useState(null);

    const handleMouseEnter = (chatId) => {
        setHoverChatId(chatId);
    };

    const handleMouseLeave = () => {
        setHoverChatId(null);
    };


    const isLargeScreen = useMediaQuery("(min-width: 567px)");

    const onSubmit = async () => {
        try {
            setIsSubmitting(true);
            setIsError(false);
            setErrorMsg("");
            setQueryAnswer(null);
            setSearchQuery("");

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const chatIdToUse = selectedChatId || (searchHistory.length > 0 ? searchHistory[0].chatId : null);
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
        if (!isLargeScreen) {
            setDrawerOpen(false);
        } else {
            setDrawerOpen(true);
        }
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
                                    videoResult: gptResponse.videoResult,
                                    enterpriseSelections: gptResponse.enterpriseSelections,
                                    pdfNames: gptResponse.pdfNames,
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
                if (!isLargeScreen) {
                    setDrawerOpen(false);
                } else {
                    setDrawerOpen(true);
                }
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);

        }
    }, [isLargeScreen]);

    useEffect(() => {
        if (initialChatOpen && chatSessions.length > 0) {
            const storedChatId = sessionStorage.getItem("selectedChatId");
            // const firstChatId = storedChatId || chatSessions[0].id;
            const firstChatId = storedChatId;
            handleChatSessionClick(firstChatId);
            setInitialChatOpen(false);

            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [initialChatOpen, chatSessions, handleChatSessionClick]);

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
        { id: 1, text: "What time is candle lighting?" },
        { id: 2, text: "Where is the next Minyan near me?" },
        { id: 3, text: "Display mincha in sphard nusach. " },
        { id: 4, text: "Play a class by Rabbi Paysach Krohn. " },
        { id: 5, text: "What date is July 18 2010 in Hebrew." },
        { id: 6, text: "Tell me everything you can do." },
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
                const updatedChatSessions = chatSessions.filter((session) => session.id !== selectedChatId);
                setChatSessions(updatedChatSessions);

                // Update other state or show snackbar message as needed
                setSnackbarMessage(response?.data?.message);
                setSnackbarOpen(true);
                console.log('Chat session deleted successfully');
                resetPage()
            } else {
                console.error('Failed to delete chat session');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setConfirmDialogOpen(false);
        }
    };


    const contentMargin = drawerOpen && !isSmallScreen ? "260px" : "0";
    const fontSize = isSmallScreen ? "14px" : "16px";
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

    const chatContainerRef = useRef(null);

    useEffect(() => {
        const chatContainerNode = chatContainerRef.current;

        const scrollToBottom = () => {
            chatContainerNode.scrollTop = chatContainerNode.scrollHeight;
        };

        scrollToBottom();

        chatContainerNode.style.scrollBehavior = 'auto';

        const observer = new MutationObserver(scrollToBottom);
        observer.observe(chatContainerNode, { childList: true, subtree: true });

        // Clean up
        return () => {
            chatContainerNode.style.scrollBehavior = 'smooth';
            observer.disconnect();
        };
    }, []);


    return (
        <Box style={styles.adminDashboard}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    background: activeTab === 0 ? "#022b4f" : "#fff",
                    boxShadow: "none",
                }}
            >
                <Toolbar>
                    {!drawerOpen &&
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
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer}
                                style={{ ...styles.menuButton, color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    }
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
                    {drawerOpen && <Box
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
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            style={{ ...styles.menuButton, color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>}
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
                            <div key={chatSession.id} style={{ position: "relative" }}>
                                <IconButton
                                    color="primary"
                                    style={{
                                        backgroundColor: chatSession.id === selectedChatId
                                            ? "#eaf5ff" // Highlighted background color
                                            : activeTab === 0
                                                ? "#13416a" // Regular background color for activeTab 0
                                                : "#eaf5ff", // Regular background color for activeTab 1
                                        color: chatSession.id === selectedChatId
                                            ? "#13416a" // Highlighted text color
                                            : activeTab === 0
                                                ? "#fff" // Regular text color for activeTab 0
                                                : "#72a9de", // Regular text color for activeTab 1
                                        padding: "11px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        display: "flex",
                                        fontSize,
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        marginTop: "10px",
                                        position: "relative", // Added position relative to the parent container
                                    }}
                                    onClick={() => handleChatSessionClick(chatSession.id)}
                                    onMouseEnter={() => handleMouseEnter(chatSession.id)}
                                    onMouseLeave={() => handleMouseLeave()}
                                >
                                    <ChatBubbleIcon />
                                    <Typography style={{
                                        width: "200px",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textAlign: "left",
                                        marginLeft: "8px", // Adjust the spacing between the icon and text
                                    }}>
                                        &nbsp; {chatSession.name}
                                    </Typography>
                                    {chatSession.id === hoverChatId && (
                                        <IconButton
                                            style={{
                                                position: "absolute",
                                                top: "2px",
                                                right: 0,
                                                backgroundColor: chatSession.id === selectedChatId
                                            ? "#eaf5ff" // Highlighted background color
                                            : activeTab === 0
                                                ? "#13416a" // Regular background color for activeTab 0
                                                : "#eaf5ff", 
                                                color: chatSession.id === selectedChatId
                                            ? "#13416a" // Highlighted text color
                                            : activeTab === 0
                                                ? "#fff" // Regular text color for activeTab 0
                                                : "#72a9de", // Regular text color for activeTab 1
                                                borderRadius: "0 8px 0 0", // Optional: Adjust the border radius
                                            }}
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
            <Box
                style={{
                    ...styles.content,
                    marginLeft: contentMargin,
                    backgroundColor: activeTab === 0 ? "#022b4f" : "#fff",
                }}
            >
                <Toolbar style={{ minHeight: "0px", }} />
                <Box
                    sx={{
                        width: { xs: "100%", sm: "96%" },
                        marginX: "auto",
                        padding: "20px",
                        height: "90vh",
                        background: activeTab === 0 ? "#13416a" : "#eaf5ff",
                        borderRadius: "20px",
                        bottom: "20px",
                        marginTop: "0px",
                        '@media (min-width: 1300px)': {
                            height: "100vh",
                        },
                    }}
                >
                    <Box className="answerBox" ref={chatContainerRef}
                        style={{
                            width: "100%",
                            marginX: "auto",
                            minHeight: "calc(100% - 90px)",
                            maxHeight: "calc(100% - 90px)",
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}>
                        <Box>
                            {searchHistory.map((entry, index) => (
                                <SearchHistoryItem
                                    key={index}
                                    query={entry.query}
                                    response={entry?.response?.response}
                                    errorMsg={errorMsg}
                                    isError={isError}
                                    searchQuery={searchQuery}
                                />
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
                            }}>Hi! Not sure where to start today?</Typography>
                        </Box>}
                    </Box>

                    <Box sx={{
                        marginLeft: drawerOpen && !isSmallScreen ? "280px" : "0px", height: searchHistory.length <= 0 && !isSubmitting ? "150px" : "70px", bottom: searchHistory.length <= 0 && !isSubmitting ? "20px" : "0px",
                        background:activeTab===1 ?  "#eaf5ff" : "transparent",'@media (min-width: 1300px)': {
                            background:activeTab===1 ?  "#eaf5ff" : "#13416a",
                            bottom: "20px",
                            paddingTop: searchHistory.length <= 0 && !isSubmitting ? "0px" : "20px",
                        }, 
                    }} className="fixedSearchBox">
                        {isLargeScreen && searchHistory.length <= 0 && !isSubmitting && (
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
                            >
                                {initialQuestions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className="carousel-item"
                                    >
                                        <Button
                                            onClick={() => handleQuestionClick(question.text)}
                                            style={{
                                                backgroundColor: activeTab === 0 ? "#fff" : "#fff",
                                                color: activeTab === 0 ? "#13416a" : "#063762",
                                                padding: "8px 12px",
                                                borderRadius: "50px",
                                                cursor: "pointer",
                                                textAlign: "center",
                                                display: "inline",
                                                width: "100%",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                fontSize: "16px",
                                                textTransform: "none",
                                            }}
                                        >
                                            <Tooltip title={question.text}>{question.text}</Tooltip>
                                        </Button>
                                    </div>
                                ))}
                            </Carousel>
                        )}
                        {!isLargeScreen && searchHistory.length <= 0 && !isSubmitting && (
                            <div style={{ overflowX: 'auto' }} className="home-table-scroll">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {initialQuestions.map((question) => (
                                                <TableCell>
                                                    <Button
                                                        key={question.id}
                                                        onClick={() => handleQuestionClick(question.text)}
                                                        style={{
                                                            backgroundColor: activeTab === 0 ? "#fff" : "#fff",
                                                            color: activeTab === 0 ? "#13416a" : "#063762",
                                                            padding: "8px 16px",
                                                            borderRadius: "50px",
                                                            cursor: "pointer",
                                                            textAlign: "left",
                                                            display: "inline",
                                                            width: "100%",
                                                            // minWidth: "200px",
                                                            // maxWidth: "200px",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            fontSize: "16px",
                                                            textTransform: "none",
                                                        }}
                                                    >
                                                        <Tooltip title={question.text}>
                                                            {question.text}
                                                        </Tooltip>
                                                    </Button>
                                                </TableCell>))}
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </div>
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
                                className="search-wrapper"
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
                                                <SearchIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
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
                                        disabled={!searchQuery}
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
        </Box >
    );
};

export default NewHomePageMui;
