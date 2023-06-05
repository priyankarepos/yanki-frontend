import React from "react";
import LightSearchIcon from "../Assets/images/Icon-search-light.svg";
import DarkSearchIcon from "../Assets/images/Icon-search-dark.svg";

const SearchForm = ({
  theme,
  searchQuery,
  setSearchQuery,
  handleFormSubmit,
  resetStyles,
}) => {
  return (
    <form className="query-form" onSubmit={handleFormSubmit}>
      <div className="input-field">
        <img
          src={theme === "light" ? LightSearchIcon : DarkSearchIcon}
          height={22}
          alt="search icon"
        />

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
      <p className="tagline">
        A smart chatbot that provides responses exclusively from endorsed
        orthodox Jewish sources.
      </p>
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
