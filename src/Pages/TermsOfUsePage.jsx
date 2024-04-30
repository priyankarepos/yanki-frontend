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

const TermsOfUse = () => {
  const { activeTab } = React.useContext(Context);

  const navigate = useNavigate();

  const onGoToHome = () => {
    navigate("/", { replace: true });
  };

  const recipientEmail = "pa@yanki.ai";
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
            className="termsofUse-container"
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
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              YankiAI General Terms of Use
            </Typography>
            <Typography className="page-text">
              Thank you for using YankiAI!
            </Typography>
            <Typography className="page-text">
              These Terms of Use apply to your use of YankiAI’s other services
              for individuals, along with any associated software applications
              and websites (all together, “Services”). These Terms form an
              agreement between you and YankiAI, (Nelat LLC) a California
              company, and they include our Service Terms and important
              provisions for resolving disputes through arbitration. By using
              our Services, you agree to these Terms.
            </Typography>
            <Typography className="page-text">
              If you reside in the European Economic Area, Switzerland, or the
              UK, your use of the Services is governed by these terms.
            </Typography>
            <Typography className="page-text">
              Our Business Terms govern the use of YankiAI, our APIs, and our
              other services for businesses and developers.{" "}
            </Typography>
            <Typography className="page-text">
              Our Privacy Policy explains how we collect and use personal
              information. Although it does not form part of these Terms, it is
              an important document that you should read.{" "}
            </Typography>

            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Who we are
            </Typography>

            <Typography className="page-text">
              YankiAI is an AI research and deployment company. Our mission is
              to ensure that artificial general intelligence benefits all of
              humanity. For more information about YankiAI, please visit our
              website.
            </Typography>

            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Registration and Access
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Minimum Age:
              </strong>{" "}
              <strong></strong> You must be at least 13 years old or the minimum
              age required in your country to consent to use the Services. If
              you are under 18, you must have your parent or legal guardian’s
              permission to use the Services.
            </Typography>

            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Registration:
              </strong>{" "}
              You must provide accurate and complete information to register for
              an account to use our Services. You may not share your account
              credentials or make your account available to anyone else and are
              responsible for all activities that occur under your account. If
              you create an account or use the Services on behalf of another
              person or entity, you must have the authority to accept these
              Terms on their behalf.
            </Typography>

            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Using Our Services
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                What You Can Do:
              </strong>{" "}
              Subject to your compliance with these Terms, you may access and
              use our Services. In using our Services, you must comply with all
              applicable laws as well as our Sharing & Publication Policy, Usage
              Policies, and any other documentation, guidelines, or policies we
              make available to you.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                What You Cannot Do:{" "}
              </strong>{" "}
              You may not use our Services for any illegal, harmful, or abusive
              activity. For example, you may not:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Use our Services in a way that infringes, misappropriates, or
                  violates anyone’s rights.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Modify, copy, lease, sell, or distribute any of our Services.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Attempt to or assist anyone to reverse engineer, decompile or
                  discover the source code or underlying components of our
                  Services, including our models, algorithms, or systems (except
                  to the extent this restriction is prohibited by applicable
                  law).
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Automatically or programmatically extract data or Output
                  (defined below).
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Represent that Output was human-generated when it was not.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Interfere with or disrupt our Services, including circumvent
                  any rate limits or restrictions or bypass any protective
                  measures or safety mitigations we put on our Services.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Use Output to develop models that compete with YankiAI.
                </ListItem>
              </List>
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Software:
              </strong>{" "}
              Our Services may allow you to download software, such as mobile
              applications, which may update automatically to ensure you’re
              using the latest version. Our software may include open source
              software that is governed by its own licenses that we’ve made
              available to you.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Corporate Domains:
              </strong>{" "}
              If you create an account using an email address owned by an
              organization (for example, your employer), that account may be
              added to the organization's business account with us, in which
              case we will provide notice to you so that you can help facilitate
              the transfer of your account (unless your organization has already
              provided notice to you that it may monitor and control your
              account). Once your account is transferred, the organization’s
              administrator will be able to control your account, including
              being able to access Content (defined below) and restrict or
              remove your access to the account.
            </Typography>

            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Third Party Services:
              </strong>{" "}
              Our services may include third-party software, products, or
              services, (“Third Party Services”) and some parts of our Services,
              like our browse feature, may include output from those services
              (“Third Party Output”). Third Party Services and Third Party
              Output are subject to their own terms, and we are not responsible
              for them.{" "}
            </Typography>

            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Software:{" "}
              </strong>{" "}
              Our Services may allow you to download software, such as mobile
              applications, which may update automatically to ensure you’re
              using the latest version. Our software may include open source
              software that is governed by its own licenses that we’ve made
              available to you.
            </Typography>
            <Typography className="page-text">
              Feedback. We appreciate your feedback, and you agree that we may
              use it without restriction or compensation to you.{" "}
            </Typography>
            <Typography className="page-text"></Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Content
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Your Content:
              </strong>{" "}
              You may provide input to the Services (“Input”), and receive
              output from the Services based on the Input (“Output”). Input and
              Output are collectively “Content.” You are responsible for
              Content, including ensuring that it does not violate any
              applicable law or these Terms. You represent and warrant that you
              have all rights, licenses, and permissions needed to provide Input
              to our Services.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Ownership of Content
              </strong>{" "}
              As between you and YankiAI, and to the extent permitted by
              applicable law, you (a) retain your ownership rights in Input and
              (b) own the Output. We hereby assign to you all our right, title,
              and interest, if any, in and to Output.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Similarity of Content:
              </strong>{" "}
              Due to the nature of our Services and artificial intelligence
              generally, output may not be unique and other users may receive
            </Typography>
            <Typography className="page-text"></Typography>
            <Typography className="page-text">
              similar output from our Services. Our assignment above does not
              extend to other users’ output or any Third Party Output.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Our Use of Content:
              </strong>{" "}
              We may use Content to provide, maintain, develop, and improve our
              Services, comply with applicable law, enforce our terms and
              policies, and keep our Services safe.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Opt-Out:
              </strong>{" "}
              If you do not want us to use your Content to train our models, you
              can opt-out by following the instructions in our Help Center
              article. Please note that in some cases this may limit the ability
              of our Services to better address your specific use case.
            </Typography>
            <Typography className="page-text"></Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Accuracy:
              </strong>{" "}
              Artificial intelligence and machine learning are rapidly evolving
              fields of study. We are constantly working to improve our Services
              to make them more accurate, reliable, safe, and beneficial. Given
              the probabilistic nature of machine learning, the use of our
              Services may, in some situations, result in Output that does not
              accurately reflect real people, places, or facts.
            </Typography>

            <Typography className="page-text">
              When you use our Services you understand and agree:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Output may not always be accurate. You should not rely on
                  Output from our Services as a sole source of truth or factual
                  information, or as a substitute for professional advice.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  You must evaluate Output for accuracy and appropriateness for
                  your use case, including using human review as appropriate,
                  before using or sharing Output from the Services.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  You must not use any Output relating to a person for any
                  purpose that could have a legal or material impact on that
                  person, such as making credit, educational, employment,
                  housing, insurance, legal, medical, or other important
                  decisions about them.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Our Services may provide incomplete, incorrect, or offensive
                  Output that does not represent YankiAI’s views. If Output
                  references any third-party products or services, it doesn’t
                  mean the third party endorses or is affiliated with YankiAI.
                </ListItem>
              </List>
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Our IP Rights
            </Typography>
            <Typography className="page-text">
              We and our affiliates own all rights, title, and interest in and
              to the Services. You may only use our name and logo in accordance
              with our Brand Guidelines.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Paid Accounts
            </Typography>
            <Typography className="page-text"></Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                {" "}
                Billing:
              </strong>{" "}
              If you purchase any Services, you will provide complete and
              accurate billing information, including a valid payment method.
              For paid subscriptions, we will automatically charge your payment
              method on each agreed-upon periodic renewal until you cancel.
              You’re responsible for all applicable taxes, and we’ll charge tax
              when required. If your payment cannot be completed, we may
              downgrade your account or suspend your access to our Services
              until payment is received.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Service Credits:
              </strong>{" "}
              You can pay for some Services in advance by purchasing service
              credits. All service credits are subject to our Service Credit
              Terms.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Cancellation:
              </strong>{" "}
              You can cancel your paid subscription at any time. Payments are
              non-refundable, except where required by law. These Terms do not
              override any mandatory local laws regarding your cancellation
              rights.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Changes:
              </strong>{" "}
              We may change our prices from time to time. If we increase our
              subscription prices, we will give you at least 30 days’ notice and
              any price increase will take effect on your next renewal so that
              you can cancel if you do not agree to the price increase.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Termination and Suspension
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Termination:
              </strong>{" "}
              You are free to stop using our Services at any time. We reserve
              the right to suspend or terminate your access to our Services or
              delete your account if we determine:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  You breached these Terms or our Usage Policies.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  We must do so to comply with the law.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Your use of our Services could cause risk or harm to YankiAI,
                  our users, or anyone else.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  We also may terminate your account if it has been inactive for
                  over a year and you do not have a paid account. If we do, we
                  will provide you with advance notice.{" "}
                </ListItem>
              </List>
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Appeals:
              </strong>{" "}
              If you believe we have suspended or terminated your account in
              error, you can file an appeal with us by contacting our Support
              team.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Discontinuation of Services
            </Typography>
            <Typography className="page-text">
              We may decide to discontinue our Services, but if we do, we will
              give you advance notice and a refund for any prepaid, unused
              Services.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Disclaimer of Warranties
            </Typography>
            <Typography className="page-text">
              OUR SERVICES ARE PROVIDED “AS IS.” EXCEPT TO THE EXTENT PROHIBITED
              BY LAW, WE AND OUR AFFILIATES AND LICENSORS MAKE NO WARRANTIES
              (EXPRESS, IMPLIED, STATUTORY OR OTHERWISE) WITH RESPECT TO THE
              SERVICES, AND DISCLAIM ALL WARRANTIES INCLUDING, BUT NOT LIMITED
              TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, SATISFACTORY QUALITY, NON-INFRINGEMENT, AND QUIET
              ENJOYMENT, AND ANY WARRANTIES ARISING OUT OF ANY COURSE OF DEALING
              OR TRADE USAGE. WE DO NOT WARRANT THAT THE SERVICES WILL BE
              UNINTERRUPTED, ACCURATE OR ERROR FREE, OR THAT ANY CONTENT WILL BE
              SECURE OR NOT LOST OR ALTERED.
            </Typography>
            <Typography className="page-text">
              YOU ACCEPT AND AGREE THAT ANY USE OF OUTPUTS FROM OUR SERVICE IS
              AT YOUR SOLE RISK AND YOU WILL NOT RELY ON OUTPUT AS A SOLE SOURCE
              OF TRUTH OR FACTUAL INFORMATION, OR AS A SUBSTITUTE FOR
              PROFESSIONAL ADVICE.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Limitation of Liability
            </Typography>
            <Typography className="page-text">
              NEITHER WE NOR ANY OF OUR AFFILIATES OR LICENSORS WILL BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY
              DAMAGES, INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, OR
              DATA OR OTHER LOSSES, EVEN IF WE HAVE BEEN ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY UNDER THESE
              TERMS WILL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID FOR THE
              SERVICE THAT GAVE RISE TO THE CLAIM DURING THE 12 MONTHS BEFORE
              THE LIABILITY AROSE OR ONE HUNDRED DOLLARS ($100). THE LIMITATIONS
              IN THIS SECTION APPLY ONLY TO THE MAXIMUM EXTENT PERMITTED BY
              APPLICABLE LAW.
            </Typography>
            <Typography className="page-text">
              Some countries and states do not allow the disclaimer of certain
              warranties or the limitation of certain damages, so some or all of
              the terms above may not apply to you, and you may have additional
              rights. In that case, these Terms only limit our responsibilities
              to the maximum extent permissible in your country of residence.
            </Typography>
            <Typography className="page-text">
              YANKIAI’S AFFILIATES, SUPPLIERS, LICENSORS, AND DISTRIBUTORS ARE
              INTENDED THIRD PARTY BENEFICIARIES OF THIS SECTION.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Indemnity
            </Typography>
            <Typography className="page-text">
              If you are a business or organization, to the extent permitted by
              law, you will indemnify and hold harmless us, our affiliates, and
              our personnel, from and against any costs, losses, liabilities,
              and expenses (including attorneys’ fees) from third-party claims
              arising out of or relating to your use of the Services and Content
              or any violation of these Terms.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Dispute Resolution
            </Typography>
            <Typography className="page-text">
              YOU AND YANKIAI AGREE TO THE FOLLOWING MANDATORY ARBITRATION AND
              CLASS ACTION WAIVER PROVISIONS:
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                MANDATORY ARBITRATION:
              </strong>{" "}
              You and YankiAI agree to resolve any claims arising out of or
              relating to these Terms or our Services, regardless of when the
              claim arose, even if it was before these Terms existed (a
              “Dispute”), through final and binding arbitration. You may opt out
              of arbitration within 30 days of account creation or of any
              updates to these arbitration terms within 30 days after the update
              has taken effect by filling out the form provided. If you opt out
              of an update, the last set of agreed-upon arbitration terms will
              apply.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Informal Dispute Resolution:
              </strong>{" "}
              We would like to understand and try to address your concerns prior
              to formal legal action. Before either of us files a claim against
              the other, we both agree to try to resolve the Dispute informally.
              You agree to do so by sending us notice through the provided form.
              We will do so by sending you notice to the email address
              associated with your account. If we are unable to resolve a
              Dispute within 60 days, either of us has the right to initiate
              arbitration. We also both agree to attend an individual settlement
              conference if either party requests one during this time. Any
              statute of limitations will be tolled during this informal
              resolution process.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Arbitration Forum:
              </strong>{" "}
              If we are unable to resolve the Dispute, either of us may commence
              arbitration with National Arbitration and Mediation (“NAM”) under
              its Comprehensive Dispute Resolution Rules and Procedures and/or
              Supplemental Rules for Mass Arbitration Filings, as applicable
              (available here). YankiAI will not seek attorneys’ fees and costs
              in arbitration unless the arbitrator determines that your claim is
              frivolous. The activities described in these Terms involve
              interstate commerce and the Federal Arbitration Act will govern
              the interpretation and enforcement of these arbitration terms and
              any arbitration.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Arbitration Procedures:
              </strong>{" "}
              The arbitration will be conducted by videoconference if possible,
              but if the arbitrator determines a hearing should be conducted in
              person, the location will be mutually agreed upon, in the county
              where you reside, or as determined by the arbitrator, unless the
              batch arbitration process applies. The arbitration will be
              conducted by a sole arbitrator. The arbitrator will be either a
              retired judge or an attorney licensed to practice law in the state
              of California. The arbitrator will have exclusive authority to
              resolve any Dispute, except the state or federal courts of San
              Francisco, California have the authority to determine any Dispute
              about enforceability, validity of the class action waiver, or
              requests for public injunctive relief, as set out below. Any
              settlement offer amounts will not be disclosed to the arbitrator
              by either party until after the arbitrator determines the final
              award, if any. The arbitrator has the authority to grant motions
              dispositive of all or part of any Dispute.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Exceptions:
              </strong>{" "}
              This section does not require informal dispute resolution or
              arbitration of the following claims: (i) individual claims brought
              in small claims court; and (ii) injunctive or other equitable
              relief to stop unauthorized use or abuse of the Services or
              intellectual property infringement or misappropriation.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                CLASS AND JURY TRIAL WAIVERS:
              </strong>{" "}
              You and YankiAI agree that Disputes must be brought on an
              individual basis only, and may not be brought as a plaintiff or
              class member in any purported class, consolidated, or
              representative proceeding. Class arbitrations, class actions, and
              representative actions are prohibited. Only individual relief is
              available. The parties agree to sever and litigate in court any
              request for public injunctive relief after completing arbitration
              for the underlying claim and all other claims. This does not
              prevent either party from participating in a class-wide
              settlement. You and YankiAI knowingly and irrevocably waive any
              right to trial by jury in any action, proceeding, or counterclaim.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Batch Arbitration:
              </strong>{" "}
              If 25 or more claimants represented by the same or similar counsel
              file demands for arbitration raising substantially similar
              Disputes within 90 days of each other, then you and YankiAI agree
              that NAM will administer them in batches of up to 50 claimants
              each (“Batch”), unless there are less than 50 claimants in total
              or after batching, which will comprise a single Batch. NAM will
              administer each Batch as a single consolidated arbitration with
              one arbitrator, one set of arbitration fees, and one hearing held
              by videoconference or in a location decided by the arbitrator for
              each Batch. If any part of this section is found to be invalid or
              unenforceable as to a particular claimant or Batch, it will be
              severed and arbitrated in individual proceedings.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Severability:
              </strong>{" "}
              If any part of these arbitration terms is found to be illegal or
              unenforceable, the remainder will remain in effect, except that if
              a finding of partial illegality or unenforceability would allow
              class arbitration, class action, or representative action, this
              entire dispute resolution section will be unenforceable in its
              entirety.
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              Copyright Complaints
            </Typography>
            <Typography className="page-text">
              If you believe that your intellectual property rights have been
              infringed, please send notice to the address below or fill out the
              provided form. We may delete or disable content that we believe
              violates these Terms or is alleged to be infringing and will
              terminate accounts of repeat infringers where appropriate.
            </Typography>
            <Typography className="page-text">YankiAI, Nelat L.L.C.</Typography>
            <Typography className="page-text">
              4221 Wilshire Blvd, Suite 312 Los Angeles CA 90010
            </Typography>
            <Typography className="page-text">
              Attn: General Counsel / Copyright Agent
            </Typography>
            <Typography className="page-text">
              Written claims concerning copyright infringement must include the
              following information:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  A physical or electronic signature of the person authorized to
                  act on behalf of the owner of the copyright interest
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  A description of the copyrighted work that you claim has been
                  infringed upon
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Your address, telephone number, and e-mail address
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  A statement by you that you have a good-faith belief that the
                  disputed use is not authorized by the copyright owner, its
                  agent, or the law
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  A statement by you that the above information in your notice
                  is accurate and, under penalty of perjury, that you are the
                  copyright owner or authorized to act on the copyright owner’s
                  behalf
                </ListItem>
              </List>
            </Typography>
            <Typography
              variant="h5"
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
            >
              General Terms
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Assignment:
              </strong>{" "}
              You may not assign or transfer any rights or obligations under
              these Terms and any attempt to do so will be void. We may assign
              our rights or obligations under these Terms to any affiliate,
              subsidiary, or successor in interest of any business associated
              with our Services.
            </Typography>
            <Typography className="page-text">
              Changes to These Terms or Our Services. We are continuously
              working to develop and improve our Services. We may update these
              Terms or our Services accordingly from time to time. For example,
              we may make changes to these Terms or the Services due to:
              <List>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Changes to the law or regulatory requirements.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Security or safety reasons.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Circumstances beyond our reasonable control.{" "}
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  Changes we make in the usual course of developing our
                  Services.
                </ListItem>
                <ListItem className="ya-terms-policy-listitem">
                  <ListItemIcon>
                    <FiberManualRecordIcon
                     className={`text-font-size ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                    />
                  </ListItemIcon>
                  To adapt to new technologies.{" "}
                </ListItem>
              </List>
            </Typography>

            <Typography className="page-text">
              We will give you at least 30 days advance notice of changes to
              these Terms that materially adversely impact you either via email
              or an in-product notification. All other changes will be effective
              as soon as we post them to our website. If you do not agree to the
              changes, you must stop using our Services.
            </Typography>
            <Typography className="page-text">
              Delay in Enforcing These Terms. Our failure to enforce a provision
              is not a waiver of our right to do so later. Except as provided in
              the dispute resolution section above, if any portion of these
              Terms is determined to be invalid or unenforceable, that portion
              will be enforced to the maximum extent permissible and it will not
              affect the enforceability of any other terms.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Trade Controls:
              </strong>{" "}
              You must comply with all applicable trade laws, including
              sanctions and export control laws. Our Services may not be used in
              or for the benefit of, or exported or re-exported to (a) any U.S.
              embargoed country or territory or (b) any individual or entity
              with whom dealings are prohibited or restricted under applicable
              trade laws. Our Services may not be used for any end use
              prohibited by applicable trade laws, and your Input may not
              include material or information that requires a government license
              for release or export.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Entire Agreement:
              </strong>{" "}
              These Terms contain the entire agreement between you and YankiAI
              regarding the Services and, other than any Service-specific terms,
              supersedes any prior or contemporaneous agreements between you and
              YankiAI.
            </Typography>
            <Typography className="page-text">
              <strong
                className={activeTab === 0 ? "light-color" : "lightBlue-color"}
              >
                Governing Law:
              </strong>{" "}
              California law will govern these Terms except for its conflicts of
              laws principles. Except as provided in the dispute resolution
              section above, all claims arising out of or relating to these
              Terms will be brought exclusively in the federal or state courts
              of Los Angeles, California.
            </Typography>

            <Typography
              variant="h4"
              className="page-title"
            >
              YankiAI Personal Assistant Service Terms of Use
            </Typography>

            <Typography className="page-text">
              Welcome to YankiAI ("YankiAI," "we," or "us"). This page explains
              the terms by which you may use our online and/or mobile services,
              website, API, and software provided on or in connection with the
              service (collectively the "Services"). By accessing or using the
              Service, you signify that you have read, understood, and agree to
              be bound by this Terms of Use Agreement ("Agreement") and to the
              collection and use of your information as set forth in the YankiAI
              Privacy Policy, whether or not you are a registered user of our
              Services. YankiAI reserves the right to make unilateral
              modifications to these terms and will provide notice of these
              changes as described below. This Agreement applies to all
              visitors, users, customers, and others who access the Services
              ("Users").
            </Typography>
            <Typography className="page-text">
              PLEASE READ THIS AGREEMENT CAREFULLY TO ENSURE THAT YOU UNDERSTAND
              EACH PROVISION. THIS AGREEMENT CONTAINS A MANDATORY INDIVIDUAL
              ARBITRATION AND CLASS ACTION/JURY TRIAL WAIVER PROVISION THAT
              REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE
              DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              1. Use of Our Services
            </Typography>
            <Typography className="page-text">
              YankiAI provides a platform that enables users of YankiAI'
              Services to submit requests that YankiAI’ third party contractor
              assistants will try to fulfill in a satisfactory and timely
              manner. Many times these requests require YankiAI’ third party
              contractor assistants (“Assistants”) to contact, provide
              information to, and/or purchase from third party providers of
              various services on behalf of a user (each a "Third Party
              Provider").
            </Typography>
            <Typography className="page-text">
              Users of the Service contract for services directly with
              Assistants – YankiAI does not provide the Services directly. The
              Service is a communications platform for enabling connections
              between Users and Assistants. When a User contacts an Assistant,
              the Assistant is acting on the Assistant’s sole behalf and is not
              a representative or agent of YankiAI. Accordingly, please consider
              carefully before your agree to an Assistant’s offered services.
              YankiAI does not have control over the quality, timing, legality,
              failure to provide, or any other aspect whatsoever of any services
              provided by Assistants, nor of the integrity, responsibility or
              any of the actions or omissions whatsoever of any Assistant.
              Company makes no representations about the suitability,
              reliability, timeliness, or accuracy of the services requested and
              provided by Assistants identified through the Service whether in
              public, private, or offline interactions. Company does not provide
              any background checks or vetting. NEITHER COMPANY NOR ITS
              AFFILIATES OR LICENSORS IS RESPONSIBLE FOR THE CONDUCT, WHETHER
              ONLINE OR OFFLINE, OF ANY ASSISTANT OR USER OF THE SERVICE.
              COMPANY AND ITS AFFILIATES AND LICENSORS WILL NOT BE LIABLE FOR
              ANY CLAIM, INJURY OR DAMAGE ARISING IN CONNECTION WITH YOUR USE OF
              THE SERVICE.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                A. Eligibility
              </strong>
            </Typography>

            <Typography className="page-text">
              This is a contract between you and YankiAI. You must read and
              agree to these terms before using the Services. If you do not
              agree, you may not use the Services. You may use the Services only
              if you can form a binding contract with YankiAI, and only in
              compliance with this Agreement and all applicable local, state,
              national, and international laws, rules and regulations.
            </Typography>
            <Typography className="page-text">
              You must be at least 13 years of age to be eligible to use the
              Services. Any use or access to the Services by anyone under 13 is
              strictly prohibited and in violation of this Agreement. Some
              requests may not be made via the Service by users under 18 or 21
              years of age. In certain instances, YankiAI may require you to
              provide proof of identity to create your account, or to access or
              use the Services, and you acknowledge and agree that you may be
              denied access or use of the Services if you refuse to provide such
              proof. The Services are not available to any Users previously
              removed from the Services by YankiAI.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                B. YankiAI Services
              </strong>
            </Typography>
            <Typography className="page-text">
              Subject to the terms and conditions of this Agreement, you are
              hereby granted a non- exclusive, limited, non-transferable, freely
              revocable license to use the Services for your personal,
              noncommercial use only and as permitted by the features of the
              Services. YankiAI reserves all rights not expressly granted herein
              in the Services and the YankiAI Content (as defined below).
              YankiAI may terminate this license at any time for any reason or
              no reason.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                C. YankiAI Accounts
              </strong>
            </Typography>
            <Typography className="page-text">
              Your YankiAI account gives you access to the services and
              functionality that we may establish and maintain from time to time
              and in our sole discretion. We may maintain different types of
              accounts for different types of Users. If you open a YankiAI
              account on behalf of a company, organization, or other entity,
              then (a) "you" includes you and that entity, and (b) you represent
              and warrant that you are an authorized representative of the
              entity with the authority to bind the entity to this Agreement,
              and that you agree to this Agreement on the entity's behalf. By
              connecting to YankiAI with a third-party service, you give us
              permission to access and use your information from that service as
              permitted by that service, and to store your log-in credentials
              for that service. You may never use another User's account without
              permission. When creating your account, you must provide accurate
              and complete information, and you must keep this information up to
              date. Your failure to maintain accurate, complete, and up-to-date
              account information may result in your inability to access and use
              the Services or our termination of this Agreement.
            </Typography>
            <Typography className="page-text">
              You are solely responsible for the activity that occurs on your
              account, and you must keep your account secure. You must notify
              YankiAI immediately of any breach of security or unauthorized use
              of your account. YankiAI will not be liable for any losses caused
              by any unauthorized use of your account.
            </Typography>
            <Typography className="page-text">
              By providing YankiAI your email address you consent to our using
              the email address to send you Services-related notices, including
              any notices required by law, in lieu of communication by postal
              mail. We may also use your email address to send you other
              messages, such as changes to features of the Services and special
              offers. If you do not want to receive such email messages, you may
              opt out by contacting us at{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  pa@yanki.ai.
                </a>
              </strong>
              Opting out may prevent you from receiving email messages regarding
              updates, improvements, or offers.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                D. Services Rules
              </strong>
            </Typography>
            <Typography className="page-text">
              You agree not to engage in any of the following prohibited
              activities: (i) copying, distributing, or disclosing any part of
              the Services in any medium, including without limitation by any
              automated or non-automated "scraping"; (ii) using any automated
              system, including without limitation "robots," "spiders," "offline
              readers," etc., to access the Services (except that YankiAI grants
              the operators of public search engines revocable permission to use
              spiders to copy publically available materials from
              https://www.fancyhands.com for the sole purpose of and solely to
              the extent necessary for creating publicly available searchable
              indices of the materials, but not caches or archives of such
              materials); (iii) transmitting spam, chain letters, or other
              unsolicited email, SMS, or other messages; (iv) attempting to
              interfere with, compromise the system integrity or security or
              decipher any transmissions to or from the servers running the
              Services; (v) taking any action that imposes, or may impose at our
              sole discretion an unreasonable or disproportionately large load
              on our infrastructure; (vi) uploading invalid data, viruses,
              worms, or other software agents through the Services; (vii)
              collecting or harvesting any personally identifiable information,
              including account names, from the Services; (viii) using the
              Services for any commercial solicitation purposes; (ix)
              impersonating another person or otherwise misrepresenting your
              affiliation with a person or entity, conducting fraud, hiding or
              attempting to hide your identity; (x) interfering with the proper
              working of the Services; (xi) accessing any content on the
              Services through any technology or means other than those provided
              or authorized by the Services; or (xii) bypassing the measures we
              may use to prevent or restrict access to the Services, including
              without limitation features that prevent or restrict use or
              copying of any content or enforce limitations on use of the
              Services or the content therein.
            </Typography>

            <Typography className="page-text">
              We may, without prior notice, change the Services; stop providing
              the Services or features of the Services, to you or to Users
              generally; or create usage limits for the Services. We may
              permanently or temporarily terminate or suspend your access to the
              Services without notice and liability for any reason, including if
              in our sole determination you violate any provision of this
              Agreement, or for no reason. Upon termination for any reason or no
              reason, you continue to be bound by this Agreement.
            </Typography>
            <Typography className="page-text">
              You are solely responsible for your interactions with other Users
              and Assistants. We reserve the right, but have no obligation, to
              monitor disputes between you and other Users and/or Assistants.
              YankiAI shall have no liability for your interactions with other
              Users, Assistants, or for any User's action or inaction.
            </Typography>
            <Typography className="page-text">
              Copyright Policy – DMCA Notice. It is our policy to respond to
              alleged infringement notices that comply with the Digital
              Millennium Copyright Act of 1998 ("DMCA"). If you believe that
              your copyrighted work has been copied in a way that constitutes
              copyright infringement and is accessible via the Service, please
              notify our copyright agent as set forth in the DMCA. For your
              complaint to be valid under the DMCA, you must provide the
              following information in writing: (a) An electronic or physical
              signature of a person authorized to act on behalf of the copyright
              owner; (b) Identification of the copyrighted work that you claim
              has been infringed; (c) Identification of the material that is
              claimed to be infringing and where it is located on the Service;
              (d) Information reasonably sufficient to permit us to contact you,
              such as your address, telephone number, and, e-mail address; (e) A
              statement that you have a good faith belief that use of the
              material in the manner complained of is not authorized by the
              copyright owner, its agent, or law; and (f) A statement, made
              under penalty of perjury, that the above information is accurate,
              and that you are the copyright owner or are authorized to act on
              behalf of the owner. The above information must be submitted to
              the following DMCA Agent:
            </Typography>
            <Typography className="page-text">Attn: Copyright Agent</Typography>
            <Typography className="page-text">YankiAI, Inc.</Typography>
            <Typography className="page-text">
              4221 Wilshire Blvd Suite 312
            </Typography>
            <Typography className="page-text">Los Angeles, CA 90010</Typography>

            <Typography className="page-text">
              YankiAI may at its sole discretion limit access to the Service
              and/or terminate the accounts of any Users who infringe any
              intellectual property rights of others, whether or not there is
              any repeat infringement.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              2. Mobile Software
            </Typography>

            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                A. Mobile Software
              </strong>
            </Typography>

            <Typography className="page-text">
              We may make available software to access the Services via a mobile
              device ("Mobile Software"). To use the Mobile Software you must
              have a mobile device that is compatible with the Mobile Software.
              YankiAI does not warrant that the Mobile Software will be
              compatible with your mobile device. You may use mobile data in
              connection with the Mobile Software and may incur additional
              charges from your wireless provider for these services. You agree
              that you are solely responsible for any such charges. YankiAI
              hereby grants you a non-exclusive, non-transferable, revocable
              license to use a compiled code copy of the Mobile Software for one
              YankiAI account on one mobile device owned or leased solely by
              you, for your personal use.
            </Typography>

            <Typography className="page-text">
              You may not: (i) modify, disassemble, decompile or reverse
              engineer the Mobile Software, except to the extent that such
              restriction is expressly prohibited by law; (ii) rent, lease,
              loan, resell, sublicense, distribute or otherwise transfer the
              Mobile Software to any third party or use the Mobile Software to
              provide time sharing or similar services for any third party;
              (iii) make any copies of the Mobile Software; (iv) remove,
              circumvent, disable, damage or otherwise interfere with
              security-related features of the Mobile Software, features that
              prevent or restrict use or copying of any content accessible
              through the Mobile Software, or features that enforce limitations
              on use of the Mobile Software; or (v) delete the copyright and
              other proprietary rights notices on the Mobile Software. You
              acknowledge that YankiAI may from time to time issue upgraded
              versions of the Mobile Software, and may automatically
              electronically upgrade the version of the Mobile Software that you
              are using on your mobile device. You consent to such automatic
              upgrading on your mobile device, and agree that the terms and
              conditions of this Agreement will apply to all such upgrades. Any
              third-party code that may be incorporated in the Mobile Software
              is covered by the applicable open source or third-party license
              EULA, if any, authorizing use of such code. The foregoing license
              grant is not a sale of the Mobile Software or any copy thereof,
              and YankiAI or its third-party partners or suppliers retain all
              right, title, and interest in the Mobile Software (and any copy
              thereof). Any attempt by you to transfer any of the rights, duties
              or obligations hereunder, except as expressly provided for in this
              Agreement, is void. YankiAI reserves all rights not expressly
              granted under this Agreement.
            </Typography>
            <Typography className="page-text">
              If the Mobile Software is being acquired on behalf of the United
              States Government, then the following provision applies. The
              Mobile Software will be deemed to be "commercial computer
              software" and "commercial computer software documentation,"
              respectively, pursuant to DFAR Section 227.7202 and FAR Section
              12.212, as applicable. Any use, reproduction, release,
              performance, display or disclosure of the Services and any
              accompanying documentation by the U.S. Government will be governed
              solely by these Terms of Services and is prohibited except to the
              extent expressly permitted by these Terms of Services. The Mobile
              Software originates in the United States, and is subject to United
              States export laws and regulations. The Mobile Software may not be
              exported or re-exported to certain countries or those persons or
              entities prohibited from receiving exports from the United States.
              In addition, the Mobile Software may be subject to the import and
              export laws of other countries. You agree to comply with all
              United States and foreign laws related to use of the Mobile
              Software and the Services.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                B. Mobile Software from iTunes
              </strong>
            </Typography>
            <Typography className="page-text">
              The following applies to any Mobile Software you acquire from the
              iTunes Store ("iTunes-Sourced Software"): You acknowledge and
              agree that this Agreement is solely between you and YankiAI, not
              Apple, and that Apple has no responsibility for the iTunes-Sourced
              Software or content thereof. Your use of the iTunes- Sourced
              Software must comply with the App Store Terms of Services. You
              acknowledge that Apple has no obligation whatsoever to furnish any
              maintenance and support services with respect to the
              iTunes-Sourced Software. In the event of any failure of the
              iTunes-Sourced Software to conform to any applicable warranty, you
              may notify Apple, and Apple will refund the purchase price for the
              iTunes-Sourced Software to you; to the maximum extent permitted by
              applicable law, Apple will have no other warranty obligation
              whatsoever with respect to the iTunes-Sourced Software, and any
              other claims, losses, liabilities, damages, costs or expenses
              attributable to any failure to conform to any warranty will be
              solely governed by this Agreement and any law applicable to
              YankiAI as provider of the software. You acknowledge that Apple is
              not responsible for addressing any claims of you or any third
              party relating to the iTunes-Sourced Software or your possession
              and/or use of the iTunes- Sourced Software, including, but not
              limited to: (i) product liability claims; (ii) any claim that the
              iTunes-Sourced Software fails to conform to any applicable legal
              or regulatory requirement; and (iii) claims arising under consumer
              protection or similar legislation; and all such claims are
              governed solely by this Agreement and any law applicable to
              YankiAI as provider of the software. You acknowledge that, in the
              event of any third-party claim that the iTunes-Sourced Software or
              your possession and use of that iTunes-Sourced Software infringes
              that third party's intellectual property rights, YankiAI, not
              Apple, will be solely responsible for the investigation, defense,
              settlement and discharge of any such intellectual property
              infringement claim to the extent required by this Agreement. You
              and YankiAI acknowledge and agree that Apple, and Apple's
              subsidiaries, are third-party beneficiaries of this Agreement as
              relates to your license of the iTunes-Sourced Software, and that,
              upon your acceptance of the terms and conditions of this
              Agreement, Apple will have the right (and will be deemed to have
              accepted the right) to enforce this Agreement as relates to your
              license of the iTunes-Sourced Software against you as a
              third-party beneficiary thereof.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              3. Our Proprietary Rights
            </Typography>

            <Typography className="page-text">
              The Services and all materials therein or transferred thereby,
              including, without limitation, software, images, text, graphics,
              illustrations, logos, patents, trademarks, service marks,
              copyrights, photographs, audio, videos, and music (the "YankiAI
              Content"), and all Intellectual Property Rights related thereto,
              are the exclusive property of YankiAI and its licensors. Except as
              explicitly provided herein, nothing in this Agreement shall be
              deemed to create a license in or under any such Intellectual
              Property Rights, and you agree not to sell, license, rent, modify,
              distribute, copy, reproduce, transmit, publicly display, publicly
              perform, publish, adapt, edit or create derivative works from any
              YankiAI Content. Use of the YankiAI Content for any purpose not
              expressly permitted by this Agreement is strictly prohibited.
            </Typography>
            <Typography className="page-text">
              You may choose to or we may invite you to submit comments or ideas
              about the Services, including without limitation about how to
              improve the Services or our products ("Ideas"). By submitting any
              Idea, you agree that your disclosure is gratuitous, unsolicited
              and without restriction and will not place YankiAI under any
              fiduciary or other obligation, and that we are free to use the
              Idea without any additional compensation to you, and/or to
              disclose the Idea on a non-confidential basis or otherwise to
              anyone. You further acknowledge that, by acceptance of your
              submission, YankiAI does not waive any rights to use similar or
              related ideas previously known to YankiAI, or developed by its
              employees, or obtained from sources other than you.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              4. Paid Services
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                A. Billing Policies
              </strong>
            </Typography>

            <Typography className="page-text">
              Certain aspects of the Services may be provided for a fee,
              subscription or other charge. If you purchase a subscription from
              YankiAI, this subscription will automatically renew at the end of
              each billing cycle, typically every thirty (30) days, at which
              point you will automatically be charged for the Services for the
              next billing cycle. YankiAI may add new services for additional
              fees and charges, add or amend fees and charges for existing
              services, at any time in its sole discretion. Any change to our
              pricing or payment terms shall become effective in the billing
              cycle following notice of such change to you as provided in this
              Agreement.
            </Typography>

            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                B. No Refunds
              </strong>
            </Typography>

            <Typography className="page-text">
              You may cancel your YankiAI account or any requests at any time;
              however, you are not entitled to any refund for cancellation,
              including a refund of your unused tasks. YankiAI provides refunds
              for purchases only in YankiAI' sole discretion. In the event that
              YankiAI suspends or terminates your account or this Agreement, you
              understand and agree that you shall receive no refund or exchange
              for any services purchased, any content or data associated with
              your account, or for anything else, except if, in YankiAI' sole
              discretion, YankiAI provides you a refund or exchange.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                C. Payment Information
              </strong>
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                Taxes:
              </strong>{" "}
              All information that you provide in connection with a purchase or
              transaction or other monetary transaction interaction with the
              Services must be accurate, complete, and current. You agree to pay
              all charges incurred by users of your credit card, debit card, or
              other payment method used in connection with a purchase or
              transaction or other monetary transaction interaction with the
              Services at the prices in effect when such charges are incurred.
              You will pay any applicable taxes, if any, relating to any such
              purchases, transactions or other monetary transaction
              interactions.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                D. California Residents.
              </strong>
            </Typography>
            <Typography className="page-text">
              The provider of services is set forth herein. If you are a
              California resident, in accordance with Cal. Civ. Code §1789.3,
              you may report complaints to the Complaint Assistance Unit of the
              Division of Consumer Services of the California Department of
              Consumer Affairs by contacting them in writing at 1625 North
              Market Blvd., Suite N 112 Sacramento, CA 95834, or by telephone at
              (800) 952-5210 or (916) 445-1254.
            </Typography>
            <Typography className="page-text">
              <Typography
                className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
                variant="h5"
                sx={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                5. Privacy
              </Typography>
            </Typography>
            <Typography className="page-text">
              We care about the privacy of our Users. You understand that by
              using the Services you consent to the collection, use and
              disclosure of your personally identifiable information and
              aggregate data as set forth in our Privacy Policy, and to have
              your personally identifiable information collected, used,
              transferred to and processed in the United States.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              6. Security
            </Typography>

            <Typography className="page-text">
              YankiAI cares about the integrity and security of your personal
              information. However, we cannot guarantee that unauthorized third
              parties will never be able to defeat our security measures or use
              your personal information for improper purposes. You acknowledge
              that you provide your personal information at your own risk.
            </Typography>
            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              7. Third-Party Links, Recommendations and Information
            </Typography>
            <Typography className="page-text">
              The Services may contain links, recommendations and information to
              third-party materials that are not owned or controlled by YankiAI.
              YankiAI does not endorse or assume any responsibility for any such
              third-party sites, information, materials, products, or services.
              If you access a third-party website or service, purchase a product
              or service, and/or engage a third-party from the Services, you do
              so at your own risk, and you understand that this Agreement and
              YankiAI' Privacy Policy do not apply to your use of such
              third-party sites, services or products. You expressly relieve
              YankiAI from any and all liability arising from your use of any
              third-party website, service, product or content. Additionally,
              your dealings with or participation in promotions of advertisers
              found on the Services, including payment and delivery of goods,
              and any other terms (such as warranties) are solely between you
              and such advertisers. You agree that YankiAI shall not be
              responsible for any loss or damage of any sort relating to your
              dealings with such advertisers.
            </Typography>
            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              8. Purchases Made On Your Behalf
            </Typography>

            <Typography className="page-text">
              The Services may, from time to time, include making purchases of
              products and services on your behalf from third-parties that are
              not owned or controlled by YankiAI. Currently, we make purchases
              ourselves on your behalf. You are fully responsible for any
              purchases we make on your behalf, and once authorized, payments
              are not cancellable or refundable. YankiAI does not endorse or
              assume any responsibility for any such third-party products,
              services information, materials, representations or warranties. If
              we purchase any information, product or service on your behalf,
              your use of the product or information, or engagement of those
              services, is done so entirely at your own risk, and you understand
              that this Agreement and YankiAI' Privacy Policy do not apply to
              your use of such third-party sites, services or products. You
              expressly relieve YankiAI from any and all liability arising from
              your use or engagement of any third-party website, service,
              product or content YankiAI purchases on your behalf. Additionally,
              your dealings with or participation in promotions of advertisers
              found on the Services, including payment and delivery of goods,
              and any other terms (such as warranties) are solely between you
              and such advertisers. You agree that YankiAI shall not be
              responsible for any loss or damage of any sort relating to your
              dealings with such advertisers.
            </Typography>
            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              9. Indemnity
            </Typography>
            <Typography className="page-text">
              You agree to defend, indemnify and hold harmless YankiAI and its
              subsidiaries, agents, licensors, managers, and other affiliated
              companies, and their employees, contractors, agents, officers and
              directors, from and against any and all claims, damages,
              obligations, losses, liabilities, costs or debt, and expenses
              (including but not limited to attorney's fees) arising from: (i)
              your use of and access to the Services, including any data or
              content transmitted or received by you; (ii) your violation of any
              term of this Agreement, including without limitation your breach
              of any of the representations and warranties above; (iii) your
              violation of any third-party right, including without limitation
              any right of privacy, Intellectual Property Rights, and any rights
              of Third Party Providers; (iv) your violation of any applicable
              law, rule or regulation; (v) any content that is submitted via
              your account including without limitation misleading, false, or
              inaccurate information; (vi) your willful misconduct; or (vii) any
              other party's access and use of the Services with your unique
              username, password or other appropriate security code.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              10. No Warranty
            </Typography>

            <Typography className="page-text">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.
              USE OF THE SERVICE IS AT YOUR OWN RISK. TO THE MAXIMUM EXTENT
              PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED WITHOUT
              WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT
              NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. NO ADVICE OR
              INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM YANKIAI
              OR THROUGH THE SERVICE WILL CREATE ANY WARRANTY NOT EXPRESSLY
              STATED HEREIN. WITHOUT LIMITING THE FOREGOING, YANKIAI, ITS
              SUBSIDIARIES, ITS AFFILIATES, AND ITS LICENSORS DO NOT WARRANT
              THAT THE CONTENT IS ACCURATE, RELIABLE OR CORRECT; THAT THE
              SERVICE WILL MEET YOUR REQUIREMENTS; THAT THE SERVICE WILL BE
              AVAILABLE AT ANY PARTICULAR TIME OR LOCATION, UNINTERRUPTED OR
              SECURE; THAT ANY DEFECTS OR ERRORS WILL BE CORRECTED; THAT ANY
              REQUESTS WILL BE MET SATISFACTORILY OR AT ALL; OR THAT THE SERVICE
              IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. ANY CONTENT
              DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SERVICE IS
              DOWNLOADED AT YOUR OWN RISK AND YOU WILL BE SOLELY RESPONSIBLE FOR
              ANY DAMAGE TO YOUR COMPUTER SYSTEM OR MOBILE DEVICE OR LOSS OF
              DATA THAT RESULTS FROM SUCH DOWNLOAD OR YOUR USE OF THE SERVICE.
            </Typography>
            <Typography className="page-text">
              YANKIAI DOES NOT GUARANTEE THE SUITABILITY, SAFETY, OR ABILITY OF
              ANY THIRD PARTY PROVIDER, NOR THAT ANY SUCH THIRD PARTY PROVIDER
              WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS. YANKIAI DOES NOT
              WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY
              PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH
              THE YANKIAI SERVICE OR ANY HYPERLINKED WEBSITE OR SERVICE, AND
              YANKIAI WILL NOT BE A PARTY TO OR IN ANY WAY MONITOR ANY
              TRANSACTION BETWEEN YOU AND PROVIDERS OF SUCH THIRD PARTY PRODUCTS
              OR SERVICES.
            </Typography>
            <Typography className="page-text">
              FEDERAL LAW, SOME STATES, PROVINCES AND OTHER JURISDICTIONS DO NOT
              ALLOW THE EXCLUSION AND LIMITATIONS OF CERTAIN IMPLIED WARRANTIES,
              SO THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU. THIS AGREEMENT GIVES
              YOU SPECIFIC LEGAL RIGHTS, AND YOU MAY ALSO HAVE OTHER RIGHTS
              WHICH VARY FROM STATE TO STATE. THE DISCLAIMERS AND EXCLUSIONS
              UNDER THIS AGREEMENT WILL NOT APPLY TO THE EXTENT PROHIBITED BY
              APPLICABLE LAW.
            </Typography>
            <Typography className="page-text">
              Third-Party Services In utilizing the YankiAI platform, users may
              engage with or be directed to services, content, and products
              provided by third parties. YankiAI facilitates access to these
              third-party offerings as a convenience to our users and aims to
              enhance their overall experience. However, it is important for
              users to understand the following stipulations regarding
              third-party services:Quality and Performance: YankiAI does not
              have control over the quality, safety, reliability, or performance
              of any products, services, or content provided by third parties.
              The inclusion of or access to third-party services through YankiAI
              does not imply an endorsement or guarantee of the service quality
              or performance. Users engage with third-party services at their
              own risk.Responsibility: YankiAI expressly disclaims any
              responsibility for any harm, loss, or damage of any kind arising
              from or related to interactions with third-party services,
              including but not limited to the purchase, use, or reliance on any
              third-party products, services, or content.User Due Diligence:
              Users are encouraged to conduct their own research and exercise
              due diligence before engaging with any third-party providers
              encountered through the YankiAI platform. This includes reviewing
              the third party's terms of service, privacy policies, and any
              other relevant information.Disputes with Third Parties: YankiAI is
              not responsible for resolving any disputes between users and
              third-party providers. This includes disputes related to product
              quality, service performance, billing, and any other aspects of
              the third-party engagement. Users must address their concerns
              directly with the third-party provider in question.No Warranties:
              YankiAI makes no warranties, express or implied, regarding the
              third-party services accessed through our platform. This includes
              any implied warranties of merchantability, fitness for a
              particular purpose, or non-infringement.Limitation of Liability:
              Under no circumstances will YankiAI be liable for any direct,
              indirect, incidental, special, consequential, or exemplary damages
              arising from or related to the use of third-party services
              accessed through the YankiAI platform.By using the YankiAI
              platform, users acknowledge and agree to these terms regarding
              third-party services. YankiAI's provision of access to such
              services does not constitute an endorsement of the third parties
              or their offerings and is provided on an "as is" basis for user
              convenience only.These terms are intended to be part of the
              broader Terms of Use for the YankiAI platform and should be read
              in conjunction with the other sections of the document.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              11. Limitation of Liability
            </Typography>

            <Typography className="page-text">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL YANKIAI, ITS AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES,
              SUPPLIERS OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING
              WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE,
              DATA OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE
              USE OF, OR INABILITY TO USE, THIS SERVICE. UNDER NO CIRCUMSTANCES
              WILL YANKIAI BE RESPONSIBLE FOR ANY DAMAGE, LOSS OR INJURY
              RESULTING FROM HACKING, TAMPERING OR OTHER UNAUTHORIZED ACCESS OR
              USE OF THE SERVICE OR YOUR ACCOUNT OR THE INFORMATION CONTAINED
              THEREIN.
            </Typography>
            <Typography className="page-text">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, YANKIAI ASSUMES
              NO LIABILITY OR RESPONSIBILITY FOR ANY (I) ERRORS, MISTAKES, OR
              INACCURACIES OF REQUESTS OR CONTENT; (II) PERSONAL INJURY OR
              PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR
              ACCESS TO OR USE OF OUR SERVICE; (III) ANY UNAUTHORIZED ACCESS TO
              OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL
              INFORMATION STORED THEREIN; (IV) ANY INTERRUPTION OR CESSATION OF
              TRANSMISSION TO OR FROM THE SERVICE; (V) ANY BUGS, VIRUSES, TROJAN
              HORSES, OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH OUR
              SERVICE BY ANY THIRD PARTY; (VI) ANY ERRORS OR OMISSIONS IN ANY
              REQUESTS OR CONTENT OR FOR ANY LOSS OR DAMAGE INCURRED AS A RESULT
              OF THE USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR
              OTHERWISE MADE AVAILABLE THROUGH THE SERVICE; (VII) THE
              DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY THIRD PARTY;
              AND/OR (VIII) ANY TRANSACTION OR RELATIONSHIP BETWEEN YOU AND ANY
              THIRD PARTY PROVIDER. IN NO EVENT SHALL YANKIAI, ITS AFFILIATES,
              AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS, OR LICENSORS BE LIABLE TO
              YOU FOR ANY CLAIMS, PROCEEDINGS, LIABILITIES, OBLIGATIONS,
              DAMAGES, LOSSES OR COSTS IN AN AMOUNT EXCEEDING THE AMOUNT YOU
              PAID TO YANKIAI HEREUNDER OR $100.00, WHICHEVER IS GREATER. THIS
              LIMITATION OF LIABILITY SECTION APPLIES WHETHER THE ALLEGED
              LIABILITY IS BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT
              LIABILITY, OR ANY OTHER BASIS, EVEN IF YANKIAI HAS BEEN ADVISED OF
              THE POSSIBILITY OF SUCH DAMAGE. THE FOREGOING LIMITATION OF
              LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW IN
              THE APPLICABLE JURISDICTION. SOME STATES DO NOT ALLOW THE
              EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO
              THE ABOVE LIMITATIONS OR EXCLUSIONS MAY NOT APPLY TO YOU. THIS
              AGREEMENT GIVES YOU SPECIFIC LEGAL RIGHTS, AND YOU MAY ALSO HAVE
              OTHER RIGHTS WHICH VARY FROM STATE TO STATE. THE DISCLAIMERS,
              EXCLUSIONS, AND LIMITATIONS OF LIABILITY UNDER THIS AGREEMENT WILL
              NOT APPLY TO THE EXTENT PROHIBITED BY APPLICABLE LAW.
            </Typography>

            <Typography className="page-text">
              The Services are controlled and operated from facilities in the
              United States and other countries. YankiAI makes no
              representations that the Services are appropriate or available for
              use in other locations. Those who access or use the Services from
              other jurisdictions do so at their own volition and are entirely
              responsible for compliance with all applicable United States and
              local laws and regulations, including but not limited to export
              and import regulations. You may not use the Services if you are a
              resident of a country embargoed by the United States, or are a
              foreign person or entity blocked or denied by the United States or
              any other government. Unless otherwise explicitly stated, all
              materials found on the Services are solely directed to
              individuals, companies, or other entities located in the United
              States.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              12. Governing Law, Arbitration, and Class Action/Jury Trial Waiver
            </Typography>

            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                A. Governing Law
              </strong>
            </Typography>

            <Typography className="page-text">
              You agree that: (i) the Services shall be deemed solely based in
              Los Angeles, CA; and (ii) the Services shall be deemed a passive
              one that does not give rise to personal jurisdiction over us,
              either specific or general, in jurisdictions other than Los
              Angeles, CA. This Agreement shall be governed by the internal
              substantive laws of the State of Los Angeles, CA, without respect
              to its conflict of laws principles. The parties acknowledge that
              this Agreement evidences a transaction involving interstate
              commerce. Notwithstanding the preceding sentences with respect to
              the substantive law, any arbitration conducted pursuant to the
              terms of this Agreement shall be governed by the Federal
              Arbitration Act (9 U.S.C. §§ 1-16). The application of the United
              Nations Convention on Contracts for the International Sale of
              Goods is expressly excluded. You agree to submit to the personal
              jurisdiction of the federal and state courts located in Los
              Angeles, CA, Los Angeles, CA for any actions for which we retain
              the right to seek injunctive or other equitable relief in a court
              of competent jurisdiction to prevent the actual or threatened
              infringement, misappropriation or violation of a our copyrights,
              trademarks, trade secrets, patents, or other intellectual property
              or proprietary rights, as set forth in the Arbitration provision
              below, including any provisional relief required to prevent
              irreparable harm. You agree that Los Angeles, CA, Los Angeles, CA
              is the proper forum for any appeals of an arbitration award or for
              trial court proceedings in the event that the arbitration
              provision below is found to be unenforceable.
            </Typography>
            <Typography className="page-text"></Typography>
            <Typography className="page-text">
              <Typography className="page-text">
                <strong
                  style={{
                    color: activeTab === 0 ? "#fff" : "#6fa8dd",
                  }}
                >
                  B. Arbitration
                </strong>
              </Typography>
              READ THIS SECTION CAREFULLY BECAUSE IT REQUIRES THE PARTIES TO
              ARBITRATE THEIR DISPUTES AND LIMITS THE MANNER IN WHICH YOU CAN
              SEEK RELIEF FROM YANKIAI. For any dispute with YankiAI, you agree
              to first contact us at{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  pa@yanki.ai
                </a>
              </strong>
              and attempt to resolve the dispute with us informally. In the
              unlikely event that YankiAI has not been able to resolve a dispute
              it has with you after sixty (60) days, we each agree to resolve
              any claim, dispute, or controversy (excluding any claims for
              injunctive or other equitable relief as provided below) arising
              out of or in connection with or relating to this Agreement, or the
              breach or alleged breach thereof (collectively, "Claims"), by
              binding arbitration by JAMS, under the Optional Expedited
              Arbitration Procedures then in effect for JAMS, except as provided
              herein. JAMS may be contacted at www.jamsadr.com. The arbitration
              will be conducted in Los Angeles, CA, Los Angeles, CA, unless you
              and YankiAI agree otherwise. If you are using the Services for
              commercial purposes, each party will be responsible for paying any
              JAMS filing, administrative and arbitrator fees in accordance with
              JAMS rules, and the award rendered by the arbitrator shall include
              costs of arbitration, reasonable attorneys' fees and reasonable
              costs for expert and other witnesses. If you are an individual
              using the Services for non- commercial purposes: (i) JAMS may
              require you to pay a fee for the initiation of your case, unless
              you apply for and successfully obtain a fee waiver from JAMS; (ii)
              the award rendered by the arbitrator may include your costs of
              arbitration, your reasonable attorney's fees, and your reasonable
              costs for expert and other witnesses; and (iii) you may sue in a
              small claims court of competent jurisdiction without first
              engaging in arbitration, but this does not absolve you of your
              commitment to engage in the informal dispute resolution process.
              Any judgment on the award rendered by the arbitrator may be
              entered in any court of competent jurisdiction. Nothing in this
              Section shall be deemed as preventing YankiAI from seeking
              injunctive or other equitable relief from the courts as necessary
              to prevent the actual or threatened infringement,
              misappropriation, or violation of our data security, Intellectual
              Property Rights or other proprietary rights.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                C. Class Action/Jury Trial Waiver
              </strong>
            </Typography>
            <Typography className="page-text">
              WITH RESPECT TO ALL PERSONS AND ENTITIES, REGARDLESS OF WHETHER
              THEY HAVE OBTAINED OR USED THE SERVICE FOR PERSONAL, COMMERCIAL OR
              OTHER PURPOSES, ALL CLAIMS MUST BE BROUGHT IN THE PARTIES'
              INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
              PURPORTED CLASS ACTION, COLLECTIVE ACTION, PRIVATE ATTORNEY
              GENERAL ACTION OR OTHER REPRESENTATIVE PROCEEDING. THIS WAIVER
              APPLIES TO CLASS ARBITRATION, AND, UNLESS WE AGREE OTHERWISE, THE
              ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS. YOU
              AGREE THAT, BY ENTERING INTO THIS AGREEMENT, YOU AND YANKIAI ARE
              EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A
              CLASS ACTION, COLLECTIVE ACTION, PRIVATE ATTORNEY GENERAL ACTION,
              OR OTHER REPRESENTATIVE PROCEEDING OF ANY KIND.
            </Typography>

            <Typography
              className={`page-title ${activeTab === 0 ? "white-color" : "lightBlue-color"}`}
              variant="h5"
            >
              13. General
            </Typography>

            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                A. Assignment
              </strong>
            </Typography>

            <Typography className="page-text">
              This Agreement, and any rights and licenses granted hereunder, may
              not be transferred or assigned by you, but may be assigned by
              YankiAI without restriction. Any attempted transfer or assignment
              in violation hereof shall be null and void.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                B. Notification Procedures and Changes to the Agreement.
              </strong>
            </Typography>
            <Typography className="page-text">
              YankiAI may provide notifications, whether such notifications are
              required by law or are for marketing or other business related
              purposes, to you via email notice, written or hard copy notice, or
              through posting of such notice on our website, as determined by
              YankiAI in our sole discretion. YankiAI reserves the right to
              determine the form and means of providing notifications to our
              Users, provided that you may opt out of certain means of
              notification as described in this Agreement. YankiAI is not
              responsible for any automatic filtering you or your network
              provider may apply to email notifications we send to the email
              address you provide us. YankiAI may, in its sole discretion,
              modify or update this Agreement from time to time, and so you
              should review this page periodically. When we change the Agreement
              in a material manner, we will update the ‘last modified' date at
              the bottom of this page. Your continued use of the Services after
              any such change constitutes your acceptance of the new Terms of
              Use. If you do not agree to any of these terms or any future Terms
              of Use, do not use or access (or continue to access) the Services.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                C. Entire Agreement/Severability.
              </strong>
            </Typography>
            <Typography className="page-text">
              This Agreement, together with any amendments and any additional
              agreements you may enter into with YankiAI in connection with the
              Services, shall constitute the entire agreement between you and
              YankiAI concerning the Services. If any provision of this
              Agreement is deemed invalid by a court of competent jurisdiction,
              the invalidity of such provision shall not affect the validity of
              the remaining provisions of this Agreement, which shall remain in
              full force and effect, except that in the event of
              unenforceability of the universal Class Action/Jury Trial Waiver,
              the entire arbitration agreement shall be unenforceable.
            </Typography>

            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                D. Religious Responsibility and Certifications
              </strong>
            </Typography>

            <Typography className="page-text">
              YankiAI prides itself on facilitating access to a wide range of
              services, including those related to religious observances and
              kosher certifications. However, Yanki does not assume religious
              responsibility for the outcome of these services. Users should
              note that while we strive to provide accurate and up-to-date
              information, the responsibility to ensure that any kosher or other
              religious certifications meet their specific requirements rests
              with the user. We encourage users to verify the current compliance
              status of any certifications directly with the certifying
              authorities. Reservation of Rights: YankiAI reserves the right to
              reject any task requested by users through our platform. This
              decision may be based on various factors, including but not
              limited to, the nature of the task, our capacity to fulfill the
              request, and compliance with our operational policies and ethical
              standards based on the Jewish laws among others.
            </Typography>

            <Typography className="page-text">
              Limitations on Task Duration: In our effort to efficiently manage
              resources and provide equitable service to all our users, YankiAI
              reserves the right to reject tasks that are estimated to take
              longer than 30 minutes to complete. This measure ensures our
              ability to maintain a high level of service and responsiveness to
              all user requests. By using the YankiAI platform, users
              acknowledge and agree to these terms, understanding that while
              Yanki aims to provide valuable and convenient services, certain
              limitations and responsibilities are inherent to the nature of
              these offerings.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                E. No Waiver
              </strong>
            </Typography>
            <Typography className="page-text">
              No waiver of any term of this Agreement shall be deemed a further
              or continuing waiver of such term or any other term, and YankiAI'
              failure to assert any right or provision under this Agreement
              shall not constitute a waiver of such right or provision.
            </Typography>
            <Typography className="page-text">
              <strong
                style={{
                  color: activeTab === 0 ? "#fff" : "#6fa8dd",
                }}
              >
                F. Contact
              </strong>
            </Typography>
            <Typography className="page-text">
              Please contact us at{" "}
              <strong>
                <a
                  className="page-link"
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  pa@yanki.ai
                </a>
              </strong>
              with any questions regarding this Agreement. This Agreement was
              last modified on March 12th 2024
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

export default TermsOfUse;
