import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import "./Style.scss";
import { Link as RouterLink } from "react-router-dom";

const PrivacyPolicy = () => {
  const { activeTab } = React.useContext(Context);

  const navigate = useNavigate();

  const onGoToHome = () => {
    navigate("/", { replace: true });
  };

  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

  return (
    <>
      <Container maxWidth="xl" className="privacy-policy">
        <Box
          className="flex justify-center items-center min-h-screen"
          sx={{ padding: 2 }}
        >
          <Box
            className="policy-container"
            sx={{
              width: { xs: "100%", sm: "80%" },
            }}
          >
            <Box className="w-full object-contain flex items-center justify-center page-container">
              <RouterLink
                to="/auth"
                className="w-full object-contain flex items-center justify-center"
              >
                <img
                  src={
                    activeTab === 0
                      ? "/auth-logo-dark.svg"
                      : "/auth-logo-light.svg"
                  }
                  alt="logo"
                  className="page-image"
                />
              </RouterLink>
            </Box>
            <Typography
              variant="h4"
              component="div"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              YankiAI General Private Policy
            </Typography>
            <Typography className="page-text">
              We at YankiAI (together with our affiliates, “YankiAI”, “we”,
              “our” or “us”) respect your privacy and are strongly committed to
              keeping secure any information we obtain from you or about you.
              This Privacy Policy describes our practices with respect to
              Personal Information we collect from or about you when you use our
              website, applications, and services (collectively, “Services”).
              This Privacy Policy does not apply to content that we process on
              behalf of customers of our business offerings, such as our API.
              Our use of that data is governed by our customer agreements
              covering access to and use of those offerings.
            </Typography>
            <Typography className="page-text">
              For information about how we collect and use training information
              to develop our language models that power ChatGPT and other
              Services, and your choices with respect to that information,
              please see this help center article.
            </Typography>
            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              1. Personal information we collect
            </Typography>
            <Typography className="page-text">
              We collect personal information relating to you (“Personal
              Information”) as follows:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Personal Information You Provide: We collect Personal
                  Information if you create an account to use our Services or
                  communicate with us as follows:
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Account Information: When you create an account with us, we
                  will collect information associated with your account,
                  including your name, contact information, account credentials,
                  payment card information, and transaction history,
                  (collectively, “Account Information”).
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  User Content: When you use our Services, we collect Personal
                  Information that is included in the input, file uploads, or
                  feedback that you provide to our Services (“Content”).
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Communication Information: If you communicate with us, we
                  collect your name, contact information, and the contents of
                  any messages you send (“Communication Information”).
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Social Media Information: We have pages on social media sites
                  like Instagram, Facebook, Medium, Twitter, YouTube, and
                  LinkedIn. When you interact with our social media pages, we
                  will collect Personal Information that you elect to provide to
                  us, such as your contact details (collectively, “Social
                  Information”). In addition, the companies that host our social
                  media pages may provide us with aggregate information and
                  analytics about our social media activity.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Other Information You Provide: We collect other information
                  that you may provide to us, such as when you participate in
                  our events or surveys or provide us with information to
                  establish your identity (collectively, “Other Information You
                  Provide”).
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Personal Information We Receive Automatically From Your Use of
                  the Services: When you visit, use, or interact with the
                  Services, we receive the following information about your
                  visit, use, or interactions (“Technical Information”):
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Log Data: Information that your browser or device
                  automatically sends when you use our Services. Log data
                  includes your Internet Protocol address, browser type and
                  settings, the date and time of your request, and how you
                  interact with our Services.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Usage Data: We may automatically collect information about
                  your use of the Services, such as the types of content that
                  you view or engage with, the features you use and the actions
                  you take, as well as your time zone, country, the dates and
                  times of access, user agent and version, type of computer or
                  mobile device, and your computer connection.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Device Information: Includes the name of the device, operating
                  system, device identifiers, and browser you are using.
                  Information collected may depend on the type of device you use
                  and its settings.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Cookies: We use cookies to operate and administer our
                  Services, and improve your experience. A “cookie” is a piece
                  of information sent to your browser by a website you visit.
                  You can set your browser to accept all cookies, to reject all
                  cookies, or to notify you whenever a cookie is offered so that
                  you can decide each time whether to accept it. However,
                  refusing a cookie may in some cases preclude you from using,
                  or negatively affect the display or function of, a website or
                  certain areas or features of a website. For more details on
                  cookies, please visit All About Cookies.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Analytics: We may use a variety of online analytics products
                  that use cookies to help us analyze how users use our Services
                  and enhance your experience when you use the Services.
                </ListItem>
              </List>
            </Typography>
            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              2. How we use personal information
            </Typography>
            <Typography className="page-text">
              We may use Personal Information for the following purposes:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To provide, administer, maintain and/or analyze the Services;
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To improve our Services and conduct research;
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To communicate with you; including to send you information
                  about our Services and events;
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To develop new programs and services;
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To prevent fraud, criminal activity, or misuses of our
                  Services, and to protect the security of our IT systems,
                  architecture, and networks;
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To carry out business transfers; and
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To comply with legal obligations and legal process and to
                  protect our rights, privacy, safety, or property, and/or that
                  of our affiliates, you, or other third parties.
                </ListItem>
              </List>
            </Typography>
            <Typography className="page-text">
              Aggregated or De-Identified Information. We may aggregate or
              de-identify Personal Information so that it may no longer be used
              to identify you and use such information to analyze the
              effectiveness of our Services, to improve and add features to our
              Services, to conduct research and for other similar purposes. In
              addition, from time to time, we may analyze the general behavior
              and characteristics of users of our Services and share aggregated
              information like general user statistics with third parties,
              publish such aggregated information or make such aggregated
              information generally available. We may collect aggregated
              information through the Services, through cookies, and through
              other means described in this Privacy Policy. We will maintain and
              use de-identified information in anonymous or de-identified form
              and we will not attempt to reidentify the information, unless
              required by law.
            </Typography>
            <Typography className="page-text">
              As noted above, we may use Content you provide us to improve our
              Services, for example to train the models that power ChatGPT. Read
              our instructions on how you can opt out of our use of your Content
              to train our models.
            </Typography>
            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              3. Disclosure of personal information
            </Typography>
            <Typography className="page-text">
              In certain circumstances, we may provide your Personal Information
              to third parties without further notice to you, unless required by
              the law:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Vendors and Service Providers: To assist us in meeting
                  business operations needs and to perform certain services and
                  functions, we may provide Personal Information to vendors and
                  service providers, including providers of hosting services,
                  customer service vendors, cloud services, email communication
                  software, web analytics services, and other information
                  technology providers, among others. Pursuant to our
                  instructions, these parties will access, process, or store
                  Personal Information only in the course of performing their
                  duties to us.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Business Transfers: If we are involved in strategic
                  transactions, reorganization, bankruptcy, receivership, or
                  transition of service to another provider (collectively, a
                  “Transaction”), your Personal Information and other
                  information may be disclosed in the diligence process with
                  counterparties and others assisting with the Transaction and
                  transferred to a successor or affiliate as part of that
                  Transaction along with other assets.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Legal Requirements: We may share your Personal Information,
                  including information about your interaction with our
                  Services, with government authorities, industry peers, or
                  other third parties (i) if required to do so by law or in the
                  good faith belief that such action is necessary to comply with
                  a legal obligation, (ii) to protect and defend our rights or
                  property, (iii) if we determine, in our sole discretion, that
                  there is a violation of our terms, policies, or the law; (iv)
                  to detect or prevent fraud or other illegal activity; (v) to
                  protect the safety, security, and integrity of our products,
                  employees, or users, or the public, or (vi) to protect against
                  legal liability.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Affiliates: We may disclose Personal Information to our
                  affiliates, meaning an entity that controls, is controlled by,
                  or is under common control with YankiAI. Our affiliates may
                  use the Personal Information we share in a manner consistent
                  with this Privacy Policy.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Business Account Administrators: When you join a YankiAI
                  Enterprise or business account, the administrators of that
                  account may access and control your YankiAI account. In
                  addition, if you create an account using an email address
                  belonging to your employer or another organization, we may
                  share the fact that you have a YankiAI account and certain
                  account information, such as your email address, with your
                  employer or organization to, for example, enable you to be
                  added to their business account.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Other Users and Third Parties You Share Information With:
                  Certain features allow you to display or share information
                  with other users or third parties. For example, you may share
                  ChatGPT conversations with other users via shared links or
                  send information to third-party applications via custom
                  actions for GPTs. Be sure you trust any user or third party
                  with whom you share information.
                </ListItem>
              </List>
            </Typography>
            <Typography className="page-text">
              Aggregated or De-Identified Information. We may aggregate or
              de-identify Personal Information so that it may no longer be used
              to identify you and use such information to analyze the
              effectiveness of our Services, to improve and add features to our
              Services, to conduct research and for other similar purposes. In
              addition, from time to time, we may analyze the general behavior
              and characteristics of users of our Services and share aggregated
              information like general user statistics with third parties,
              publish such aggregated information or make such aggregated
              information generally available. We may collect aggregated
              information through the Services, through cookies, and through
              other means described in this Privacy Policy. We will maintain and
              use de-identified information in anonymous or de-identified form
              and we will not attempt to reidentify the information, unless
              required by law.
            </Typography>
            <Typography className="page-text">
              Aggregated or De-Identified Information. We may aggregate or
              de-identify Personal Information so that it may no longer be used
              to identify you and use such information to analyze the
              effectiveness of our Services, to improve and add features to our
              Services, to conduct research and for other similar purposes. In
              addition, from time to time, we may analyze the general behavior
              and characteristics of users of our Services and share aggregated
              information like general user statistics with third parties,
              publish such aggregated information or make such aggregated
              information generally available. We may collect aggregated
              information through the Services, through cookies, and through
              other means described in this Privacy Policy. We will maintain and
              use de-identified information in anonymous or de-identified form
              and we will not attempt to reidentify the information, unless
              required by law.
            </Typography>
            <Typography className="page-text">
              Aggregated or De-Identified Information. We may aggregate or
              de-identify Personal Information so that it may no longer be used
              to identify you and use such information to analyze the
              effectiveness of our Services, to improve and add features to our
              Services, to conduct research and for other similar purposes. In
              addition, from time to time, we may analyze the general behavior
              and characteristics of users of our Services and share aggregated
              information like general user statistics with third parties,
              publish such aggregated information or make such aggregated
              information generally available. We may collect aggregated
              information through the Services, through cookies, and through
              other means described in this Privacy Policy. We will maintain and
              use de-identified information in anonymous or de-identified form
              and we will not attempt to reidentify the information, unless
              required by law.
            </Typography>
            <Typography className="page-text">
              Aggregated or De-Identified Information. We may aggregate or
              de-identify Personal Information so that it may no longer be used
              to identify you and use such information to analyze the
              effectiveness of our Services, to improve and add features to our
              Services, to conduct research and for other similar purposes. In
              addition, from time to time, we may analyze the general behavior
              and characteristics of users of our Services and share aggregated
              information like general user statistics with third parties,
              publish such aggregated information or make such aggregated
              information generally available. We may collect aggregated
              information through the Services, through cookies, and through
              other means described in this Privacy Policy. We will maintain and
              use de-identified information in anonymous or de-identified form
              and we will not attempt to reidentify the information, unless
              required by law.
            </Typography>
            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              4. Your rights
            </Typography>
            <Typography className="page-text">
              Depending on location, individuals may have certain statutory
              rights in relation to their Personal Information. For example, you
              may have the right to:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Access your Personal Information and information relating to
                  how it is processed.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Delete your Personal Information from our records.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Rectify or update your Personal Information.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Transfer your Personal Information to a third party (right to
                  data portability).
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Transfer your Personal Information to a third party (right to
                  data portability).
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Withdraw your consent—where we rely on consent as the legal
                  basis for processing at any time.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Object to how we process your Personal Information.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Lodge a complaint with your local data protection authority.
                </ListItem>
              </List>
            </Typography>
            <Typography className="page-text">
              You can exercise some of these rights through your YankiAI
              account. If you are unable to exercise your rights through your
              account, please submit your request through{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>
            </Typography>
            <Typography className="page-text">
              A note about accuracy: Services like ChatGPT generate responses by
              reading a user’s request and, in response, predicting the words
              most likely to appear next. In some cases, the words most likely
              to appear next may not be the most factually accurate. For this
              reason, you should not rely on the factual accuracy of output from
              our models. If you notice that ChatGPT output contains factually
              inaccurate information about you and you would like us to correct
              the inaccuracy, you may submit a correction request through
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>
            </Typography>
            <Typography className="page-text">
              Given the technical complexity of how our models work, we may not
              be able to correct the inaccuracy in every instance. In that case,
              you may request that we remove your Personal Information from
              ChatGPT’s output by filling out this form.
            </Typography>
            <Typography className="page-text">
              For information on how to exercise your rights with respect to
              data we have collected from the internet to train our models,
              please see this help center article.
            </Typography>

            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              5. Additional U.S. state disclosures
            </Typography>

            <Typography className="page-text">
              The following table provides additional information about the
              categories of Personal Information we collect and how we disclose
              that information. You can read more about the Personal Information
              we collect in “Personal information we collect” above, how we use
              Personal Information in “How we use personal information” above,
              and how we retain Personal Information in “Security and Retention”
              below.
            </Typography>
            <Typography className="page-text">
              Category of Personal Information, Disclosure of Personal
              Information, Identifiers, such as your name, contact details, IP
              address, and other device identifiers. We may disclose this
              information to our affiliates, vendors and service providers to
              process in accordance with our instructions; to law enforcement
              and other third parties for the legal reasons described above; to
              parties involved in Transactions; to corporate administrators of
              enterprise or team accounts; and to other users and third parties
              you choose to share it with.
            </Typography>
            <Typography className="page-text">
              Commercial Information, such as your transaction history We may
              disclose this information to our affiliates, vendors and service
              providers to process in accordance with our instructions; to law
              enforcement and other third parties for the legal reasons
              described above; to parties involved in Transactions; and to
              corporate administrators of enterprise or team accounts.
            </Typography>

            <Typography className="page-text">
              Network Activity Information, such as Content and how you interact
              with our Services. We may disclose this information to our
              affiliates, vendors and service providers to process in accordance
              with our instructions; to law enforcement and other third parties
              for the legal reasons described above; to parties involved in
              Transactions; and to other users and third parties you choose to
              share it with.
            </Typography>
            <Typography className="page-text">
              Geolocation Data: We may disclose this information to our
              affiliates, vendors and service providers to process in accordance
              with our instructions; to law enforcement and other third parties
              for the legal reasons described above; and to parties involved in
              Transactions.
            </Typography>
            <Typography className="page-text">
              Your account login credentials and payment card information
              (Sensitive Personal Information) We disclose this information to
              our affiliates, vendors and service providers, law enforcement,
              and parties involved in Transactions.
            </Typography>
            <Typography className="page-text">
              To the extent provided for by local law and subject to applicable
              exceptions, individuals may have the following privacy rights in
              relation to their Personal Information:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  The right to know information about our processing of your
                  Personal Information, including the specific pieces of
                  Personal Information that we have collected from you;
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  The right to request deletion of your Personal Information;
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  The right to correct your Personal Information; and
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  The right to be free from discrimination relating to the
                  exercise of any of your privacy rights.
                </ListItem>
              </List>
            </Typography>
            <Typography className="page-text">
              We don’t “sell” Personal Information or “share” Personal
              Information for cross-contextual behavioral advertising (as those
              terms are defined under applicable local law). We also don’t
              process sensitive Personal Information for the purposes of
              inferring characteristics about a consumer.
            </Typography>
            <Typography className="page-text">
              Exercising Your Rights. To the extent applicable under local law,
              you can exercise privacy rights described in this section by
              submitting a request through{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>
            </Typography>
            <Typography className="page-text">
              Verification: In order to protect your Personal Information from
              unauthorized access, change, or deletion, we may require you to
              verify your credentials before you can submit a request to know,
              correct, or delete Personal Information. If you do not have an
              account with us, or if we suspect fraudulent or malicious
              activity, we may ask you to provide additional Personal
              Information and proof of residency for verification. If we cannot
              verify your identity, we will not be able to honor your request.
            </Typography>
            <Typography className="page-text">
              Authorized Agents: You may also submit a rights request through an
              authorized agent. If you do so, the agent must present signed
              written permission to act on your behalf and you may also be
              required to independently verify your identity and submit proof of
              your residency with us. Authorized agent requests can be submitted
              to{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>
            </Typography>
            <Typography className="page-text">
              Appeals: Depending on where you live, you may have the right to
              appeal a decision we make relating to requests to exercise your
              rights under applicable local law. To appeal a decision, please
              send your request to{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>
            </Typography>

            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              6. Children
            </Typography>

            <Typography className="page-text">
              Our Service is not directed to children under the age of 13.
              YankiAI does not knowingly collect Personal Information from
              children under the age of 13. If you have reason to believe that a
              child under the age of 13 has provided Personal Information to
              YankiAI through the Service, please email us at{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>{" "}
              We will investigate any notification and if appropriate, delete
              the Personal Information from our systems. If you are 13 or older,
              but under 18, you must have permission from your parent or
              guardian to use our Services.
            </Typography>

            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              7. Links to other websites
            </Typography>

            <Typography className="page-text">
              The Service may contain links to other websites not operated or
              controlled by YankiAI, including social media services (“Third
              Party Sites”). The information that you share with Third Party
              Sites will be governed by the specific privacy policies and terms
              of service of the Third Party Sites and not by this Privacy
              Policy. By providing these links we do not imply that we endorse
              or have reviewed these sites. Please contact the Third Party Sites
              directly for information on their privacy practices and policies.
            </Typography>

            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              8. Security and Retention
            </Typography>
            <Typography className="page-text">
              We implement commercially reasonable technical, administrative,
              and organizational measures to protect Personal Information both
              online and offline from loss, misuse, and unauthorized access,
              disclosure, alteration, or destruction. However, no Internet or
              email transmission is ever fully secure or error-free. In
              particular, email sent to or from us may not be secure. Therefore,
              you should take special care in deciding what information you send
              to us via the Service or email. In addition, we are not
              responsible for circumvention of any privacy settings or security
              measures contained on the Service, or third-party websites.
            </Typography>
            <Typography className="page-text">
              We’ll retain your Personal Information for only as long as we need
              to provide our Service to you, or for other legitimate business
              purposes such as resolving disputes, safety and security reasons,
              or complying with our legal obligations. How long we retain
              Personal Information will depend on a number of factors, such as
              the amount, nature, and sensitivity of the information, the
              potential risk of harm from unauthorized use or disclosure, our
              purpose for processing the information, and any legal
              requirements.
            </Typography>

            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              9. International users
            </Typography>
            <Typography className="page-text">
              By using our Service, you understand and acknowledge that your
              Personal Information will be processed and stored in our
              facilities and servers in the United States and may be disclosed
              to our service providers and affiliates in other jurisdictions.
            </Typography>
            <Typography className="page-text">
              Legal Basis for Processing. Our legal bases for processing your
              Personal Information include:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Performance of a contract with you when we provide and
                  maintain our Services. When we process Account Information,
                  Content, and Technical Information solely to provide our
                  Services to you, this information is necessary to be able to
                  provide our Services. If you do not provide this information,
                  we may not be able to provide our Services to you.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Our legitimate interests in protecting our Services from
                  abuse, fraud, or security risks, or in developing, improving,
                  or promoting our Services, including when we train our models.
                  This may include the processing of Account Information,
                  Content, Social Information, and Technical Information. Read
                  our instructions on how you can opt out of our use of your
                  information to train our models.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Your consent when we ask for your consent to process your
                  Personal Information for a specific purpose that we
                  communicate to you. You have the right to withdraw your
                  consent at any time.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Compliance with our legal obligations when we use your
                  Personal Information to comply with applicable law or when we
                  protect our or our affiliates’, users’, or third parties’
                  rights, safety, and property.
                </ListItem>
              </List>
            </Typography>
            <Typography className="page-text">
              Data Transfers: Where required, we will use appropriate safeguards
              for transferring Personal Information outside of certain
              countries. We will only transfer Personal Information pursuant to
              a legally valid transfer mechanism.
            </Typography>
            <Typography className="page-text">
              Data Protection Officer: You can contact our data protection
              officer at{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>{" "}
              in matters related to Personal Information processing.
            </Typography>

            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              10. Changes to the privacy policy
            </Typography>
            <Typography className="page-text">
              We may update this Privacy Policy from time to time. When we do,
              we will post an updated version on this page, unless another type
              of notice is required by applicable law.
            </Typography>

            <Typography
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              11. How to contact us
            </Typography>
            <Typography className="page-text">
              Please contact support if you have any questions or concerns not
              already addressed in this Privacy Policy.
            </Typography>

            <Typography
              variant="h4"
              className="page-title"
            >
              YankiAI Personal Assistant Services Privacy Policy
            </Typography>

            <Typography className="page-text">
              YankiAI, including its parent company Nelat LLC, affiliates, and
              subsidiaries ("YankiAI," "we," "us," or "our"), is dedicated to
              respecting and protecting your privacy. This Privacy Policy
              outlines our practices concerning the collection, use, and sharing
              of your information through YankiAI's website, mobile
              applications, and services (collectively, the "Service"). By
              accessing or using our Service, you agree to the practices
              described in this Privacy Policy and our Terms of Use.
            </Typography>
            <Typography className="page-text">
              Information We Collect
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Directly Provided Information: We collect information you
                  provide when interacting with our Service, such as your name,
                  email address, phone number, and payment information. This
                  includes information provided for service requests, account
                  creation, and transactions.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Information from Third Parties: We may receive information
                  about you from third parties, including service providers and
                  social media platforms, based on your interactions and
                  settings.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Automatically Collected Information: We use cookies, pixel
                  tags, and other tracking technologies to collect information
                  about your Service usage, device information, and browsing
                  behavior.
                </ListItem>

                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Location Information: We derive your approximate location from
                  your IP address to customize and provide our services.
                </ListItem>
              </List>
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Use of Information
            </Typography>
            <Typography className="page-text">
              Your information is used to deliver, customize, and improve our
              Service, including:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Fulfilling service requests and processing transactions.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Communicating with you regarding our Service and updates.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Ensuring the security and integrity of our Service.
                </ListItem>
              </List>
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Sharing of Information
            </Typography>
            <Typography className="page-text">
              We may share your information with:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Third-party service providers and partners who assist in
                  delivering our Service.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Authorities and third parties for legal reasons and to enforce
                  our policies.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  In the event of a business transition, such as a merger or
                  acquisition, your information may be part of the transferred
                  assets.
                </ListItem>
              </List>
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Your Choices and Rights
            </Typography>
            <Typography className="page-text">
              You have control over your information, including the ability to:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Update or delete your account information.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Opt-out of receiving promotional communications.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Manage cookies and tracking technologies through your browser
                  settings.
                </ListItem>
              </List>
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Data Security and Retention
            </Typography>
            <Typography className="page-text">
              We implement security measures to protect your information but
              cannot guarantee absolute security. We retain your information for
              as long as necessary to fulfill the purposes outlined in this
              Privacy Policy unless a longer retention period is required or
              permitted by law.
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Children's Privacy
            </Typography>
            <Typography className="page-text">
              Our Service is not intended for individuals under the age of 13,
              and we do not knowingly collect personal information from children
              under 13.
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              International Data Transfers
            </Typography>
            <Typography className="page-text">
              Your information may be stored and processed in any country where
              we have facilities or service providers, and by using our Service,
              you consent to the transfer of information to countries outside
              your country of residence, including the United States.
            </Typography>
            <Typography className="page-text">
              Third-Party Services and Data SharingThis section of our Privacy
              Policy outlines YankiAI's practices regarding the interaction with
              third-party services and the sharing of data with these entities.
              YankiAI values user privacy and is committed to transparency in
              all its dealings with third-party services.Interaction with
              Third-Party Services: YankiAI may provide users with access to
              third-party services, such as payment processors, event
              organizers, and content providers. While we strive to partner with
              reputable services that prioritize user privacy, YankiAI does not
              control the privacy practices of these third parties. Data
              Sharing: When users engage with third-party services through the
              YankiAI platform, certain information, including but not limited
              to user contact details and transactional data, may be shared with
              these entities to facilitate the requested service or transaction.
              YankiAI ensures that data sharing is conducted securely and in
              accordance with our high privacy standards. However, once
              information is shared with third parties, it will be governed by
              their respective privacy policies.Third-Party Privacy Policies:
              Users are encouraged to review the privacy policies of any
              third-party services they interact with to understand how these
              entities collect, use, and protect personal information. YankiAI
              is not responsible for the privacy practices or content of
              third-party websites and services.User Consent: By using YankiAI
              and engaging with third-party services, users consent to the
              sharing of their information as described in this policy. Users
              have the right to opt-out of data sharing by not utilizing
              third-party services or by adjusting their account settings where
              applicable.Data Protection: YankiAI takes reasonable measures to
              ensure that data shared with third parties is protected. However,
              we cannot guarantee the security of data once it is in the
              possession of third-party services.Changes to Third-Party
              Services: The third-party services accessible through YankiAI may
              change over time. YankiAI reserves the right to start or stop
              offering access to any third-party services at its discretion and
              without prior notice to users.This section is part of the broader
              Privacy Policy of YankiAI and is intended to provide users with a
              clear understanding of our data sharing practices with third-party
              services. Our commitment to user privacy extends to how we handle
              interactions with these third parties, and we encourage users to
              stay informed and exercise caution when engaging with external
              services.For further information or inquiries regarding our
              privacy practices, please contact us directly.
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Changes to Our Privacy Policy
            </Typography>
            <Typography className="page-text">
              We may update this Privacy Policy to reflect changes to our
              information practices. We will notify you of any significant
              changes by posting the new Privacy Policy on our Service.
            </Typography>
            <Typography
              variant="h5"
              className={`page-sub-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Contact Us
            </Typography>
            <Typography className="page-text">
              For questions about this Privacy Policy or our privacy practices,
              please contact us at{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai.
                </a>
              </strong>
            </Typography>
            <Typography className="page-text">
              By using YankiAI's Service, you acknowledge your understanding and
              consent to the collection, use, and disclosure of your information
              as set forth in this Privacy Policy.
            </Typography>

            <Typography
              variant="h4"
              className="page-title"
            >
              YankiAI Emergency Services Disclaimer
            </Typography>

            <Typography className="page-text">
              Please be advised that Hatzalah of Los Angeles and YankiAI
              (hereinafter referred to as "We," "Us," or "Our") strive to
              provide the highest quality emergency medical services and
              information. However, the effectiveness of any medical
              intervention cannot be guaranteed. The information and resources
              provided by our organization, including but not limited to
              instructional videos, educational content, and guidance on
              emergency procedures, are intended for general information
              purposes only and should not be considered professional medical
              advice or a substitute for professional medical care, diagnosis,
              or treatment.
            </Typography>
            <Typography className="page-text">
              This information is designed to support, not replace, the
              relationship that exists between a patient/site visitor and
              his/her existing healthcare provider. We cannot ensure the saving
              of a life in every circumstance as individual cases may vary, and
              the outcomes of emergency interventions depend on factors beyond
              our control.
            </Typography>
            <Typography className="page-text">
              The system we have developed to connect individuals with Hatzalah
              centers and responders worldwide is intended to facilitate access
              to emergency services but does not replace professional medical
              advice, diagnosis, or treatment. Always seek the advice of your
              physician or another qualified health provider with any questions
              you may have regarding a medical condition. Do not disregard,
              avoid, or delay obtaining medical advice from qualified healthcare
              providers based on the information provided.
            </Typography>
            <Typography className="page-text">
              In no event shall we be liable for any direct, indirect,
              incidental, special, consequential, or punitive damages arising
              out of the use of or inability to use the information and services
              provided. By accessing and using these resources, you acknowledge
              and agree to this disclaimer and assume full responsibility for
              the use of the information and services.
            </Typography>
            <Typography className="page-text">
              We do not endorse, recommend, or guarantee the accuracy,
              reliability, or quality of any content, information, materials,
              services, products, opinions, or statements available through our
              service or linked sites. We explicitly disclaim any warranties
              related to the service's operation, including uninterrupted or
              error-free service or the correction of defects.
            </Typography>
            <Typography className="page-text">
              We are not responsible for the content, accuracy, or quality of
              products or services provided by third parties or advertised on
              third-party services. It is acknowledged that we are not liable
              for any defamatory, offensive, or illegal conduct of users or
              third parties, with all risks associated with such content resting
              on the user.
            </Typography>
            <Typography className="page-text">
              All products and services offered by us are provided "as is"
              without any warranties, including but not limited to warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property, whether express or
              implied.
            </Typography>
            <Typography className="page-text">
              The applicability of these disclaimers and the limitation of
              liability may vary based on jurisdiction. Certain jurisdictions do
              not allow the disclaimer of certain warranties or the limitation
              or exclusion of liability for certain types of damages.
              Accordingly, some of the above disclaimers, exclusions, or
              limitations may not apply to you, but they shall apply to the
              maximum extent permitted by applicable law.
            </Typography>
            <Typography className="page-text">
              This information is provided for legal purposes only and does not
              constitute medical advice. Always consult a qualified medical
              professional for any health-related concerns or emergencies.
            </Typography>
            <Typography className="page-text">
              Your use of our services indicates your agreement to this
              disclaimer and your understanding that you are using our services
              and information at your own risk.
            </Typography>

            <Box className="home-page-btn-container">
              <Button
                variant="contained"
                onClick={onGoToHome}
                className="home-page-btn"
              >
                Go to home
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
