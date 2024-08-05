import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar } from '@mui/material';
import axios from 'axios';
import shareChatIcon1 from "../../Assets/images/share-chat1.svg";
import shareChatIcon2 from "../../Assets/images/share-chat2.svg";
import shareChatIcon3 from "../../Assets/images/share-chat3.svg";
import shareChatIcon4 from "../../Assets/images/share-chat4.svg";
import shareChatIcon5 from "../../Assets/images/share-chat5.svg";
import "./ShareChatLink.scss";
import { apiUrls, classNames, messages } from '../../Utils/stringConstant/stringConstant';

const ShareLinkModal = ({ open, onClose, selectedChatId }) => {
    const [chatLink, setChatLink] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [linkGenerated, setLinkGenerated] = useState(false);

    useEffect(() => {
        if (selectedChatId) {
            setLinkGenerated(false);
            setChatLink('');
        }
    }, [selectedChatId]);

    const handleCreateLink = async () => {
        try {
            const response = await axios.post(
                apiUrls.generateShareChatIdApiUrl(selectedChatId) 
            );

            if (response.status === 200 && response.data.isSuccess) {
                const generatedShareChatId = response.data.generatedShareChatId;
                const newChatLink = `${apiUrls.chatLinkBaseUrl}${generatedShareChatId}`;
                setChatLink(newChatLink);
                setLinkGenerated(true);
                await navigator.clipboard.writeText(newChatLink);
                setSnackbarMessage(messages.copyToClipboard);
            } else {
                setSnackbarMessage(messages.failedToGenerateShareChatId);
            }
        } catch (error) {
            setSnackbarMessage(messages.errorMessagePrefix + error.message);
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(chatLink);
            setSnackbarMessage(messages.copyToClipboard);
        } catch (error) {
            setSnackbarMessage(messages.errorMessagePrefix + error.message);
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleShareWhatsApp = () => {
        window.open(`${apiUrls.whatsappShareUrl}${encodeURIComponent(chatLink)}`);
    };

    const handleShareTwitter = () => {
        window.open(`${apiUrls.twitterShareUrl}${encodeURIComponent(chatLink)}`);
    };

    const handleShareMessage = () => {
        window.open(`${apiUrls.smsShareUrl}${encodeURIComponent(chatLink)}`);
    };

    const handleShareInstagram = () => {
        window.open(`${apiUrls.instagramShareUrl}${encodeURIComponent(chatLink)}`);
    };

    const handleShareMessenger = () => {
        const appId = messages.messengerAppIdPlaceholder;
        const messengerUrl = apiUrls.messengerShareUrl(chatLink, appId);
        window.open(messengerUrl);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby={`${classNames.shareChatLinkModel}`}>
            <Box className={classNames.shareLinkModal}
                sx={{bgcolor: `${classNames.backgroundPaper}`,}}
            >
                <Box mb={2}>
                    <Typography className={classNames.sharedChatMsgTitle}>
                        {messages.shareLinkModalTitle}
                    </Typography>
                    <Typography className={classNames.sharedChatMsgTxt}>
                        {!linkGenerated ? messages.sharedChatMsg1 : messages.sharedChatMsg2}
                    </Typography>
                </Box>
                {linkGenerated && <Box className={classNames.sharedChatLinkIcons} mt={2}>
                    <Button onClick={handleShareMessage}><img src={shareChatIcon1} alt={messages.shareLinkIconAlt} /></Button>
                    <Button onClick={handleShareWhatsApp}><img src={shareChatIcon2} alt={messages.shareLinkIconAlt} /></Button>
                    <Button onClick={handleShareInstagram}><img src={shareChatIcon3} alt={messages.shareLinkIconAlt} /></Button>
                    <Button onClick={handleShareTwitter}><img src={shareChatIcon4} alt={messages.shareLinkIconAlt} /></Button>
                    <Button onClick={handleShareMessenger}><img src={shareChatIcon5} alt={messages.shareLinkIconAlt} /></Button>
                </Box>}
                <Box className={classNames.sharedChatLinkInputBox}>
                    <TextField
                        fullWidth
                        value={chatLink}
                        placeholder={messages.shareLinkPlaceholder}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant={messages.outlined}
                        margin={messages.normal}
                        className={classNames.sharedChatInput}
                    />
                    {linkGenerated ? (
                        <Button
                            variant={messages.buttonContainedVarient}
                            color={messages.primaryColor}
                            onClick={handleCopyLink}
                            className={classNames?.sharedChatButton}
                        >
                            {messages.copyLinkButtonText}
                        </Button>
                    ) : (
                        <Button
                            variant={messages.buttonContainedVarient}
                            color={messages.primaryColor}
                            onClick={handleCreateLink}
                            className={classNames?.sharedChatButton}
                        >
                            {messages.createLinkButtonText}
                        </Button>
                    )}
                </Box>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={2000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                />
            </Box>
        </Modal>
    );
};

export default ShareLinkModal;