import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Button, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "./AnswerStyle.scss";
import Markdown from "react-markdown";

const SentenceAnswer = ({ answer }) => {
  // const [showCandle, setShowCandle] = useState(true);
  const [processedContentResponse, setProcessedContentResponse] = useState([]);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [apiResponseMessage, setApiResponseMessage] = useState("");
  const [apiContentResponseMessage, setContentApiResponseMessage] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [loadingButtonIndex, setLoadingButtonIndex] = useState(null);
  const [direction, setDirection] = useState("ltr");

  React.useEffect(() => {
    const containsHebrew = /[\u0590-\u05FF]/.test(answer.contentResponse);
    const containsEnglish = /[a-zA-Z]/.test(answer.contentResponse);
    let newDirection;

    if (containsEnglish && containsHebrew) {
      newDirection = "ltr";
    } else if (containsHebrew) {
      newDirection = "rtl";
    } else {
      newDirection = "ltr";
    }

    setDirection(newDirection);
  }, [answer.contentResponse]);

  // const toggleCandle = () => {
  //   setShowCandle((prev) => !prev);
  // };

  useEffect(() => {
    try {
      if (answer?.contentResponse) {
        const answerArray = answer.contentResponse.split("\n");
        setProcessedContentResponse(answerArray);
      }
    } catch (e) {}
  }, [answer]);

  const handleTextFieldChange = (event) => {
    setAdditionalMessage(event.target.value);
  };
  const handleUserTypeButtonClick = async (userType, index) => {
    try {
      setLoadingButtonIndex(index);
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/send-mail-to-rabbi`,
        {
          additionalMessage,
          userType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setApiResponseMessage(response.data.message);
      setContentApiResponseMessage(response.data.contentResponse);

      setAdditionalMessage("");
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoadingButtonIndex(null);
      setLoading(false);
    }
  };

  const renderContentResponse = () => {
    return processedContentResponse.map((ans, index) => (
      <Typography
        variant="h6"
        component="div"
        key={index}
        className="sentence-answer-container"
        dir={direction}
      >
        <Markdown>{renderClickableContent(ans)}</Markdown>
      </Typography>
    ));
  };

  const renderClickableContent = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\b\d{10,}\b/g;
    const urlRegex = /\b(?:https?|ftp):\/\/\S+|\bwww\.\S+\.com\b/g;

    let content = "";

    const cleanedText = text.replace(/(^-|^\.)+/gm, (match) =>
      match.replace(/[-.]/g, "")
    );

    cleanedText.split(/\s+/).forEach((word, index, array) => {
      if (word.match(emailRegex)) {
        content += `[${word}](mailto:${word})`;
      } else if (word.match(phoneRegex)) {
        content += `[${word}](tel:${word})`;
      } else if (word.match(urlRegex)) {
        content += `[${word}](${word})`;
      } else {
        content += word;
      }
      if (index !== array.length - 1) {
        content += " ";
      }
    });
    return content;
  };

  return (
    <>
      <Box>
        <Paper
          sx={{
            p: 2,
          }}
        >
          {/* {answer?.isShabbat && showCandle && (
            <Lottie
              animationData={candles}
              style={{ width: "10rem", height: "10rem" }}
              // className={`candle ${showCandle}`}
            />
          )} */}

          <Typography
            variant="h6"
            component="div"
            className="sentence-answer-container"
          >
            {answer?.message}
          </Typography>
          {renderContentResponse()}
          {(answer?.userType || apiResponseMessage) && (
            <Box>
              <TextField
                label="Additional Message"
                variant="outlined"
                fullWidth
                margin="normal"
                value={additionalMessage}
                onChange={handleTextFieldChange}
                disabled={
                  loading ||
                  !answer?.isMail === true ||
                  apiResponseMessage !== ""
                }
              />
              {answer.userType.map((type, index) => (
                <Button
                  key={index}
                  variant="contained"
                  color="primary"
                  onClick={() => handleUserTypeButtonClick(type, index)}
                  className="sentence-answer-button"
                  disabled={
                    loading ||
                    loadingButtonIndex === index ||
                    !answer?.isMail === true ||
                    apiResponseMessage !== ""
                  }
                >
                  {loading && loadingButtonIndex === index ? (
                    <CircularProgress size={24} className="color-white" />
                  ) : (
                    type
                  )}
                </Button>
              ))}
              {apiResponseMessage && (
                <Typography
                  variant="body1"
                  component="div"
                  className="sentence-answer-response"
                >
                  {!apiResponseMessage && loading ? (
                    <CircularProgress size={24} className="color-white" />
                  ) : (
                    apiResponseMessage
                  )}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
        {apiContentResponseMessage && (
          <Paper
            sx={{
              p: 2,
            }}
          >
            <Typography
              variant="body1"
              component="div"
              className="sentence-answer-response"
            >
              {apiContentResponseMessage}
            </Typography>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default SentenceAnswer;
