export const unathorizedRedirect = (e) => {
  if (e.response.status === 401) {
    window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN);
    window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER);
    window.sessionStorage.removeItem(
      import.meta.env.VITE_APP_SESSIONSTORAGE_REFRESH
    );
    window.location.replace("/login");
  }
};
