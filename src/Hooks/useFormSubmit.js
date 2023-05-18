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

    let locationId = data.locationId; // Setting location id from form data
    let inputDate = data.inputDate; // Setting date from form data

    let API_URL; // Declaring variable for api call
    // Setting api url as per inputDate
    if (inputDate === "") {
      API_URL = `${BASE_URL}?locationId=${locationId}`;
    } else {
      API_URL = `${BASE_URL}?locationId=${locationId}&inputDate=${inputDate}`;
    }
    // Using try catch for asynchronous api call
    try {
      const response = await axios.post(API_URL);

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
