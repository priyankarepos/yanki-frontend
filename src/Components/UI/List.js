import React from "react";
import { zmanName } from "../Helpers/Helper";
const List = ({ allZmans }) => {
  return (
    <section className="answer-section list">
      <p>
        <b>
          City: {allZmans[0][1]} & Date: {allZmans[1][1].slice(0, 10)}
        </b>
      </p>
      <table>
        <tbody>
          {allZmans.slice(1).map(([zman, time]) => (
            <tr key={zman}>
              <td key={zman} className="ZmanName">
                {zmanName[zman]}
              </td>
              {zman === "City" ? (
                <td key={time}>{String(time)}</td>
              ) : (
                <td key={time}>{String(time).slice(11, -3)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default List;
