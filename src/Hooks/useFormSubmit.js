// useFormSubmit.js a custom hook
import { useState, useContext } from "react";
import axios from "axios"; // Using axios for api calls
import { Context } from "../App";

export const useFormSubmit = () => {
  // From context
  const { userCity, isAllowed } = useContext(Context);
  // All state initialization
  const [isLoading, setIsLoading] = useState(false); // State for loading flag
  const [error, setError] = useState(null); // State for error handling
  const BASE_URL = process.env.REACT_APP_API_URL; // Accessing base url from .env

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
            TimeZone: timezone,
            usrCity: userCity,
            "Location-Allowed": isAllowed,
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
