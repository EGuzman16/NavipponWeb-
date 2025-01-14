import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h1" color="primary">
        404
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Página No Encontrada
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Volver al Inicio
      </Button>
    </Box>
  );
};

export default NotFound;
