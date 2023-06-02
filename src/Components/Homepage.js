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
// Answer Section component
import AnswerSection from "./AnswerSection";
// Footer component
import Footer from "./UI/Footer";

const Homepage = () => {
  // All the states for interactivity
  const [theme, setTheme] = useState("light"); // State for theme toggle
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar input
  const [isFormSubmitted, setFormSubmitted] = useState(false); // Bool state for checking if form is submitted
  const [zmanAnswer, setZmanAnswer] = useState(""); // State for Answer section
  const [fetchError, setFetchError] = useState(null); // State for error handling

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
    setFormSubmitted(true); // Setting form submit flag
    e.preventDefault(); // Preventing from reloading page
    const response = await submitForm(searchQuery);
    // Access the response data here
    setZmanAnswer(response); // Set the answer state
  };

  useEffect(() => {
    setFetchError(error);
  }, [error]);

  return (
    <div className={`home ${theme}`}>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <main>
        {/* Rendering logo component and passing necessary props */}
        <Logo theme={theme} searchQuery={searchQuery} answer={zmanAnswer} />
        {/* Search bar form not separated due many dependencies */}
        <SearchForm
          theme={theme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleFormSubmit={handleFormSubmit}
          resetStyles={resetStyles}
        />
        <AnswerSection
          isLoading={isLoading}
          error={fetchError}
          zmanAnswer={zmanAnswer}
          theme={theme}
          isFormSubmitted={isFormSubmitted}
        />
      </main>
      <Footer theme={theme} />
    </div>
  );
};

export default Homepage;
