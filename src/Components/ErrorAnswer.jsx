import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const ErrorAnswer = ({ errorMsg }) => {

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
          <Typography variant="h6" component="div" style={{fontSize: "16px",}}>
            {errorMsg}
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default ErrorAnswer;
