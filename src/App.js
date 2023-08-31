import { useEffect, useState } from "react";
// import Homepage from "./Components/Homepage";
import { createContext } from "react";
import lightTheme from "./Themes/lightTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPagesProtection from "./Components/RouteProtection/AuthPagesProtection";
import LoginPage from "./Pages/LoginPage";
import SigninPage from "./Pages/SigninPage";
import TitlePage from "./Pages/TitlePage";
import SigninSuccessPage from "./Pages/SigninSuccessPage";
import ActiveAccountPage from "./Pages/ActiveAccountPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import PasswordEmailSentpage from "./Pages/PasswordEmailSentPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import ResetPasswordSuccessPage from "./Pages/ResetPasswordSuccessPage";
import Homepage from "./Components/Homepage";
import UserPagesProtection from "./Components/RouteProtection/UserPagesProtection";
import HomePageMui from "./Pages/HomePageMui";

// Exporting context
export const Context = createContext("");

window.onbeforeunload = function () {
  const rememeberMe = window.localStorage.getItem(
    process.env.REACT_APP_LOCALSTORAGE_REMEMBER
  );
  if (rememeberMe === undefined || rememeberMe === "false") {
    window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
    window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_REMEMBER);
  }
};

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
          {/* <RouterProvider router={router} /> */}
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <AuthPagesProtection>
                    <LoginPage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/signin"
                element={
                  <AuthPagesProtection>
                    <SigninPage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/auth"
                element={
                  <AuthPagesProtection>
                    <TitlePage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/signin-success"
                element={
                  <AuthPagesProtection>
                    <SigninSuccessPage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/active-account"
                element={
                  <AuthPagesProtection>
                    <ActiveAccountPage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthPagesProtection>
                    <ForgotPasswordPage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/password-email-sent"
                element={
                  <AuthPagesProtection>
                    <PasswordEmailSentpage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <AuthPagesProtection>
                    <ResetPasswordPage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/reset-password-success"
                element={
                  <AuthPagesProtection>
                    <ResetPasswordSuccessPage />
                  </AuthPagesProtection>
                }
              />
              <Route
                path="/backup-home"
                element={
                  <UserPagesProtection>
                    <Homepage />
                  </UserPagesProtection>
                }
              />
              <Route
                path="/"
                element={
                  <UserPagesProtection>
                    <HomePageMui />
                  </UserPagesProtection>
                }
              />
            </Routes>
          </BrowserRouter>
        </Context.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
