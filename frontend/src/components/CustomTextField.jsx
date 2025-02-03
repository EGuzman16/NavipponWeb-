import { TextField } from "@mui/material";
import PropTypes from "prop-types";
const CustomTextField = ({ label, value, onChange, ...props }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      label={label}
      variant="outlined"
      sx={{
        borderRadius: "30rem",
        border: "none",
        paddingLeft: 3,
        backgroundColor: (theme) => theme.palette.secondary.light,
        "& .MuiInputLabel-root": {
          paddingLeft: 3,
          border: "none",
          color: (theme) => theme.palette.neutral.dark,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};
CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  sx: PropTypes.object,
};

export default CustomTextField;
