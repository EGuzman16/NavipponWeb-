import { Box, Typography, useTheme } from "@mui/material";
const Hero = () => {
  const theme = useTheme();
  return (
    <Box
      className="header"
      sx={{
        textAlign: "center",
        mb: 4,
        paddingTop: 15,
        backgroundColor: theme.palette.background.light,
        borderRadius: "0 0 5rem 5rem",
        paddingBottom: 5,
      }}
    >
      <Typography variant="h1">Planea tu viaje Ideal</Typography>
      <p>
        Puedes filtrar para encontrar lo que necesitas, fácil, rápido e ideal
        para hacer tu experiencia como viajero mucho más relajadora.
      </p>
    </Box>
  );
};

export default Hero;
