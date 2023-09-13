import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { useEffect, useState } from "react";
// import Lottie from "lottie-react";
// import candles from "../Assets/images/candles.json";

const SentenceAnswer = ({ answer }) => {
  // const [showCandle, setShowCandle] = useState(true);
  const [processedContentResponse, setProcessedContentResponse] = useState([]);

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

          {processedContentResponse.map((ans, index) => (
            <Typography variant="h6" component="div" key={index}>
              {ans}
            </Typography>
          ))}
        </Paper>
      </Box>
    </>
  );
};

export default SentenceAnswer;
