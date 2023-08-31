import { createBrowserRouter } from "react-router-dom";
import Homepage from "./Components/Homepage";
import TitlePage from "./Pages/TitlePage";
import SigninPage from "./Pages/SigninPage";
import SigninSuccessPage from "./Pages/SigninSuccessPage";
import LoginPage from "./Pages/LoginPage";
import ChangePasswordPage from "./Pages/ChangePasswordPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import PasswordEmailSentpage from "./Pages/PasswordEmailSentPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import ActiveAccountPage from "./Pages/ActiveAccountPage";
import ResetPasswordSuccessPage from "./Pages/ResetPasswordSuccessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/auth",
    element: <TitlePage />,
  },
  {
    path: "/signin",
    element: <SigninPage />,
  },
  {
    path: "/signinSuccess",
    element: <SigninSuccessPage />,
  },
  {
    path: "/active-account",
    element: <ActiveAccountPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/change-password",
    element: <ChangePasswordPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/password-email-sent",
    element: <PasswordEmailSentpage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/reset-password-success",
    element: <ResetPasswordSuccessPage />,
  },
]);

export default router;
