import React from "react";
import Lightlogo from "../Assets/images/logo-light.svg";
import Darklogo from "../Assets/images/logo-dark.svg";

const Logo = ({ theme, logoContainerStyle, logoStyles }) => {
  return (
    <div className="logoContainer" style={logoContainerStyle}>
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
