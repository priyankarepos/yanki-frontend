import {
  useEffect,
  useState,
  createContext,
  useMemo,
  useLayoutEffect,
} from "react";
import darkTheme from "./Themes/darkTheme";
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
import ChangePasswordPage from "./Pages/ChangePasswordPage";
import AuthPageLayout from "./Components/Layout/AuthPageLayout";
import UserPageLayout from "./Components/Layout/UserPageLayout";
import axios from "axios";
import ChangePasswordSuccessPage from "./Pages/ChangePasswordSuccessPage";
import AdminDashboard from "./Admin/AdminDashboard";

// Exporting context
export const Context = createContext("");

export const ThemeModeContext = createContext({
  // themeMode: "",
  // toggleThemeMode: () => {},
});

// window.onbeforeunload = function () {
//   const rememeberMe = window.localStorage.getItem(
//     process.env.REACT_APP_LOCALSTORAGE_REMEMBER
//   );
//   if (rememeberMe === undefined || rememeberMe === "false") {
//     window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
//     window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_REMEMBER);
//   }
// };

const accepts401 = [
  "/signin",
  "/login",
  "/active-account",
  "/forgot-password",
  "/reset-password",
  "/change-password",
];

/* 
  request interceptor

  This interceptor will add Authorization header in request;
  It will check whether token is present in local storage.
  if yes, then it will add authorization header in request.
  if no, then it will not modify the request
*/
axios.interceptors.request.use((request) => {
  const yankiUser = window.localStorage.getItem(
    process.env.REACT_APP_LOCALSTORAGE_TOKEN
  );
  if (yankiUser) {
    const parsedYankiUser = JSON.parse(yankiUser);
    request.headers.Authorization = `Bearer ${parsedYankiUser.token}`;
  }
  return request;
});

/* 
  response interceptor

  This interceptor will intercept the response coming from backend.
  Main purpose of this interceptor is to redirect user to the login page if,
  response status 401 "Unathorized" received from api.

  If ok response received from api, it will do nothing. And pass the response received.
  If it gets error response other then 401 "Unauthorized", it will do nothing. And pass the error received.

  If it get 401 "Unathorized", then it checks the pathname of the page that user is currently on.

  if pathname is in the accepts401 array declared above in file. It will do nothing, and pass the error received.
  else it will redirect user to the login page.
*/
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const pathname = window.location.pathname;
    if (
      error?.response &&
      error?.response?.status === 401 &&
      !accepts401.includes(pathname)
    ) {
      window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
      window.localStorage.removeItem(
        process.env.REACT_APP_LOCALSTORAGE_REMEMBER
      );
      window.sessionStorage.removeItem(
        process.env.REACT_APP_SESSIONSTORAGE_REFRESH
      );
      window.location.replace("/login");
    } else {
      return Promise.reject(error);
    }
  }
);

function App() {
  // State for User city
  const [userLatitude, setUserLatitude] = useState("");
  const [userLongitude, setUserLongitude] = useState("");
  const [isLocationAllowed, setIsLocationAllowed] = useState("");

  const [themeMode, setThemeMode] = useState("dark");

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

  const toggleThemeMode = useMemo(
    () => () => {
      setThemeMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
    },
    []
  );

  const currentTheme = useMemo(() => {
    if (themeMode === "dark") {
      return darkTheme;
    } else {
      return lightTheme;
    }
  }, [themeMode]);

  useLayoutEffect(() => {
    let session = window.sessionStorage.getItem(
      process.env.REACT_APP_SESSIONSTORAGE_REFRESH
    )
      ? JSON.parse(
          window.sessionStorage.getItem(
            process.env.REACT_APP_SESSIONSTORAGE_REFRESH
          )
        )
      : "";

    if (!session) {
      const rememeberMe = window.localStorage.getItem(
        process.env.REACT_APP_LOCALSTORAGE_REMEMBER
      );
      if (rememeberMe === undefined || rememeberMe === "false") {
        window.localStorage.removeItem(
          process.env.REACT_APP_LOCALSTORAGE_TOKEN
        );
        window.localStorage.removeItem(
          process.env.REACT_APP_LOCALSTORAGE_REMEMBER
        );
      } else {
      }
    } else {
    }
  }, []);

  return (
    <ThemeModeContext.Provider
      value={{ themeMode, toggleThemeMode: toggleThemeMode }}
    >
      <ThemeProvider theme={currentTheme}>
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
                      <AuthPageLayout>
                        <LoginPage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/signin"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <SigninPage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/auth"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <TitlePage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/signin-success"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <SigninSuccessPage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/active-account"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <ActiveAccountPage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <ForgotPasswordPage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/password-email-sent"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <PasswordEmailSentpage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <ResetPasswordPage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/reset-password-success"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <ResetPasswordSuccessPage />
                      </AuthPageLayout>
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
                  path="/change-password"
                  element={
                    <UserPagesProtection>
                      <UserPageLayout>
                        <ChangePasswordPage />
                      </UserPageLayout>
                    </UserPagesProtection>
                  }
                />
                <Route
                  path="/change-password-success"
                  element={
                    <AuthPagesProtection>
                      <AuthPageLayout>
                        <ChangePasswordSuccessPage />
                      </AuthPageLayout>
                    </AuthPagesProtection>
                  }
                />
                <Route
                  path="/"
                  element={
                    <UserPagesProtection>
                      <UserPageLayout>
                        <HomePageMui />
                      </UserPageLayout>
                    </UserPagesProtection>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <UserPagesProtection>
                      <AdminDashboard />
                    </UserPagesProtection>
                  }
                />
              </Routes>
            </BrowserRouter>
          </Context.Provider>
        </div>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default App;
