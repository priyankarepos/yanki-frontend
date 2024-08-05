import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import SearchHistoryItem from '../SearchHistoryItem';
import "./ShareChatLink.scss";
import { messages, apiUrls, classNames } from '../../Utils/stringConstant/stringConstant';

const SharedChat = () => {
    const { sharedChatId } = useParams();
    const [chatContent, setChatContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [clickableOff, setClickableOff] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatContent = async () => {
            try {
                const response = await axios.get(apiUrls.sharedChatApiUrl(sharedChatId));

                if (response.status === 200) {
                    setChatContent(response.data);
                    setClickableOff(true);
                } else {
                    setChatContent(messages.fetchErrorMessage);
                    setClickableOff(true);
                }
            } catch (error) {
                setChatContent(messages.errorMessagePrefix + error.message);
            } finally {
                setLoading(false);
                setClickableOff(true);
            }
        };

        fetchChatContent();
    }, [sharedChatId]);

    const handleGetStartedClick = () => {
        navigate('/');
    };

    return (
        <Paper elevation={3} className={classNames.sharedChatContainer}>
            <Box sx={{ p: 3 }} className={classNames.sharedChatPaper}>
                <Box className={classNames.sharedChatHeader}>
                    <Typography className={classNames.sharedChatTitle}>
                        {messages.sharedChatTitle}
                    </Typography>
                </Box>
                {loading ? (
                    <Box className={classNames.sharedChatLoader}>
                        <CircularProgress />
                    </Box>
                ) : (
                    chatContent && Array.isArray(chatContent.chatHistory) && chatContent.chatHistory.length > 0 ? (
                        chatContent.chatHistory.map((item) => (
                            <SearchHistoryItem
                                key={item.id}
                                response={item.gptResponse}
                                query={item.userQuery}
                                clickableOff={clickableOff}
                                setClickableOff={setClickableOff}
                            />
                        ))
                    ) : (
                        <Typography>{messages.noChatHistoryMessage}</Typography>
                    )
                )}
            </Box>
            <Paper className={classNames.sharedChatFooter}>
                <Button variant={messages.buttonContainedVarient} color={messages.primaryColor} onClick={handleGetStartedClick}>
                    {messages.getStartedButtonText}
                </Button>
            </Paper>
        </Paper>
    );
};

export default SharedChat;