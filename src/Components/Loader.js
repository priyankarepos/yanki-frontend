// Loader component
import React from "react";
// Loading svg for light theme
import LightLoadingSVG from "../Assets/images/loading-light.svg";
// Loading svg for dark theme
import DarkLoadingSVG from "../Assets/images/loading-dark.svg";

// Destructuring theme prop
const Loader = ({ theme }) => {
  // Conditionally rendering loading image
  return (
    <img
      className="loading"
      src={theme === "light" ? LightLoadingSVG : DarkLoadingSVG}
      alt="Loading svg"
    />
  );
};

export default Loader;
