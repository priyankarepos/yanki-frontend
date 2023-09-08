import React from "react";
import { zmanName } from "../Helpers/Helper";
const List = ({ allZmans }) => {
  if (!allZmans[11][1]) {
    allZmans = allZmans.filter(([zman, time]) => {
      return zman !== "CandleLighting";
    });
  }
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
            <tr key={zman} className={zman}>
              <td key={zman}>{zmanName[zman]}</td>
              <td key={time}>{String(time).slice(11, -3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default List;
