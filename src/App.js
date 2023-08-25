import { useEffect, useState } from "react";
// import Homepage from "./Components/Homepage";
import { createContext } from "react";
import lightTheme from "./Themes/lightTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./router";

// Exporting context
export const Context = createContext("");

function App() {
  // State for User city
  const [userLatitude, setUserLatitude] = useState("");
  const [userLongitude, setUserLongitude] = useState("");
  const [isLocationAllowed, setIsLocationAllowed] = useState("");
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  // Success callback function
  const success = async (pos) => {
    const crd = pos.coords;
    setIsLocationAllowed("Location allowed");
    setUserLatitude(crd.latitude);
    setUserLongitude(crd.longitude);
  };

  // Error callback function
  const errors = (err) => {
    setIsLocationAllowed(`Location denied & Error message - ${err.message}`);
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          //If granted then directly call function here
          navigator.geolocation.getCurrentPosition(success, errors, options);
        } else if (result.state === "prompt") {
          //If prompt then the user will be asked to give permission
          navigator.geolocation.getCurrentPosition(success, errors, options);
        } else if (result.state === "denied") {
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  });
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <div className="App">
        {/* Wrapping with context */}
        <Context.Provider
          value={{ userLatitude, userLongitude, isLocationAllowed }}
        >
          {/* <Homepage /> */}
          <RouterProvider router={router} />
        </Context.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
