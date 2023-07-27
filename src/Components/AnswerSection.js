import React, { useState } from "react";
import Lottie from "lottie-react";
import candles from "../Assets/images/candles.json";
import List from "./UI/List";

// Destructuring all the needful props
const AnswerSection = ({ zmanAnswer, isFormSubmitted }) => {
  // State for displaying candle
  const [showCandle, setShowCandle] = useState(true);

  // Handling toggle for displaying candle
  const toggleCandle = () => {
    setShowCandle(prev => !prev);
  };

  // Render if form is submitted and has the response with zman
  if (isFormSubmitted && zmanAnswer) {
    if (!zmanAnswer.data.isAllPrayer) {
      return (
        <section className="answer-section" onClick={toggleCandle}>
          {/* Lottie component for displaying candle */}
          {zmanAnswer.data.isShabbat && (
            <Lottie
              animationData={candles}
              className={`candle ${showCandle}`}
            />
          )}
          {/* Final response with zman time in sentence format */}
          <p>{zmanAnswer.data.response}</p>
        </section>
      );
    }
    return <List allZmans={Object.entries(zmanAnswer.data.response)} />;
  }
};

export default AnswerSection;
