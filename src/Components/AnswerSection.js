import React, { useState } from "react";
import Lottie from "lottie-react";
import LightLoadingSVG from "../Assets/images/loading-light.svg";
import DarkLoadingSVG from "../Assets/images/loading-dark.svg";
import candles from "../Assets/images/candles.json";

// Destructuring all the needful props
const AnswerSection = ({
  isLoading,
  error,
  zmanAnswer,
  theme,
  isFormSubmitted,
}) => {
  // State for displaying candle
  const [showCandle, setShowCandle] = useState(true);

  // Handling toggle for displaying candle
  const toggleCandle = () => {
    setShowCandle(prev => !prev);
  };

  // Rendering Loading svg
  if (isLoading) {
    return (
      <img
        className="loading"
        src={theme === "light" ? LightLoadingSVG : DarkLoadingSVG}
        alt="Loading svg"
      />
    );
  }

  // Render if there is error
  if (error) {
    return (
      <section className="answer-section">
        {error.code === "ERR_BAD_RESPONSE" ? (
          <p>
            Sorry, we are unable to process at this moment due to heavy traffic.
            Wait a little bit and reload.
          </p>
        ) : (
          <p>
            As an AI, I don't have the capability to answer that. My responses
            are based on the information and knowledge provided. Try asking me
            in a different way or contact the team to suggest more features.
          </p>
        )}
      </section>
    );
  }

  // Render if form is submitted and has the response with zman
  if (isFormSubmitted && zmanAnswer) {
    return (
      <section className="answer-section" onClick={toggleCandle}>
        {/* Lottie component for displaying candle */}
        <Lottie animationData={candles} className={`candle ${showCandle}`} />
        {/* Final response with zman time in sentence format */}
        <p>{zmanAnswer.response}</p>
      </section>
    );
  }
};

export default AnswerSection;
