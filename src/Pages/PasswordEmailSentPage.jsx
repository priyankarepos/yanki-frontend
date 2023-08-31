import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PasswordEmailSentpage = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center h-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box
              className="w-full object-contain flex items-center justify-center"
              sx={{ marginBottom: "156px" }}
            >
              <img src="/Group 14492.svg" alt="logo" />
            </Box>
            <img
              src="/Group 14524.svg"
              alt="logo"
              style={{
                maxWidth: "185px",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                marginBottom: "30px",
              }}
            />
            <Typography
              variant="h5"
              sx={{ marginBottom: "10px", textAlign: "center" }}
            >
              Mail sent successfully
            </Typography>
            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
              Please follow instructions in email to reset password.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PasswordEmailSentpage;
