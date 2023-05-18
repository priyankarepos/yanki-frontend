// Single Zman component
import React from "react";

const SingleZman = ({ zmans }) => {
  // Converting json object to array of key value pairs
  const Zmans = Object.entries(zmans);

  return (
    <section className="singleZman">
      {/* Using js higher order function map to iterate over array of key value paris */}
      {Zmans.map(([zman, time]) =>
        typeof time === "string" ? (
          <div key={zman} className="zman">
            <p key={zman} className="ZmanName">
              {zman}
            </p>
            <p key={time}>{String(time).slice(11, -4)}</p>
          </div>
        ) : null
      )}
    </section>
  );
};

export default SingleZman;
