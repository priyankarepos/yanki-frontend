import React from "react";
import myZmanimLight from "../../Assets/images/myZmanim-light.png";
import myZmainmDark from "../../Assets/images/myZmanim-dark.png";

const Footer = ({ theme }) => {
  return (
    <footer>
      <p>Partnership with</p>
      <img
        src={theme === "light" ? myZmanimLight : myZmainmDark}
        alt="MyZmanim"
      />
    </footer>
  );
};

export default Footer;
