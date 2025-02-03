import { Box, Typography, useTheme } from "@mui/material";
import CustomShape from "../../../components/Shapes/CustomShape";

const AboutHeader = () => {
  const theme = useTheme();

  const customColor = theme.palette.secondary.light;

  return (
    <Box sx={{ position: "relative", height: "60vh" }}>
      <Box
        sx={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(/assets/bg-about-us.jpg)",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#fff",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h1"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Sobre Nosotros
        </Typography>
        <div style={{ width: "20%", marginTop: "1rem", opacity: "0.7" }}>
          <CustomShape color={customColor} />
        </div>
      </Box>
    </Box>
  );
};

export default AboutHeader;
