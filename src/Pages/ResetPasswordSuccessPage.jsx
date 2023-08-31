import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const ResetPasswordSuccessPage = () => {
  const navigate = useNavigate();

  const onGoToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center h-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box
              className="w-full object-contain flex items-center justify-center"
              sx={{ marginBottom: "132px" }}
            >
              <img src="/Group 14492.svg" alt="logo" />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{ marginBottom: "54px", textAlign: "center" }}
            >
              Reset password successful
            </Typography>
            <Button variant="contained" fullWidth onClick={onGoToLogin}>
              Go to login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ResetPasswordSuccessPage;
