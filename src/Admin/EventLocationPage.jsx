import React, { useContext } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import AdminAddEventLocation from './AddEventLocation/AddEventLocation';
import AdminAddEventPublicationArea from './AddEventLocation/AddEventPublicationArea';
import AdminDashboard from './AdminDashboard';
import { Context } from '../App';
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import AdminAddEventType from './AddEventLocation/AddEventType';
import "./AdminStyle.css";

const styles = {
    content: {
        flex: 1,
        padding: '16px',
        marginLeft: '0',
        transition: 'margin-left 0.3s',
    },
};

const EventLocationPage = () => {
    const { drawerOpen } = useContext(Context);


    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <Box style={{ display: "flex" }}>
            <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
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
    )
}

export default EventLocationPage;
