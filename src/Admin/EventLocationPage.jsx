import React, { useContext } from "react";
import { Box, useMediaQuery } from "@mui/material";
import AdminAddEventLocation from "./AddEventLocation/AddEventLocation";
import AdminAddEventPublicationArea from "./AddEventLocation/AddEventPublicationArea";
import AdminDashboard from "./AdminDashboard";
import { Context } from "../App";
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import AdminAddEventType from "./AddEventLocation/AddEventType";
import "./AdminStyle.css";

const EventLocationPage = () => {
  const { drawerOpen } = useContext(Context);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box className="event-request-container">
      <Box sx={{ width: drawerOpen && !isSmallScreen ? "270px" : "0" }}>
        <AdminDashboard />
      </Box>
      <Box
        className="enterpriseFormBox"
        sx={{ width: drawerOpen ? "calc(100% - 270px)" : "100%" }}
      >
        <div className="add-eventpadding">
          <AdminAddEventLocation />
          <br />
          <br />
          <AdminAddEventPublicationArea />
          <br />
          <br />
          <AdminAddEventType />
        </div>
      </Box>
    </Box>
  );
};

export default EventLocationPage;
