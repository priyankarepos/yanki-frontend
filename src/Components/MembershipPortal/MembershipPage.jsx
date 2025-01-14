import React, { useEffect, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Snackbar,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import "./MembershipStyle.scss";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTranslation } from "react-i18next";
import { membershipApiUrls } from "../../Utils/stringConstant/stringConstant";

const MembershipPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);
  const [reversedProducts, setReversedProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const [updateCustomerId, setUpdateCustomerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [remainingMsgData, setRemainingMsgData] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);

  const fetchRemainingMessage = async () => {
    try {
      const response = await axios.get(membershipApiUrls.getRemainingMessageTask);

      if (response.status === 200) {
        setRemainingMsgData(response.data);
      } else {
        throw new Error("Failed to fetch remaining data");
      }
    } catch (error) {
      setSnackbarMessage("Error fetching data: " + error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchRemainingMessage();
  }, []);

  useEffect(() => {
    const yankiUser = window.localStorage.getItem(
      import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
    );
    if (yankiUser) {
      const parsedUserObject = JSON.parse(yankiUser);
      setUserId(parsedUserObject?.userObject?.userId || "");
    }
  }, []);

  useEffect(() => {
    const yankiUser = window.localStorage.getItem(
      import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
    );
    if (yankiUser) {
      const parsedUserObject = JSON.parse(yankiUser);
      setUserId(parsedUserObject?.userObject?.userId || "");
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const reversedProducts = [...products].reverse();
      setReversedProducts(reversedProducts);
    }
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(membershipApiUrls.getAllProducts);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setSnackbarMessage("Error fetching products:", error);
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, []);

  const handleCreateCustomer = async (priceId) => {
    try {
      setLoadingProductId(priceId);
      const response = await axios.post(
        membershipApiUrls.createCustomer(userId),
        { priceId }
      );
      const customerId = response.data;
      const paymentResponse = await axios.post(
        membershipApiUrls.subscribeProductPlan,
        { priceId, customerId }
      );
      const paymentUrl = paymentResponse.data;
      window.location.href = paymentUrl;
    } catch (error) {
      setLoadingProductId(null);
    }
  };

  useEffect(() => {
    const fetchUpdateCustomerId = async () => {
      try {
        const response = await axios.get(membershipApiUrls.getCustomerId);
        setUpdateCustomerId(response.data);
      } catch (error) {
        setSnackbarMessage("Error fetching data:", error);
        setSnackbarOpen(true);
      }
    };

    fetchUpdateCustomerId();
  }, []);

  const handleUpdateSubscriptionPlan = async (priceId) => {
    try {
      setLoadingProductId(priceId);
      const queryString = `${updateCustomerId.customerId}`;
      const response = await axios.post(
        membershipApiUrls.createCustomerPortal(queryString)
      );
      const paymentUrl = response.data;
      window.location.href = paymentUrl;
      setSnackbarMessage("Subscription plan updated successfully:");
      setSnackbarOpen(false);
    } catch (error) {
      setSnackbarMessage("Error updating subscription plan:", error);
      setSnackbarOpen(true);
      setLoadingProductId(null);
    }
  };

  const handleDeclinedPayment = async (priceId) => {
    try {
      setLoadingProductId(priceId);
      const queryString = `${updateCustomerId.customerId}`;
      const response = await axios.post(
        membershipApiUrls.createCustomerPortal(queryString)
      );
      const paymentUrl = response.data;
      window.location.href = paymentUrl;
      setSnackbarMessage("Payment done successfuly");
      setSnackbarOpen(false);
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
      setLoadingProductId(null);
    }
  };

  const handleUpgradePlan = async (priceId) => {
    try {
      setLoadingProductId(priceId);
      const response = await axios.post(
        membershipApiUrls.upgradeSubscription(priceId)
      );
      const paymentUrl = response.data;
      window.location.href = paymentUrl;
    } catch (error) {
      setSnackbarMessage("Error upgrading subscription plan:", error);
      setSnackbarOpen(true);
      setLoadingProductId(null);
    }
    setLoadingProductId(null);
  };

  const handleDowngradePlan = async (priceId) => {
    try {
      setLoadingProductId(priceId);
      const response = await axios.post(
        membershipApiUrls.downgradeSubscription(priceId)
      );
      const paymentUrl = response.data;
      setSnackbarMessage(paymentUrl);
      setSnackbarOpen(true);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
      setSnackbarMessage("Error downgrade subscription plan:", error);
      setSnackbarOpen(true);
      setLoadingProductId(null);
    }
    setLoadingProductId(null);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleIncrement = () => {
    if (quantity < 5) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleBuyTask = async () => {
    try {
      const price = reversedProducts
        .filter(
          (item) => item.name !== "Additional Task" && item.isActive === true
        )
        .reduce((acc, product) => {
          const price = parseFloat(
            product.thirdDescription.match(/\d+(\.\d+)?/)[0]
          );
          return acc + price;
        }, 0);
      const buyTaskBody = {
        customerId: updateCustomerId.customerId,
        price: price,
        quantity: quantity,
      };
      const response = await axios.post(membershipApiUrls.paymentForAdditionalTask, buyTaskBody);
      if (response.status === 200) {
        const taskPaymentUrl = response.data;
        window.location.href = taskPaymentUrl;
        setSnackbarMessage("Process your payment");
        setSnackbarOpen(false);
      } else {
        setSnackbarMessage("Payment failed. Please try again.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Network error, please try again later.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <Paper sx={{ p: 2 }}>
        <Box className="subscription-page">
          <Box className="membership-heading-wrapper">
            <Typography variant="h5" sx={{ my: 2 }}>
              {t('subscriptionPageTitle')}
            </Typography>
            {updateCustomerId?.isPlanSubscribed && <Typography className="subscribe-link">
              <span onClick={handleUpdateSubscriptionPlan}>
              {t('viewPlanDetails')}
              </span>
            </Typography>}
          </Box>
          {(remainingMsgData?.totalMessageLeft <= 0 ||
            remainingMsgData?.totalTaskLeft <= 0) &&
            updateCustomerId?.isPlanSubscribed && (
              <Typography sx={{ my: 2 }}>
                {t('limitReached')}
              </Typography>
            )}
          <Grid container spacing={2} alignItems="center">
            {loading ? (
              <Typography className="membership-data-loader">
                <CircularProgress />
              </Typography>
            ) : (
              reversedProducts
                .filter((item) => item.name !== "Additional Task")
                .map((product) => (
                  <SubscriptionCard
                    key={product.defaultPriceId}
                    tier={product.name}
                    message={product.firstDescription}
                    task={product.secondDescription}
                    taskCost={product.thirdDescription}
                    price={product.price}
                    isSubscribed={product.isActive}
                    isPlanSubscribed={updateCustomerId?.isPlanSubscribed}
                    onClick={() => handleCreateCustomer(product.defaultPriceId)}
                    handleDeclinedPayment={() =>
                      !updateCustomerId?.isPlanSubscribed &&
                        updateCustomerId?.isPaymentDecline &&
                        product.isActive
                        ? handleDeclinedPayment(product.defaultPriceId)
                        : handleCreateCustomer(product.defaultPriceId)
                    }
                    upgradeLoading={loadingProductId === product.defaultPriceId}
                    isPaymentDecline={updateCustomerId?.isPaymentDecline}
                    handleUpgradeCancelPlan={() =>
                      product?.isUpgrade
                        ? handleUpgradePlan(product.defaultPriceId)
                        : product?.isDowngrade
                          ? handleDowngradePlan(product.defaultPriceId)
                          : (product?.isActive ||
                            updateCustomerId?.isSubscriptionCanceled) &&
                            !product?.isDowngrade &&
                            !product?.isUpgrade
                            ? handleUpdateSubscriptionPlan(product.defaultPriceId)
                            : null
                    }
                    isDowngrade={product?.isDowngrade}
                    isUpgrade={product?.isUpgrade}
                    isSubscriptionCanceled={
                      updateCustomerId?.isSubscriptionCanceled
                    }
                    isCustomerPlatform = {updateCustomerId?.platform}
                  />
                ))
            )}
          </Grid>
          {updateCustomerId?.isPlanSubscribed && (
            <Box className="taskPurchaseContainer">
              <Typography variant="h5" className="taskPurchaseHeader">
              {t('purchaseAdditionalTasks')}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm="auto">
                  <Typography className="taskPurchaseText">
                  {t('additionalTask')} $
                    {reversedProducts
                      .filter(
                        (item) =>
                          item.name !== "Additional Task" &&
                          item.isActive === true
                      )
                      .map((product) => {
                        const price =
                          product.thirdDescription.match(/\d+(\.\d+)?/);
                        return price ? price[0] : null;
                      })}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm="auto">
                  <div className="IncDecProductTaskBox">
                    <IconButton onClick={handleDecrement}>
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={quantity}
                      type="number"
                      inputProps={{ min: 1 }}
                      className="quantityInput"
                      disabled
                    />
                    <IconButton onClick={handleIncrement}>
                      <AddIcon />
                    </IconButton>
                  </div>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Typography className="totalText">
                  {t('total')} = $
                    {(
                      reversedProducts
                        .filter(
                          (item) =>
                            item.name !== "Additional Task" &&
                            item.isActive === true
                        )
                        .map((product) => {
                          const priceMatch =
                            product.thirdDescription.match(/\d+(\.\d+)?/);
                          return priceMatch ? parseFloat(priceMatch[0]) : 0;
                        })
                        .reduce((acc, price) => acc + price, 0) * quantity
                    ).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                className="purchase-task-btn"
                onClick={handleBuyTask}
              >
                {t('buyTask')}
              </Button>
            </Box>
          )}
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Paper>
    </Elements>
  );
};

export default MembershipPage;
