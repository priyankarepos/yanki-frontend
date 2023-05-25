// Single Zman component
import React from "react";

const SingleZman = ({ zmans }) => {
  // Converting json object to array of key value pairs
  let Zmans = Object.entries(zmans);
  let zmanNames = {
    Candles: "Candle Lighting",
    Dawn72: "Dawn",
    YakirDefault: "Earliest talis & tefillin",
    SunriseDefault: "Sunrise",
    ShemaMA72: "Latest shema Magen Avraham",
    ShemaGra: "Latest shema Gra & Baal HaTanya",
    ShachrisGra: "Latest shachris Gra & Baal HaTanya",
    Midday: "Midday",
    MinchaGra: "Earliest mincha",
    PlagGra: "Plag hamincha",
    SunsetDefault: "Sunset",
    NightShabbos: "Nightfall - 3 stars emerge",
    Night72fix: "Nightfall - 72 minutes",
    TomorrowNightShabbos: "Shabbat ends",
  };
  Zmans = Zmans.map(([zman, time]) => {
    if (typeof time === "string" && zman in zmanNames) {
      return [zmanNames[zman], String(time).slice(11, -4)];
    } else {
      return undefined;
    }
  })
    .filter(Boolean)
    .sort((a, b) => a[1].localeCompare(b[1]));

  return (
    <section className="singleZman">
      {/* Using js higher order function map to iterate over array of key value paris */}
      {Zmans.map(
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
