import { useTheme } from "@mui/material";
import "../../css/HomePage/Home.css";

const BgShape = () => {
  const { palette } = useTheme();

  return (
    <div
      className="bg-shape"
      style={{
        background: palette.background.default,
        position: "relative",
        zIndex: 1,
        height: "50px",
        width: "100%",
        marginTop: "-50px",
      }}
    ></div>
  );
};

export default BgShape;
