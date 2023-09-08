export const unathorizedRedirect = (e) => {
  if (e.response.status === 401) {
    window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
    window.localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_REMEMBER);
    window.sessionStorage.removeItem(
      process.env.REACT_APP_SESSIONSTORAGE_REFRESH
    );
    window.location.replace("/login");
  }
};
