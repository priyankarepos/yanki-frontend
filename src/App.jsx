import {
  useEffect,
  useState,
  createContext,
  useMemo,
  useLayoutEffect,
} from "react";
import darkTheme from "./Themes/darkTheme";
import lightTheme from "./Themes/lightTheme";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Snackbar,
} from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPagesProtection from "./Components/RouteProtection/AuthPagesProtection";
import LoginPage from "./Pages/LoginPage";
import SigninPage from "./Pages/SigninPage";
import SigninSuccessPage from "./Pages/SigninSuccessPage";
import ActiveAccountPage from "./Pages/ActiveAccountPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import PasswordEmailSentpage from "./Pages/PasswordEmailSentPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import ResetPasswordSuccessPage from "./Pages/ResetPasswordSuccessPage";
import UserPagesProtection from "./Components/RouteProtection/UserPagesProtection";
import ChangePasswordPage from "./Pages/ChangePasswordPage";
import AuthPageLayout from "./Components/Layout/AuthPageLayout";
import UserPageLayout from "./Components/Layout/UserPageLayout";
import axios from "axios";
import ChangePasswordSuccessPage from "./Pages/ChangePasswordSuccessPage";
import AdminDashboard from "./Admin/AdminDashboard";
import ChangeRole from "./Admin/ChangeRole";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NewTitlePage from "./Pages/NewTitlePage";
import EnterpriseSignup from "./Pages/EnterpriseSignup";
import EnterpriseDashboard from "./EnterpriseCollabration/EnterpriseDashboard";
import EnterprisePendingStatusPage from "./Pages/EnterprisePendingStatusPage";
import EnterpriseProfile from "./EnterpriseCollabration/EnterpriseProfile";
import Departments from "./EnterpriseCollabration/Departments";
import AdminSearchRepostPage from "./Admin/AdminSearchReportPage";
import AdminEnterpriseRequest from "./Admin/EnterpriseRequest";
import AdminEnterpriseCategory from "./Admin/EnterpriseCategory";
import TermsOfUse from "./Pages/TermsOfUsePage";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import AdminCreateEnterprise from "./Admin/CreateEnterprise";
import AdminCreateDepartment from "./Admin/CreateDepartment";
import AdminFileUpload from "./Admin/AdminFileUpload";
import EnterpriseFileUpload from "./EnterpriseCollabration/EnterpriseUpload";
import ChangePhoneNumber from "./Pages/ChangePhoneNumber";
import AdminEventRequest from "./Admin/EventRequest";
import EventLocationPage from "./Admin/EventLocationPage";
import AiCustomization from "./Pages/AiCustomization/AiCustomization";
import SubscribeNotification from "./Components/Notification/SubscribeNotification";
import AdminAddFaq from "./Admin/AdminAddFAQ";
import NewHomePageMui from "./Pages/NewHomePageMui/NewHomePageMui";
import "./style.scss";
import MembershipPage from "./Components/MembershipPortal/MembershipPage";
import PaymentSuccessPage from "./Components/MembershipPortal/PaymentSuccessPage";
import PaymentFailurePage from "./Components/MembershipPortal/PaymentFailurePage";
import SubscriptionCreatedPage from "./Components/MembershipPortal/SubscriptionCreated";
import ChangeLanguage from "./Pages/ChangeLanguage";
import UserChatList from "./Admin/AdminChat/UserChatList";
import SharedChat from "./Pages/ShareModel/SharedChat";
import { messages } from "./Utils/stringConstant/stringConstant";
import { startConnection } from "./SignalR/signalRService";

// Exporting context
export const Context = createContext("");

// It might be used in future

export const ThemeModeContext = createContext({
  // themeMode: "",
  // toggleThemeMode: () => {},
});

// window.onbeforeunload = function () {
//   const rememeberMe = window.localStorage.getItem(
//     import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
//   );
//   if (rememeberMe === undefined || rememeberMe === "false") {
//     window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN);
//     window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER);
//   }
// };

