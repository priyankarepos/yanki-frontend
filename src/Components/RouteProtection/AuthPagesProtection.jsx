import { Navigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { getUtcUnixTimeStampInSeconds } from "../../Utils/functions/getUtcUnixTimeStamp";

const AuthPagesProtection = ({ children }) => {
  const location = useLocation();

  const tokenFromLocalStorage = localStorage.getItem(
    import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
  );

  const getCurrentUnixTimeStamp = getUtcUnixTimeStampInSeconds();

  try {
    if (tokenFromLocalStorage) {
      const parsedToken = JSON.parse(tokenFromLocalStorage);
      const decodedJwtToken = jwt_decode(parsedToken.token);
      const tokenExpTime = decodedJwtToken.exp;
      if (tokenExpTime && tokenExpTime > getCurrentUnixTimeStamp) {
        return <Navigate to="/" state={{ from: location }} replace />;
      } else {
        return children;
      }
    } else {
      window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN);
      window.localStorage.removeItem(
        import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
      );
      return children;
    }
  } catch (e) {
    window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN);
    window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER);
    return children;
  }
};

export default AuthPagesProtection;
