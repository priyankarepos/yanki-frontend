import React from 'react';
import { Box, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import './SubscriptionCard.scss';
import { Context } from '../../App';

const SubscriptionCard = ({ tier, message, onClick, task, taskCost, isSubscribed, price, isPlanSubscribed, upgradeLoading, isPaymentDecline, handleDeclinedPayment, handleUpgradeCancelPlan, isDowngrade, isUpgrade, isSubscriptionCanceled }) => {
  const { activeTab } = React.useContext(Context);
  const getClassNames = () => {
    let className = activeTab === 0 ? 'subscription-card' : 'subscription-card-light';
    if (isSubscribed) {
      className += ' Subscribed-Active-Card';
    }
    return className;
  };

  const cardClassName = getClassNames();
  return (
    <Grid item xs={12} sm={6} md={4} lg={4} className='subscription-card-wrapper'>
      <Box className={cardClassName}>
        <Typography variant="h6" className="tier-name">{tier}</Typography>
        <Typography variant="h6" className="tier-name tier-price">${price}/<span>per month</span></Typography>
        <ul className="description-list">
          <li className="description-item"><strong>Messages: </strong>{message}</li>
          <li className="description-item"><strong>Personal Tasks: </strong>{task}</li>
          <Divider className="table-devider"></Divider>
          <li className="description-item"><strong>Additional Task: </strong>{taskCost}</li>
        </ul>
        {!isPlanSubscribed && !isPaymentDecline ? (
          <Button onClick={onClick} variant="contained" className="subscribe-btn" disabled={isSubscribed || upgradeLoading}>
            {upgradeLoading ? <CircularProgress size={24} /> : "Subscribe"}
          </Button>
        ) : isPaymentDecline && !isPlanSubscribed ? (
          <Button onClick={handleDeclinedPayment} variant="contained" className="subscribe-btn" disabled={upgradeLoading || isPlanSubscribed}>
            {upgradeLoading ? <CircularProgress size={24} /> : isSubscribed ? "Try Again" : "Subscribe"}
          </Button>
        ) : (
          <Button onClick={handleUpgradeCancelPlan} variant="contained" className="subscribe-btn" disabled={upgradeLoading}>
            {upgradeLoading ? (
              <CircularProgress size={24} />
            ) : (
              isSubscribed && !isSubscriptionCanceled ? (
                "Cancel Plan"
              ) : (
                isSubscriptionCanceled && isSubscribed ? (
                  "Renew Plan"
                ) : (
                  isDowngrade ? (
                    "Downgrade Plan"
                  ) : (
                    isUpgrade ? (
                      "Upgrade Plan"
                    ) : (
                      ""
                    )
                  )
                )
              )
            )}
          </Button>
        )}
      </Box>
    </Grid>
  );
};

export default SubscriptionCard;