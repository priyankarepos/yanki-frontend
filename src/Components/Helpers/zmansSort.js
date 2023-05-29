import zmanNames from "./zmanNames";

export const zmansSort = Zmans => {
  return Zmans.map(([zman, time]) => {
    if (typeof time === "string" && zman in zmanNames) {
      return [zmanNames[zman], String(time).slice(11, -4)];
    } else {
      return undefined;
    }
  })
    .filter(Boolean)
    .sort((a, b) => a[1].localeCompare(b[1]));
};
