// useFormSubmit.js a custom hook
import { useState } from "react";
import axios from "axios"; // Using axios for api calls

export const useFormSubmit = () => {
  // All state initialization
  const [isLoading, setIsLoading] = useState(false); // State for loading flag
  const [error, setError] = useState(null); // State for error handling
  const BASE_URL = process.env.REACT_APP_API_URL; // Accessing base url from .env

  // Using async await due to api call
  const submitForm = async data => {
    setIsLoading(true); // Setting the loading flag
    setError(null); // Initially setting error to null

    // Using try catch for asynchronous api call
    try {
      const response = await axios.post(BASE_URL, data, {
        headers: { "Content-Type": "application/json" },
      });

      // handling the API response
      const responseData = response.data;

      // Resetting loading flag
      setIsLoading(false);

      return responseData;
    } catch (error) {
      // Resetting loading flag
      setIsLoading(false);

      // handling any errors
      setError(error);
    }
  };

  return {
    isLoading,
    error,
    submitForm,
  };
};
