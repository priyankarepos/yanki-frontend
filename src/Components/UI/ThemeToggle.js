import React from "react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const ThemeToggle = ({ theme, toggleTheme }) => {
  // Theme toggle component with conditional rendering
  return (
    <button className="toggle" onClick={toggleTheme}>
      {theme === "light" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
    </button>
  );
};

export default ThemeToggle;
