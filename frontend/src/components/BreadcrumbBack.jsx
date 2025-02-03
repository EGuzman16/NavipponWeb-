// BreadcrumbBack.jsx
import { IconButton, Box, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../css/Items/ActivityDetail.css";

const BreadcrumbBack = ({ color }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "10rem",
        left: 16,
        opacity: "0.9",
        zIndex: 10,
        backgroundColor: palette.primary.main,
        borderRadius: 30,
        padding: "8px",
      }}
    >
      <IconButton
        sx={{ color: color || palette.primary.white }}
        onClick={() => navigate(-1)}
        aria-label="go back"
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

BreadcrumbBack.propTypes = {
  color: PropTypes.string,
};

BreadcrumbBack.defaultProps = {
  color: "",
};

export default BreadcrumbBack;
