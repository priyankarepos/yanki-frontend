// useFormSubmit.js a custom hook
import { useState, useContext } from "react";
import axios from "axios"; // Using axios for api calls
import { Context } from "../App";

export const useFormSubmit = () => {
  // From context
  const { userLatitude, userLongitude, isLocationAllowed } =
    useContext(Context);
  // All state initialization
  const [isLoading, setIsLoading] = useState(false); // State for loading flag
  const [error, setError] = useState(null); // State for error handling
  const BASE_URL = import.meta.env.VITE_API_; // Accessing base url from .env

  // Using async await due to api call
  const submitForm = async data => {
    setIsLoading(true); // Setting the loading flag
    setError(null); // Initially setting error to null

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Using try catch for asynchronous api call
    try {
      const response = await axios.post(
        BASE_URL,
        { prompt: data },
        {
          headers: {
            "Content-Type": "application/json",
            "Location-Allowed": isLocationAllowed,
            TimeZone: timezone,
            "User-Lat": userLatitude,
            "User-Long": userLongitude,
          },
        }
      );

      // handling the API response
      const responseData = response;
      // Resetting loading flag
      setIsLoading(false);

      return responseData;
    } catch (error) {
      // Resetting loading flag
      setIsLoading(false);
      if (error.request.status === 0) {
        setError(error.message);
      } else {
        setError(error.request.responseText);
      }
    }
  };

  return {
    isLoading,
    error,
    submitForm,
  };
};
