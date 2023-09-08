import React from "react";
import LightSearchIcon from "../Assets/images/Icon-search-light.svg";
import DarkSearchIcon from "../Assets/images/Icon-search-dark.svg";

// Destructuring only needful props
const SearchForm = ({
  theme,
  searchQuery,
  setSearchQuery,
  handleFormSubmit,
  resetStyles,
}) => {
  return (
    // Search form
    <form className="query-form" onSubmit={handleFormSubmit}>
      <div className="input-field">
        {/* Search icon */}
        <img
          src={theme === "light" ? LightSearchIcon : DarkSearchIcon}
          height={22}
          alt="search icon"
        />

        {/* Main input */}
        <input
          type="text"
          placeholder="What time is Shabbat in Jerusalem on next friday?"
          name="searchQuery"
          className="searchQuery"
          autoFocus
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          required
        />
      </div>
      {/* Tagline */}
      <p className="tagline">
        A smart chatbot that provides responses exclusively from endorsed
        orthodox Jewish sources.
      </p>
      {/* Control buttons based on input */}
      {searchQuery && (
        <div className="control-buttons">
          <button type="submit">Submit</button>
          <button className="reset" onClick={resetStyles}>
            Reset
          </button>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
