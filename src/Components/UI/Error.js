import React from "react";

const Error = ({ error }) => {
  if (!error) {
    return <></>;
  }

  return (
    <section className="error-section">
      <p>{error}</p>
    </section>
  );
};

export default Error;
