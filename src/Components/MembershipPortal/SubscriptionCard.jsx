import React from 'react';
import { Box, Button, CircularProgress, Grid, Tooltip, Typography } from "@mui/material";
import './SubscriptionCard.scss';
import { Context } from '../../App';

const SubscriptionCard = ({ tier, message, onClick, task, taskCost, isSubscribed, price, isPlanSubscribed, upgradeLoading }) => {
  const { activeTab } = React.useContext(Context);
  const upgradeTooltipText = "To upgrade your plan, you need to cancel your current plan first, and then subscribe again to the desired plan.";
  const getClassNames = () => {
    let className = activeTab === 0 ? 'subscription-card' : 'subscription-card-light';
    if (isSubscribed) {
      className += ' Subscribed-Active-Card';
    }
    return className;
  };

  const cardClassName = getClassNames();
  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Box className={cardClassName}>
        <Typography variant="h6" className="tier-name">{tier}</Typography>
        <Typography variant="h6" className="tier-name tier-price">${price}</Typography>
        <ul className="description-list">
          <li className="description-item">{message}</li>
          <li className="description-item">{task}</li>
          <li className="description-item">{taskCost}</li>
        </ul>
        {!isPlanSubscribed ? <Button onClick={onClick} variant="contained" className="subscribe-btn" disabled={isSubscribed || upgradeLoading}>
          {upgradeLoading ? <CircularProgress size={24} /> : "Subscribe"}
        </Button> :
          <Tooltip title={!isSubscribed ? upgradeTooltipText : ''} disableHoverListener={isSubscribed || upgradeLoading}>
            <span className='subscribe-btn-tooltip'>
              <Button onClick={onClick} variant="contained" className="subscribe-btn" disabled={!isSubscribed || upgradeLoading}>
                {upgradeLoading ? <CircularProgress size={24} /> : (isSubscribed ? "Cancel Plan" : "Upgrade Plan")}
              </Button>
            </span>
          </Tooltip>}
      </Box>
    </Grid>
  );
};

export default SubscriptionCard;