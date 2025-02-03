import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../../components/SearchBarHome.jsx";

const backgroundImages = [
  "/assets/bg-home1.jpg",
  "/assets/bg-home2.jpg",
  "/assets/bg-home3.jpg",
  "/assets/bg-home4.jpg",
  "/assets/bg-home5.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage(
          (prevImage) => (prevImage + 1) % backgroundImages.length
        );
        setFade(true);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      className="h-screen md:h-[79vh]"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        padding: "2rem",
        overflow: "hidden",
      }}
    >
      {backgroundImages.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1s ease-in-out",
            opacity: index === currentImage && fade ? 1 : 0,
          }}
        />
      ))}

      <Typography
        variant="h1"
        sx={{ textAlign: "center", fontWeight: "bold", zIndex: 2 }}
        gutterBottom
      >
        Navega Japón a Tu Manera
      </Typography>
      <SearchBar />
    </Box>
  );
};

export default Hero;
