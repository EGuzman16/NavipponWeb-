import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";

/**
 * Custom Select component.
 * This component is fully reusable with flexible options and styling.
 */
const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  disabled,
  labelStyle,
  selectStyle,
  inputProps,
  defaultOptionLabel = "Selecciona una opción", // Default option "Selecciona una opción"
}) => {
  const theme = useTheme();

  const handleSelect = (selectedValue) => {
    if (selectedValue === value) {
      onChange({ target: { value: defaultOptionLabel } });
    } else {
      // Otherwise, set the selected value
      onChange({ target: { value: selectedValue } });
    }
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ borderRadius: "30rem" }}>
      {/* Styled Label */}
      <InputLabel
        sx={{
          color: theme.palette.neutral.dark,
          paddingLeft: "1rem",
          fontSize: "0.9rem",
          ...labelStyle,
        }}
      >
        {label}
      </InputLabel>

      {/* Styled Select */}
      <Select
        value={value}
        onChange={(e) => handleSelect(e.target.value)} // Handle the toggle on selection
        label={label}
        sx={{
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.neutral.dark,
          borderRadius: "30rem",
          ...selectStyle,
        }}
        disabled={disabled}
        inputProps={inputProps}
      >
        {/* Default Option */}
        <MenuItem value="" disabled>
          {defaultOptionLabel}
        </MenuItem>

        {/* Mapping Options */}
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Prop validation
CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  labelStyle: PropTypes.object,
  selectStyle: PropTypes.object,
  inputProps: PropTypes.object,
  placeholder: PropTypes.string,
  defaultOptionLabel: PropTypes.string,
};

CustomSelect.defaultProps = {
  disabled: false,
  labelStyle: {},
  selectStyle: {},
  inputProps: {},
  placeholder: "",
  defaultOptionLabel: "Selecciona una opción",
};

export default CustomSelect;
