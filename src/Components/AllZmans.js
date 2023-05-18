import React from "react";
// Importing Loader component for loading
import Loader from "./Loader";
// Importing SingleZman component for iterating all zmans
import SingleZman from "./SingleZman";

// Destructuring all props to access directly
const AllZmans = ({ isLoading, answer, theme }) => {
  return (
    <section className="allZmans">
      {/* Rendering loading and Zmans as per loading flag */}
      {isLoading ? (
        <Loader theme={theme} />
      ) : answer.ErrMsg === null ? (
        <>
          <p className="title">
            {/* Using semantic em tag for city and date */}
            All Zmans for <em>{answer.Place.City}</em> on{" "}
            <em>{answer.Time.DateCivilLong}</em>
          </p>
          {/* Rendering single zman components with necessary prop. */}
          <SingleZman zmans={answer.Zman} />
        </>
      ) : (
        // Displaying error message
        <p>{answer.ErrMsg}</p>
      )}
    </section>
  );
};

export default AllZmans;
