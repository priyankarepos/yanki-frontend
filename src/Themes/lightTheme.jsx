import { createTheme } from "@mui/material";

const darkMidnightBlue = "#063762"; // dark bg
const white = "#FFF";
const gunmetal = "#2A2b35";
const melon = "#FFC9C9";
const lightNavy = "#13538b";
/* 
commenting unused color for now. These colors will be used as theme grows.

const lotion = "#FAFAFA"; // light bg
const black = "#000";
const americanSilver = "#CECECE"; // light search border
const yaleBlue = "#13538B"; // dark text
const darkSilver = "#707070"; // light reset
const littleBoyBlue = "#6FA8DD"; // dark reset
*/

const lightTheme = createTheme({
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
      default: darkMidnightBlue,
      paper: lightNavy,
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
  },
});

export default lightTheme;
