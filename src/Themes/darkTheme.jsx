import { createTheme } from "@mui/material";

const darkMidnightBlue = "#022b4f"; // dark bg
const white = "#FFF";
const gunmetal = "#1d4a72";
const melon = "#FFC9C9";
const lightNavy = "#0d416f";
/* 
commenting unused color for now. These colors will be used as theme grows.

const lotion = "#FAFAFA"; // light bg
const black = "#000";
const americanSilver = "#CECECE"; // light search border
const yaleBlue = "#13538B"; // dark text
const darkSilver = "#707070"; // light reset
const littleBoyBlue = "#6FA8DD"; // dark reset
*/

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: white,
      contrastText: gunmetal,
    },
    error: {
      main: melon,
    },
    background: {
      default: lightNavy,
      paper: darkMidnightBlue,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "12px !important",
        },
      },
    },

    // MuiInput: {
    //   styleOverrides: {
    //     root: {
    //       "&:autofill": {
    //         background: "none",
    //       },
    //       "&:-webkit-autofill": {
    //         background: "none",
    //       },
    //     },
    //   },
    // },

    MuiButton: {
      styleOverrides: {
        root: {
          height: "48px",
          borderRadius: "12px",
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: white,
        },
      },
    },
  },
});

export default darkTheme;
