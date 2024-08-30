import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import shareChatIcon1 from "../../Assets/images/share-chat1.svg";
import shareChatIcon2 from "../../Assets/images/share-chat2.svg";
import EmailIcon from '@mui/icons-material/Email';
import "./ShareChatLink.scss";
import {
  apiUrls,
  classNames,
  messages,
} from "../../Utils/stringConstant/stringConstant";
import { useTranslation } from "react-i18next";

const ShareLinkModal = ({ open, onClose, selectedChatId }) => {
  const { t } = useTranslation();
  const [chatLink, setChatLink] = useState("");
  const [createChatLink, setCreateChatLink] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
    setChatLink("");
    setButtonText(t('createLink'));
    setSnackbarMessage("");
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedLink = localStorage.getItem(messages.generatedChatLink);
      if (storedLink) {
        setButtonText(t('copyLink'));
        setChatLink(storedLink);
        setLinkGenerated(true);
        setCreateChatLink(storedLink);
      } else {
        try {
          const response = await axios.post(
            apiUrls.generateShareChatIdApiUrl(selectedChatId)
          );

          if (response.status === 200 && response.data.isSuccess) {
            const generatedShareChatId = response.data.generatedShareChatId;
            const newChatLink = `${apiUrls.chatLinkBaseUrl}${generatedShareChatId}`;
            setChatLink(newChatLink);
            copyClipboard(newChatLink);
          } else {
            setSnackbarMessage(messages.failedToGenerateShareChatId);
          }
        } catch (error) {
          setSnackbarMessage(messages.errorMessagePrefix + error.message);
          setSnackbarOpen(true);
        }
      }
    };
    fetchData();
  }, []);

  const copyClipboard = (newChatLink) => {
    const clipboard = new ClipboardJS(classNames.shareLinkInputButton, {
      text: () => newChatLink,
      container: document.getElementsByClassName(classNames.shareLinkModal)[0],
    });

    clipboard.on(messages.success, (e) => {      
      setButtonText(t('copiedToClipboard'));
      setTimeout(() => {
        setButtonText(t('copyLink'));
      }, 2000);

      e.clearSelection();
    });

    clipboard.on(messages.error, (e) => {
      setSnackbarMessage(messages.errorMessagePrefix + e.action);
      setSnackbarOpen(true);
    });

    return () => {
      clipboard.destroy();
    };
  }

  const handleCreateLink = async () => {
    setLinkGenerated(true);
    setCreateChatLink(chatLink);
    localStorage.setItem(messages.generatedChatLink, chatLink);
  };

  const handleShareWhatsApp = () => {
    window.open(`${apiUrls.whatsappShareUrl}${encodeURIComponent(chatLink)}`);
  };

  const handleShareMessage = () => {
    window.open(`${apiUrls.smsShareUrl}${encodeURIComponent(chatLink)}`);
  };

  const handleShareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(t('shareSubject'))}&body=${encodeURIComponent(chatLink)}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(createChatLink);
    setButtonText(t('copiedToClipboard'));
    setTimeout(() => {
      setButtonText(t('copyLink'));
    }, 2000);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={`${classNames.shareChatLinkModel}`}
    >
      <Box
        className={classNames.shareLinkModal}
        sx={{ bgcolor: `${classNames.backgroundPaper}` }}
      >
        <Box mb={2}>
          <Typography className={classNames.sharedChatMsgTitle}>
            {t('sharePublicLinkToChat')}
          </Typography>
          <Typography className={classNames.sharedChatMsgTxt}>
            {linkGenerated
              ? t('publicLinkCreated')
              : t('yourNameAndMessagesStayPrivate')}
          </Typography>
        </Box>
        {linkGenerated && (
          <Box className={classNames.sharedChatLinkIcons} mt={2}>
            <Button onClick={handleShareMessage}>
              <img src={shareChatIcon1} alt={messages.shareLinkIconAlt} />
            </Button>
            <Button onClick={handleShareWhatsApp}>
              <img src={shareChatIcon2} alt={messages.shareLinkIconAlt} />
            </Button>
            <Button className="sharechat-mail-icon" onClick={handleShareEmail}>
              <EmailIcon />
            </Button>
          </Box>
        )}
        <Box className={classNames.sharedChatLinkInputBox}>
          <TextField
            fullWidth
            value={createChatLink}
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
            className={classNames.sharedChatButton}
            onClick={linkGenerated ? handleCopyLink :  handleCreateLink}
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
