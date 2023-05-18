// Logo component
import React from "react";
import Lightlogo from "../Assets/images/logo-light.svg"; // SVG Logo for light theme
import Darklogo from "../Assets/images/logo-dark.svg"; // SVG Logo for dark theme

// Destructuring props to access directly
const Logo = ({ theme, logoContainerStyle, logoStyles }) => {
  return (
    <div className="logoContainer" style={logoContainerStyle}>
      {/* Redering logo conditionally */}
      {theme === "light" ? (
        <img
          src={Lightlogo}
          style={logoStyles}
          className="logo"
          alt="Yanki logo"
        />
      ) : (
        <img
          src={Darklogo}
          style={logoStyles}
          className="logo"
          alt="Yanki logo"
        />
      )}
    </div>
  );
};

export default Logo;
