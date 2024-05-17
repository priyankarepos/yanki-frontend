import React from 'react';
import { Box, Button, Grid, Typography } from "@mui/material";
import './SubscriptionCard.scss';
import { Context } from '../../App';

const SubscriptionCard = ({ tier, message, onClick, task, taskCost, isSubscribed, price, isPlanSubscribed }) => {
  const { activeTab } = React.useContext(Context);
  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Box className={activeTab === 0 ? 'subscription-card' : 'subscription-card-light'}>
        <Typography variant="h6" className="tier-name">{tier}</Typography>
        <Typography variant="h6" className="tier-name tier-price">${price}</Typography>
        <ul className="description-list">
          <li className="description-item">{message}</li>
          <li className="description-item">{task}</li>
          <li className="description-item">{taskCost}</li>
        </ul>
        <Button onClick={onClick} variant="contained" className="subscribe-btn" disabled={isSubscribed}>
          {(isPlanSubscribed ? (isSubscribed ? "Current Plan" : "Upgrade Plan") : "Subscribe")}
        </Button>
      </Box>
    </Grid>
  );
};

export default SubscriptionCard;