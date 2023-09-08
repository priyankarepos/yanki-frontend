// Main home page component
import React, { useEffect, useState } from "react";
// Custom hook
import { useFormSubmit } from "../Hooks/useFormSubmit";
// ThemeToggle component
import ThemeToggle from "./UI/ThemeToggle";
// Importing Logo component
import Logo from "./UI/Logo";
// Search Form component
import SearchForm from "./SearchForm";
// Loader Component
import DarkLoader from "./UI/Loader/DarkLoader";
import LightLoader from "./UI/Loader/LightLoader";
// Answer Section component
import AnswerSection from "./AnswerSection";
// Error Component
import Error from "./UI/Error";
// Footer component
import Footer from "./UI/Footer";

const Homepage = () => {
  // All the states for interactivity
  const [theme, setTheme] = useState("dark"); // State for theme toggle
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar input
  const [isFormSubmitted, setFormSubmitted] = useState(false); // Bool state for checking if form is submitted
  const [zmanAnswer, setZmanAnswer] = useState(""); // State for Answer section
  const [fetchError, setFetchError] = useState(""); // State for error handling
  const [bgHeight, setBgHeight] = useState("");

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
    setZmanAnswer(""); // Resetting Answer state
    setFetchError(""); // Resetting error state
  };

  // Function for handling form submission using custom hook
  const handleFormSubmit = async e => {
    setZmanAnswer("");
    setFetchError("");
    setFormSubmitted(true); // Setting form submit flag
    e.preventDefault(); // Preventing from reloading page
    const response = await submitForm(searchQuery);
    // Access the response data here
    setZmanAnswer(response); // Set the answer state
  };

  useEffect(() => {
    setFetchError(error);
  }, [error]);

  useEffect(() => {
    zmanAnswer
      ? zmanAnswer.data.isAllPrayer
        ? setBgHeight("allPrayer")
        : setBgHeight("singlePrayer")
      : fetchError
      ? setBgHeight("error")
      : setBgHeight("");
  }, [zmanAnswer, bgHeight, fetchError]);

  return (
    <div className={`home ${theme} ${bgHeight}`}>
      {/* Theme toggler */}
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <main>
        {/* Logo component */}
        <Logo theme={theme} fetchError={fetchError} answer={zmanAnswer} />
        {/* Search form component */}
        <SearchForm
          theme={theme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleFormSubmit={handleFormSubmit}
          resetStyles={resetStyles}
        />

        {/* Rendering Loading svg */}
        {isLoading && (theme === "light" ? <LightLoader /> : <DarkLoader />)}
        {/* Answer section component */}
        <AnswerSection
          isLoading={isLoading}
          error={fetchError}
          zmanAnswer={zmanAnswer}
          theme={theme}
          isFormSubmitted={isFormSubmitted}
        />

        {/* Render if there is error */}
        <Error error={fetchError} />
      </main>
      {/* Footer component */}
      <Footer theme={theme} />
    </div>
  );
};

export default Homepage;
