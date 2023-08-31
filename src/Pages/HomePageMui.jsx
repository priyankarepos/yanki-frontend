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
import { Context } from "../App";
import axios from "axios";
import SentenceAnswer from "../Components/SentenceAnswer";
import PrayerTimeListAnswer from "../Components/PrayerTimeListAnswer";
import ErrorAnswer from "../Components/ErrorAnswer";
import ProfileCircle from "../Components/ProfileCircle";

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

  const {
    control,
    handleSubmit,
    formState: { errors },
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
    console.log("onSubmit: ", data);
    try {
      setIsSubmitting(true);
      setIsError(false);
      setErrorMsg("");
      setQueryAnswer(null);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await axios.post(
        process.env.REACT_APP_API_URL,
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
      console.log("error: ", error);
      setIsSubmitting(false);
      setIsError(true);
      setQueryAnswer(null);
      if (error.request.status === 0) {
        setErrorMsg(error.message);
      } else if (error.request.responseText) {
        setErrorMsg(error.request.responseText);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <ProfileCircle />
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "4rem",
            }}
          >
            <img src="/logo-dark.svg" style={{ width: "15em" }} alt="logo" />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "80%" },
              marginX: "auto",
              marginY: "1.5rem",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                >
                  Reset
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </form>

            {isSubmitting && <CircularProgress />}

            {queryAnswer && !queryAnswer?.isAllPrayer && (
              <SentenceAnswer answer={queryAnswer} />
            )}

            {queryAnswer && queryAnswer.isAllPrayer && (
              <PrayerTimeListAnswer answer={queryAnswer} />
            )}

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
                  src="/myZmanim-dark.png"
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
