import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const ErrorAnswer = ({ errorMsg }) => {
  console.log("errorMsg",errorMsg);
  return (
    <>
      <Box>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6" component="div">
            {errorMsg}
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default ErrorAnswer;
