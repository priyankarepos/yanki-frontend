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
import { useTranslation } from "react-i18next";

const ShareLinkModal = ({ open, onClose, selectedChatId }) => {
    const { t } = useTranslation();
    const [chatLink, setChatLink] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [linkGenerated, setLinkGenerated] = useState(false);
    const [buttonText, setButtonText] = useState(t('createLink'));

    useEffect(() => {
        if (selectedChatId) {
            resetState();
        }
    }, [selectedChatId]);

    const resetState = () => {
        setLinkGenerated(false);
        setChatLink('');
        setButtonText(t('createLink'));
        setSnackbarMessage('');
        setSnackbarOpen(false);
    };

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
                await navigator.clipboard.writeText(chatLink);
                setSnackbarOpen(false);
                setButtonText(t('copiedToClipboard'));
                setTimeout(() => {
                    setButtonText(t('copyLink'));
                }, 2000);
            } else {
                setSnackbarMessage(messages.failedToGenerateShareChatId);
            }
        } catch (error) {
            setSnackbarMessage(messages.errorMessagePrefix + error.message);
            setSnackbarOpen(true);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(chatLink);

            setButtonText(t('copiedToClipboard'));
            setTimeout(() => {
                setButtonText(t('copyLink'));
            }, 2000);
        } catch (error) {
            setSnackbarMessage(messages.errorMessagePrefix + error.message);
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
                sx={{ bgcolor: `${classNames.backgroundPaper}`, }}
            >
                <Box mb={2}>
                    <Typography className={classNames.sharedChatMsgTitle}>
                        {t('sharePublicLinkToChat')}
                    </Typography>
                    <Typography className={classNames.sharedChatMsgTxt}>
                        {linkGenerated ? t('publicLinkCreated') : t('yourNameAndMessagesStayPrivate')}
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
                    <Button
                        variant={messages.buttonContainedVariant}
                        color={messages.primaryColor}
                        onClick={linkGenerated ? handleCopyLink : handleCreateLink}
                        className={classNames.sharedChatButton}
                    >
                        {buttonText}
                    </Button>
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