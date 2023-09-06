import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";

import { useForm, Controller } from "react-hook-form";
import { useContext, useState } from "react";
import { Context, ThemeModeContext } from "../App";
import axios from "axios";
import SentenceAnswer from "../Components/SentenceAnswer";
import PrayerTimeListAnswer from "../Components/PrayerTimeListAnswer";
import ErrorAnswer from "../Components/ErrorAnswer";
// import ProfileCircle from "../Components/ProfileCircle";

const HomePageMui = () => {
  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [queryAnswer, setQueryAnswer] = useState(null);

  const { userLatitude, userLongitude, isLocationAllowed } =
    useContext(Context);

  const { themeMode } = useContext(ThemeModeContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      searchQuery: "",
    },
  });

  const onError = (data) => {
    console.log("onError: ", data);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setIsError(false);
      setErrorMsg("");
      setQueryAnswer(null);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/all-answers`,
        { prompt: data.searchQuery },
        {
          headers: {
            "Content-Type": "application/json",
            "Location-Allowed": isLocationAllowed,
            TimeZone: timezone,
            "User-Lat": userLatitude,
            "User-Long": userLongitude,
          },
        }
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        setQueryAnswer(response.data);
        setIsError(false);
        setErrorMsg("");
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsError(true);
      setQueryAnswer(null);
      if (error?.request?.status === 0) {
        setErrorMsg(
          typeof error?.message === "string"
            ? error?.message
            : "Something went wrong"
        );
      } else if (error?.request?.responseText) {
        setErrorMsg(error.request.responseText);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  const onReset = () => {
    reset();
    setQueryAnswer(null);
  };

  return (
    <>
      <Container maxWidth="xl">
        {/* <ProfileCircle /> */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={themeMode === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
              style={{ width: "15em" }}
              alt="logo"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "80%" },
              marginX: "auto",
              marginY: "1.5rem",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit, onError)} onReset={onReset}>
              <Controller
                control={control}
                name="searchQuery"
                rules={{ required: { value: true } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    name="search"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ marginBottom: "1rem" }}
                    error={!!errors["searchQuery"]}
                    disabled={isSubmitting}
                  />
                )}
              />

              <Typography variant="subtitle2" className="text-center">
                A smart chatbot that provides responses exclusively from
                endorsed orthodox Jewish sources.
              </Typography>

              <Box
                sx={{
                  marginY: 3,
                  textAlign: { xs: "center", md: "right" },
                }}
              >
                <Button
                  variant="outlined"
                  type="reset"
                  sx={{ marginRight: "1rem" }}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Box>
            </form>

            {isSubmitting && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {queryAnswer?.isSucess && queryAnswer?.contentResponse && (
              <SentenceAnswer answer={queryAnswer} />
            )}

            {/* 
              // This may not require as response is changed
            {queryAnswer && queryAnswer.isAllPrayer && (
              <PrayerTimeListAnswer answer={queryAnswer} />
            )}
              */}

            {/* YouTube */}

            {/* Hoday list */}

            {/* Prayer List */}

            {/* Reminder */}

            {isError && <ErrorAnswer errorMsg={errorMsg} />}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="caption">In partnership with</Typography>
              <Box>
                <img
                  src={
                    themeMode === "dark"
                      ? "/myZmanim-dark.png"
                      : "/myZmanim-light.png"
                  }
                  alt="myZmanim"
                  style={{ width: "45%", maxWidth: "416px" }}
                />
              </Box>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" component="div">
                Submit your platform or content for revision,
              </Typography>
              <Typography variant="caption">
                Contact us:
                <a
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  hello@yanki.ai
                </a>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default HomePageMui;
