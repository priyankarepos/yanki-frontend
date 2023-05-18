import React, { useState } from "react";
// Importing Logo component
import Logo from "./Logo";
// Toggle theme sun-light icon from material icons google
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// Toggle theme moon-dark icon from material icons google
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// SVG Search icon for light theme
import LightSearchIcon from "../Assets/images/Icon-search-light.svg";
// SVG Search icon for dark theme
import DarkSearchIcon from "../Assets/images/Icon-search-dark.svg";
// Answer component
import Answer from "./Answer";
// Custom hook
import { useSubmitForm } from "../Hooks/useSubmitForm";

const Homepage = () => {
  // All the states for interactivity
  const [theme, setTheme] = useState("light"); // State for theme toggle
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar input
  const [answer, setAnswer] = useState(""); // State for Answer section
  const [formSubmitted, setFormSubmitted] = useState(false); // Bool state for checking if form is submitted

  // CSS in Js for event specific styles
  // Style for Logo based on search bar is empty or not
  const logoStyles = {
    width: searchQuery ? "" : "15em",
  };

  // Style for Logo position based on Answer section is present or not
  const logoContainerStyles = {
    alignSelf: answer ? "flex-start" : "center",
  };

  // Using custom hook for handling form submission robustly
  const { isLoading, error, submitForm } = useSubmitForm();

  // Function for toggling theme
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light")); // Toggling with setState method of useState hook
  };

  // Function for resetting all the states for resetting interactive styles
  const resetStyles = () => {
    setSearchQuery(""); // Resetting searchbar input
    setFormSubmitted(false); // Resetting flag for form submission
    setAnswer(""); // Resetting Answer state
  };

  // Function for handling form submission using custom hook
  const handleFormSubmit = async e => {
    setFormSubmitted(true); // Setting form submit flag
    e.preventDefault(); // Preventing from reloading page

    let formData = {
      locationId: searchQuery.slice(0, 8),
      inputDate: searchQuery.slice(9),
    };

    try {
      const response = await submitForm(formData);
      // Access the response data here
      setAnswer(response); // Set the answer state
    } catch (error) {
      // handle any errors
      console.log(error);
    }
  };
  return (
    <div className={`home ${theme} ${formSubmitted}`}>
      <button className="toggle" onClick={toggleTheme}>
        {theme === "light" ? (
          <LightModeOutlinedIcon />
        ) : (
          <DarkModeOutlinedIcon />
        )}
      </button>
      <main>
        <Logo
          theme={theme}
          logoContainerStyle={logoContainerStyles}
          logoStyles={logoStyles}
        />
        <form className="query-form" onSubmit={handleFormSubmit}>
          <div className="input-field">
            {theme === "light" ? (
              <img src={LightSearchIcon} height={22} alt="search icon" />
            ) : (
              <img src={DarkSearchIcon} height={22} alt="search icon" />
            )}
            <input
              type="text"
              placeholder="What is shabbat time in Jerusalem on this friday?"
              name="searchQuery"
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <div className="control-buttons">
              <button type="submit">Submit</button>
              <button className="reset" onClick={resetStyles}>
                Reset
              </button>
            </div>
          )}
        </form>
        
      </main>
    </div>
  );
};

export default Homepage;
