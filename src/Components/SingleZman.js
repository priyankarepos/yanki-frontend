// Single Zman component
import React from "react";
import { zmansSort } from "./Helpers/zmansSort";

const SingleZman = ({ zmans }) => {
  // Converting json object to array of key value pairs
  zmans = zmansSort(Object.entries(zmans));
  return (
    <section className="singleZman">
      {/* Using js higher order function map to iterate over array of key value paris */}
      {zmans.map(
        ([zman, time]) =>
          time !== "00:00" && (
            <div key={zman} className="zman">
              <p key={zman} className="ZmanName">
                {zman}
              </p>
              <p key={time}>{time}</p>
            </div>
          )
      )}
    </section>
  );
};

export default SingleZman;
