import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const ErrorAnswer = ({ errorMsg }) => {
  return (
    <>
      <Box>
        <Paper className="error-answer-container" sx={{p: 2}}>
          <Typography variant="h6" component="div" className="error-answer-message" >
            {errorMsg}
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default ErrorAnswer;
