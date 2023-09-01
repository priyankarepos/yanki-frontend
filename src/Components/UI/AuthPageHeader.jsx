import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ThemeSwitcher from "./ThemeSwitcher";

const AuthPageHeader = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
            py: 2,
          }}
        >
          <ThemeSwitcher />
        </Box>
      </Container>
    </>
  );
};

export default AuthPageHeader;
