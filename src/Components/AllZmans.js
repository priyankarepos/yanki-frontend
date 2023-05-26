import React from "react";
// Importing Loader component for loading
import Loader from "./Loader";
// Importing SingleZman component for iterating all zmans
import SingleZman from "./SingleZman";

// Destructuring all props to access directly
const AllZmans = ({ isLoading, answer, theme, error }) => {
  if (isLoading) {
    return <Loader theme={theme} />;
  }
  if (error) {
    return (
      <section className="allZmans">
        <p>Inappropriate input, try again</p>
        {/* <p>{error.response.data}</p> */}
      </section>
    );
  }

  return (
    <section className="allZmans">
      {/* Rendering loading and Zmans as per loading flag */}
      {answer.ErrMsg === null ? (
        <>
          <p className="title">
            {/* Using semantic em tag for city and date */}
            All Zmans for <em>{answer.Place.City}</em> on{" "}
            <em>{answer.Time.DateCivilLong}</em>
          </p>
          {answer.Time.Weekday === "Friday" && (
            <div className="special">
              <p>Candle Lighting: {answer.Zman.Candles.slice(11, -4)}</p>
              <p>
                Shabbat end: {answer.Zman.TomorrowNightShabbos.slice(11, -4)}
              </p>
            </div>
          )}

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
