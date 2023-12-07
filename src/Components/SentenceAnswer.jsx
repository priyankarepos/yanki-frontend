import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
// import Lottie from "lottie-react";
// import candles from "../Assets/images/candles.json";
import TextField from "@mui/material/TextField";
import axios from 'axios';

const SentenceAnswer = ({ answer }) => {
  console.log("answer", answer);
  // const [showCandle, setShowCandle] = useState(true);
  const [processedContentResponse, setProcessedContentResponse] = useState([]);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [apiResponseMessage, setApiResponseMessage] = useState("");
  const [apiContentResponseMessage, setContentApiResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingButtonIndex, setLoadingButtonIndex] = useState(null);


  // const toggleCandle = () => {
  //   setShowCandle((prev) => !prev);
  // };

  useEffect(() => {
    try {
      if (answer?.contentResponse) {
        const answerArray = answer.contentResponse.split("\n");
        setProcessedContentResponse(answerArray);
      }
    } catch (e) { }
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

      console.log("API Response:", response.data);
      setApiResponseMessage(response.data.message);
      setContentApiResponseMessage(response.data.contentResponse)

      setAdditionalMessage("");
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoadingButtonIndex(null);
      setLoading(false);
    }
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

          <Typography variant="h6" component="div" style={{ fontSize: "16px" }}>
            {answer?.message}
          </Typography>

          {processedContentResponse.map((ans, index) => (
            <Typography variant="h6" component="div" key={index} style={{ fontSize: "16px", }}>
              {ans}
            </Typography>
          ))}
          {(answer?.userType || apiResponseMessage) && (
            <Box>
              <TextField
                label="Additional Message"
                variant="outlined"
                fullWidth
                margin="normal"
                value={additionalMessage}
                onChange={handleTextFieldChange}
                disabled={loading || Boolean(apiResponseMessage)}
              />
              {answer.userType.map((type, index) => (
                <Button
                  key={index}
                  variant="contained"
                  color="primary"
                  onClick={() => handleUserTypeButtonClick(type, index)}
                  style={{ marginRight: "8px" }}
                  disabled={loading || loadingButtonIndex === index || Boolean(apiResponseMessage)}
                >
                  {loading && loadingButtonIndex === index ? (
                    <CircularProgress size={24} style={{ color: "#fff" }} />
                  ) : (
                    type
                  )}
                </Button>
              ))}
              {apiResponseMessage && (
                <Typography
                  variant="body1"
                  component="div"
                  style={{ marginTop: "8px", }}
                >
                  {!apiResponseMessage && loading ? (
                    <CircularProgress size={24} style={{ color: "#fff" }} />
                  ) : (
                    apiResponseMessage
                  )}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
        {apiContentResponseMessage && <Paper sx={{
          p: 2,
        }}>
          <Typography
            variant="body1"
            component="div"
            style={{ marginTop: "8px", }}
          >{apiContentResponseMessage}</Typography>
        </Paper>}
      </Box>
    </>
  );
};

export default SentenceAnswer;
