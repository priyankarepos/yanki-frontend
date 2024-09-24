import React from 'react';
import { Box, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import './SubscriptionCard.scss';
import { Context } from '../../App';
import { useTranslation } from "react-i18next";
import { classNames } from '../../Utils/stringConstant/stringConstant';

const SubscriptionCard = ({ tier, message, onClick, task, taskCost, isSubscribed, price, isPlanSubscribed, upgradeLoading, isPaymentDecline, handleDeclinedPayment, handleUpgradeCancelPlan, isDowngrade, isUpgrade, isSubscriptionCanceled, isCustomerPlatform }) => {
  const { t } = useTranslation();
  const { activeTab } = React.useContext(Context);
  const getClassNames = () => {
    let className = activeTab === 0 ? 'subscription-card' : 'subscription-card-light';
    if (isSubscribed) {
      className += ' Subscribed-Active-Card';
    }
    return className;
  };

  const isButtonEnabled = isCustomerPlatform === classNames.commonText || isCustomerPlatform === classNames.webText;

  const cardClassName = getClassNames();
  return (
    <Grid item xs={12} sm={6} md={4} lg={4} className='subscription-card-wrapper'>
      <Box className={cardClassName}>
        <Typography variant="h6" className="tier-name">{tier}</Typography>
        <Typography variant="h6" className="tier-name tier-price">${price}/<span>{t('perMonth')}</span></Typography>
        <ul className="description-list">
          <li className="description-item"><strong>{t('messages')} </strong>{message}</li>
          <li className="description-item"><strong>{t('personalTasks')} </strong>{task}</li>
          <Divider className="table-devider"></Divider>
          <li className="description-item"><strong>{t('additionalTaskColon')} </strong>{taskCost}</li>
        </ul>
        {!isPlanSubscribed && !isPaymentDecline ? (
          <Button onClick={onClick} variant="contained" className="subscribe-btn" disabled={isSubscribed || upgradeLoading || !isButtonEnabled}>
            {upgradeLoading ? <CircularProgress size={24} /> : `${t('subscribe')}`}
          </Button>
        ) : isPaymentDecline && !isPlanSubscribed ? (
          <Button onClick={handleDeclinedPayment} variant="contained" className="subscribe-btn" disabled={upgradeLoading || isPlanSubscribed || !isButtonEnabled}>
            {upgradeLoading ? <CircularProgress size={24} /> : isSubscribed ? `${t('tryAgain')}` : `${t('subscribe')}`}
          </Button>
        ) : (
          <Button onClick={handleUpgradeCancelPlan} variant="contained" className="subscribe-btn" disabled={upgradeLoading || !isButtonEnabled}>
            {upgradeLoading ? (
              <CircularProgress size={24} />
            ) : (
              isSubscribed && !isSubscriptionCanceled ? (
                `${t('cancelPlan')}`
              ) : (
                isSubscriptionCanceled && isSubscribed ? (
                  `${t('renewPlan')}`
                ) : (
                  isDowngrade ? (
                    `${t('downgradePlan')}`
                  ) : (
                    isUpgrade ? (
                      `${t('upgradePlan')}`
                    ) : (
                      ""
                    )
                  )
                )
              )
            )}
          </Button>
        )}
        <Typography className={classNames.platformDisableText}>{!isButtonEnabled && t('platformManageSubscription', { platform: isCustomerPlatform })}</Typography>
      </Box>
    </Grid>
  );
};

export default SubscriptionCard;