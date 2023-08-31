import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { useState } from "react";
import Lottie from "lottie-react";
import candles from "../Assets/images/candles.json";

const SentenceAnswer = ({ answer }) => {
  console.log("answer: ", answer);
  const [showCandle, setShowCandle] = useState(true);

  const toggleCandle = () => {
    setShowCandle((prev) => !prev);
  };

  return (
    <>
      <Box onClick={toggleCandle}>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            cursor: "pointer",
          }}
        >
          {answer.isShabbat && showCandle && (
            <Lottie
              animationData={candles}
              style={{ width: "10rem", height: "10rem" }}
              // className={`candle ${showCandle}`}
            />
          )}
          <Typography variant="h6" component="div">
            {answer.response}
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default SentenceAnswer;
