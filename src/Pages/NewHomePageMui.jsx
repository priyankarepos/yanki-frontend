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
    useMediaQuery, // Import useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileCircle from "../Components/ProfileCircle";
import SentenceAnswer from "../Components/SentenceAnswer";
import ErrorAnswer from "../Components/ErrorAnswer";
import GovadenAnswer from "../Components/GovadenAnswer";
import TorahanytimeAnswer from "../Components/TorahanytimeAnswer";
// import { useForm, Controller } from "react-hook-form";
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
import DemoEnterpriseChat from "../Components/DemoEnterpriseChat";
import SearchHistoryItem from "./SearchHistoryItem";

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
    const [drawerOpen, setDrawerOpen] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [queryAnswer, setQueryAnswer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    console.log("searchQuery", searchQuery);
    const { userLatitude, userLongitude, isLocationAllowed } = useContext(Context);
    const { themeMode } = useContext(ThemeModeContext);
    const [searchHistory, setSearchHistory] = useState([]);

    console.log("searchHistory", searchHistory);


    const onSubmit = async () => {
        try {
            setIsSubmitting(true);
            setIsError(false);
            setErrorMsg("");
            setQueryAnswer(null);
            setSearchQuery("");

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/all-answers`,
                { prompt: searchQuery }, // Use searchQuery directly
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Location-Allowed": isLocationAllowed,
                        TimeZone: timezone,
                        "User-Lat": userLatitude,
                        "User-Long": userLongitude,
                    },
                }
            );

            if (response.status === 200) {
                setIsSubmitting(false);
                setQueryAnswer(response.data);
                setIsError(false);
                setErrorMsg("");

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

    useEffect(() => {
        if (queryAnswer?.isSucess === false) {
            setIsError(true);
            setErrorMsg(queryAnswer?.message);
        }
    }, [queryAnswer]);

    //   const onReset = () => {
    //     reset();
    //     setQueryAnswer(null);
    //     setIsError(false);
    //   };

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
                    background: themeMode === "dark" ? "#063762" : "#fff",
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
                            src={themeMode === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
                            style={{ width: queryAnswer ? "10em" : "10em" }}
                            alt="logo"
                        />
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            style={styles.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
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
                                    themeMode === "dark" ? "/logo-dark.svg" : "/logo-light.svg"
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
                            style={styles.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <IconButton
                        color="primary"
                        style={{
                            backgroundColor:
                                themeMode === "dark" ? "#13416a" : "#2a2b35",
                            color: themeMode === "dark" ? "#fff" : "#fff",
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
                    >
                        <AddIcon />
                        &nbsp; New Chat
                    </IconButton>
                    <Box sx={{ marginTop: "25px" }}>
                        <span style={{ color: themeMode === "dark" ? "#6fa8dd" : "gray" }}>
                            Recent Chat
                        </span>
                        <IconButton
                            color="primary"
                            style={{
                                backgroundColor: themeMode === "dark" ? "#13416a" : "#2a2b35",
                                color: themeMode === "dark" ? "#fff" : "#fff",
                                padding: "11px",
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
                        >
                            <ChatBubbleIcon />
                            &nbsp; Chat 1
                        </IconButton>
                    </Box>
                </div>
            </Drawer>
            <Box
                style={{
                    ...styles.content,
                    marginLeft: contentMargin,
                    backgroundColor: themeMode === "dark" ? "#063762" : "#fff",
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
                        background: themeMode === "dark" ? "#0d416f" : "#2a2b35",
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
                                <SearchHistoryItem key={index} query={entry.query} response={entry.response} errorMsg={errorMsg} isError={isError} />
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
                                                themeMode === "dark" ? "#063762" : "#fff",
                                            color: themeMode === "dark" ? "#fff" : "#2a2b35",
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
                                    placeholder="What time is Shabbat in Jerusalem on next Friday?"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        marginBottom: "1rem",
                                        backgroundColor: themeMode === "dark" ? "#063762" : "#fff",
                                        color: themeMode === "dark" ? "#fff" : "#2a2b35",
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
