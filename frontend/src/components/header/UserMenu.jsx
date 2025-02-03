import PropTypes from "prop-types";
import { Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRegUser } from "react-icons/fa";
import { MdFavoriteBorder, MdOutlineAdminPanelSettings } from "react-icons/md";
import { BiTrip } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useUser } from "../../hooks/useUser.js";

const UserMenu = ({ anchorEl, handleClose, handleLogout }) => {
  const theme = useTheme();
  const userState = useSelector((state) => state.user);
  const user = userState || {};
  const { _id, isAdmin } = user; // Extracting isAdmin property

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        sx: {
          bgcolor: "white",
          borderRadius: "0.5rem",
          boxShadow: (theme) => theme.shadows[5],
          mt: 1,
          minWidth: "150px",
        },
      }}
    >
      <MenuItem
        component={Link}
        to={`/profile/${_id}`}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <FaRegUser style={{ marginRight: "1rem", color: theme.palette.primary.main }} />
        <Typography>Mi Perfil</Typography>
      </MenuItem>
      <MenuItem
        component={Link}
        to="/trips"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <BiTrip style={{ marginRight: "1rem", color: theme.palette.primary.main }} />
        <Typography>Mis Viajes</Typography>
      </MenuItem>
      <MenuItem
        component={Link}
        to="/favorites"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <MdFavoriteBorder style={{ marginRight: "1rem", color: theme.palette.primary.main }} />
        <Typography>Favoritos</Typography>
      </MenuItem>

      {isAdmin && ( // Conditionally render Admin Panel link
        <MenuItem
          component={Link}
          to="/admin"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <MdOutlineAdminPanelSettings style={{ marginRight: "1rem", color: theme.palette.primary.main }} />
          <Typography>Panel de Administración</Typography>
        </MenuItem>
      )}

      <MenuItem onClick={handleLogout} sx={{ display: "flex", alignItems: "center" }}>
        <RiLogoutBoxLine style={{ marginRight: "1rem", color: theme.palette.primary.main }} />
        <Typography>Cerrar Sesión</Typography>
      </MenuItem>
    </Menu>
  );
};

UserMenu.propTypes = {
  anchorEl: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default UserMenu;
