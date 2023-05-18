// Main home page component
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
import AllZmans from "./AllZmans";
// Custom hook
import { useFormSubmit } from "../Hooks/useFormSubmit";

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
  const { isLoading, error, submitForm } = useFormSubmit();

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
    <div className={`home ${theme} ${formSubmitted} ${answer.ErrMsg}`}>
      <button className="toggle" onClick={toggleTheme}>
        {/* Thematically rendering toggle theme icon */}
        {theme === "light" ? (
          <LightModeOutlinedIcon />
        ) : (
          <DarkModeOutlinedIcon />
        )}
      </button>
      <main>
        {/* Rendering logo component and passing necessary props */}
        <Logo
          theme={theme}
          logoContainerStyle={logoContainerStyles}
          logoStyles={logoStyles}
        />
        {/* Search bar form not separated due many dependencies */}
        <form className="query-form" onSubmit={handleFormSubmit}>
          <div className="input-field">
            {/* Thematically rendering search icon */}
            {theme === "light" ? (
              <img
                src={LightSearchIcon}
                height={22}
                alt="search icon"
                className="search-icon"
              />
            ) : (
              <img
                src={DarkSearchIcon}
                height={22}
                alt="search icon"
                className="search-icon"
              />
            )}
            {/* Search bar input */}
            <input
              type="text"
              placeholder="What is shabbat time in Jerusalem on this friday?"
              name="searchQuery"
              className="searchQuery"
              autoFocus
              required
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Rendering control button on changing input */}
          {searchQuery && (
            <div className="control-buttons">
              <button type="submit">Submit</button>
              <button className="reset" onClick={resetStyles}>
                Reset
              </button>
            </div>
          )}
        </form>
        {/* Rendering allZman as soon as search form is submitted */}
        {formSubmitted && (
          <AllZmans
            isLoading={isLoading}
            error={error}
            answer={answer}
            theme={theme}
          />
        )}
      </main>
    </div>
  );
};

export default Homepage;
