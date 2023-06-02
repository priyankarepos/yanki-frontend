import React from "react";
import myZmanimLight from "../../Assets/images/myZmanim-light.png";
import myZmanimDark from "../../Assets/images/myZmanim-dark.png";

const Footer = ({ theme }) => {
  const recipientEmail = "example@example.com";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

  return (
    <footer>
      <div className="myZmanim">
        <p>In partnership with</p>
        <img
          src={theme === "light" ? myZmanimLight : myZmanimDark}
          alt="MyZmanim"
        />
      </div>
      <div className="contactUs">
        <p>Submit your platform or content for revision,</p>
        <p>
          Contact us:
          <a
            href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
            target="_blank"
            rel="noreferrer"
          >
            hello@yanki.ai
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