const accepts401 = [
  "/signup",
  "/login",
  "/active-account",
  "/forgot-password",
  "/reset-password",
  "/change-password",
  "/enterprise-signup",
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
    import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
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
      window.localStorage.removeItem(
        import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
      );
      window.localStorage.removeItem(
        import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
      );
      window.sessionStorage.removeItem(
        import.meta.env.VITE_APP_SESSIONSTORAGE_REFRESH
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const googleClientId =
    "1080050298294-vnv1knq153gntogjjfmlkfomm0rvasq4.apps.googleusercontent.com";

  const [themeMode, setThemeMode] = useState("dark");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const localStorageTab = localStorage.getItem(messages.activeTab);
  const initialTab = localStorageTab ? parseInt(localStorageTab, 10) : 0;

  const [activeTab, setActiveTab] = useState(initialTab);

  const options = useMemo(
    () => ({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }),
    []
  );
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
    setSnackbarMessage(`ERROR(${err.code}): ${err.message}`);
    setSnackbarOpen(true);
  };

  const yankiUser = window.localStorage.getItem(
    import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
  );
  if (yankiUser) {
    startConnection();
  }

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            setIsLocationAllowed("Location denied");
          }
        });
      } else {
        setSnackbarMessage("Geolocation is not supported by this browser.");
        setSnackbarOpen(true);
      }
    };

    getLocation();
  }, [options]);

  const toggleThemeMode = useMemo(
    () => () => {
      setThemeMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
    },
    []
  );

  let parsedUserObject;

  const userRoles = parsedUserObject?.userObject?.userRoles || "";

  //It might be used in future

  // const currentTheme = useMemo(() => {
  //   if (activeTab === 0 ) {
  //     return darkTheme;
  //   } else if (activeTab === 1) {
  //     return lightTheme;
  //   } else {
  //     return darkTheme;
  //   }
  // }, [activeTab]);

  const currentTheme = useMemo(() => {
    const themeTypography = {
      fontFamily: "AuthenticSans",
    };
    // Check if userRoles include 'Enterprise'
    const isEnterpriseUser = userRoles.includes("Enterprise");

    // If user is an enterprise user, apply light theme
    if (isEnterpriseUser) {
      return createTheme({
        ...lightTheme,
        typography: themeTypography,
      });
    } else {
      // Otherwise, check the activeTab
      if (activeTab === 1) {
        // Apply light theme for activeTab 1
        return createTheme({
          ...lightTheme,
          typography: themeTypography,
        });
      } else {
        // Apply dark theme for all other cases
        return createTheme({
          ...darkTheme,
          typography: themeTypography,
        });
      }
    }
  }, [activeTab, userRoles]);

  useLayoutEffect(() => {
    let session = window.sessionStorage.getItem(
      import.meta.env.VITE_APP_SESSIONSTORAGE_REFRESH
    )
      ? JSON.parse(
          window.sessionStorage.getItem(
            import.meta.env.VITE_APP_SESSIONSTORAGE_REFRESH
          )
        )
      : "";

    const isShareChatRoute = () =>
      window.location.pathname.startsWith(messages.shareRoute);

    if (!session && isShareChatRoute === null) {
      const rememeberMe = window.localStorage.getItem(
        import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
      );
      if (rememeberMe === undefined || rememeberMe === "false") {
        window.localStorage.removeItem(
          import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
        );
        window.localStorage.removeItem(
          import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
        );
      } else {
      }
    } else {
    }
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeModeContext.Provider
          value={{ themeMode, toggleThemeMode: toggleThemeMode }}
        >
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <div className="App">
              {/* Wrapping with context */}
              <Context.Provider
                value={{
                  userLatitude,
                  userLongitude,
                  isLocationAllowed,
                  setDrawerOpen,
                  drawerOpen,
                  activeTab,
                  setActiveTab,
                }}
              >
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
                      path="/signup"
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
                            <NewTitlePage
                              activeTab={activeTab}
                              setActiveTab={setActiveTab}
                            />
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
                      path="/change-phone-number"
                      element={
                        <UserPagesProtection>
                          <UserPageLayout>
                            <ChangePhoneNumber />
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
                      path="/:chatId?"
                      element={
                        <UserPagesProtection>
                          <NewHomePageMui />
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
                    <Route
                      path="/change-role"
                      element={
                        <UserPagesProtection>
                          <ChangeRole />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/enterprise-signup"
                      element={
                        <AuthPagesProtection>
                          <AuthPageLayout>
                            <EnterpriseSignup />
                          </AuthPageLayout>
                        </AuthPagesProtection>
                      }
                    />
                    <Route
                      path="/enterprise"
                      element={
                        <UserPagesProtection>
                          <EnterpriseDashboard />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/enterprise-status"
                      element={
                        <UserPagesProtection>
                          <EnterprisePendingStatusPage />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/enterprise/profile"
                      element={
                        <UserPagesProtection>
                          <EnterpriseProfile />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/enterprise/departments"
                      element={
                        <UserPagesProtection>
                          <Departments />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/search-query-report"
                      element={
                        <UserPagesProtection>
                          <AdminSearchRepostPage />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/enterprise-request"
                      element={
                        <UserPagesProtection>
                          <AdminEnterpriseRequest />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/chat"
                      element={
                        <UserPagesProtection>
                          <UserChatList />
                        </UserPagesProtection>
                      }
                    />

                    <Route
                      path="/admin/chat/:chatSessionId"
                      element={
                        <UserPagesProtection>
                          <UserChatList />
                        </UserPagesProtection>
                      }
                    />

                    <Route
                      path="/admin/enterprise-categories"
                      element={
                        <UserPagesProtection>
                          <AdminEnterpriseCategory />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/terms-of-use"
                      element={
                        <AuthPagesProtection>
                          <AuthPageLayout>
                            <TermsOfUse />
                          </AuthPageLayout>
                        </AuthPagesProtection>
                      }
                    />
                    <Route
                      path="/privacy-policy"
                      element={
                        <AuthPagesProtection>
                          <AuthPageLayout>
                            <PrivacyPolicy />
                          </AuthPageLayout>
                        </AuthPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/create-enterprise"
                      element={
                        <UserPagesProtection>
                          <AdminCreateEnterprise />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/create-department"
                      element={
                        <UserPagesProtection>
                          <AdminCreateDepartment />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/upload-files"
                      element={
                        <UserPagesProtection>
                          <AdminFileUpload />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/enterprise/upload-files"
                      element={
                        <UserPagesProtection>
                          <EnterpriseFileUpload />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/event-request"
                      element={
                        <UserPagesProtection>
                          <AdminEventRequest />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/add-event-location"
                      element={
                        <UserPagesProtection>
                          <EventLocationPage />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/ai-customization"
                      element={
                        <UserPagesProtection>
                          <UserPageLayout>
                            <AiCustomization />
                          </UserPageLayout>
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/notification"
                      element={
                        <UserPagesProtection>
                          <UserPageLayout>
                            <SubscribeNotification />
                          </UserPageLayout>
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/admin/add-faq"
                      element={
                        <UserPagesProtection>
                          <AdminAddFaq />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/membership"
                      element={
                        <UserPagesProtection>
                          <UserPageLayout>
                            <MembershipPage />
                          </UserPageLayout>
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/payment-success"
                      element={
                        <UserPagesProtection>
                          <PaymentSuccessPage />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/subscription-created"
                      element={
                        <UserPagesProtection>
                          <SubscriptionCreatedPage />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/payment-fail"
                      element={
                        <UserPagesProtection>
                          <PaymentFailurePage />
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/change-language"
                      element={
                        <UserPagesProtection>
                          <UserPageLayout>
                            <ChangeLanguage />
                          </UserPageLayout>
                        </UserPagesProtection>
                      }
                    />
                    <Route
                      path="/share/:sharedChatId"
                      element={<SharedChat />}
                    />
                    <Route
                      path="/chat/:chatSessionId"
                      element={
                        <UserPagesProtection>
                          <NewHomePageMui />
                        </UserPagesProtection>
                      }
                    />
                  </Routes>
                </BrowserRouter>
              </Context.Provider>
            </div>
          </ThemeProvider>
        </ThemeModeContext.Provider>
      </GoogleOAuthProvider>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
}

export default App;
