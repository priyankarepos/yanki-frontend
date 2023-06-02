// Logo component
import React from "react";
import LightYankilogo from "../../Assets/images/logo-light.svg"; // SVG Logo for light theme
import DarkYankilogo from "../../Assets/images/logo-dark.svg"; // SVG Logo for dark theme

// Destructuring props to access directly
const Logo = ({ theme, searchQuery, answer }) => {
  // CSS in Js for event specific styles
  // Style for Logo based on search bar is empty or not
  const logoStyles = {
    width: answer ? "" : "15em",
  };

  // Style for Logo position based on Answer section is present or not
  const logoContainerStyle = {
    alignSelf: answer ? "flex-start" : "center",
  };

  return (
    <div className="logoContainer" style={logoContainerStyle}>
      {/* Rendering logo conditionally */}
      <img
        src={theme === "light" ? LightYankilogo : DarkYankilogo}
        style={logoStyles}
        className="logo"
        alt="Yanki logo"
      />
    </div>
  );
};

export default Logo;
