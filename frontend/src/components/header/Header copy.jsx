import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { IconButton, Box, Button, useTheme } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useUser from "../../hooks/useUser";
import { images, stables } from "../../constants";
import { setMode } from "../../state/state.js";

const Header = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user, logout } = useUser();
  const [navIsVisible, setNavIsVisible] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const navBackground = theme.palette.background.nav;
  const primaryColor = theme.palette.primary.main;
  const textColor = theme.palette.primary.white;

  const toggleNavVisibility = () => setNavIsVisible((cur) => !cur);
  const toggleProfileDropdown = () => setProfileDropdown((cur) => !cur);
  const handleLogout = () => logout();

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        backgroundColor: navBackground,
        color: textColor,
        position: "fixed",
        top: 0,
        zIndex: 1000,
        width: "100%",
      }}
    >
      <Box
        className="p-4"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
        <img src={images.Logo} alt="Logo" className="h-20" />
          <h1 className="text-lg font-bold pl-2">Navippon</h1>
        </Link>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
          <IconButton onClick={() => dispatch(setMode())} sx={{ color: textColor }}>
            {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
          </IconButton>
          <IconButton
            onClick={toggleNavVisibility}
            sx={{ color: textColor, ml: 2 }}
          >
            {navIsVisible ? <AiOutlineClose /> : <AiOutlineMenu />}
          </IconButton>
        </Box>

        {/* Desktop Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
            alignItems: "center",
          }}
        >
          <Link to="/" className="text-base">
            Inicio
          </Link>
          <Link to="/about" className="text-base">
            Nosotros
          </Link>
          <Link to="/experience" className="text-base">
            Explora
          </Link>
          <Link to="/blog" className="text-base">
            Blog
          </Link>
          <Link to="/contacto" className="text-base">
            Contacto
          </Link>
          <IconButton onClick={() => dispatch(setMode())} sx={{ color: textColor }}>
            {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
          </IconButton>
          {user ? (
            <Box ref={profileRef} sx={{ position: "relative" }}>
              <IconButton
                onClick={toggleProfileDropdown}
                sx={{
                  backgroundColor: primaryColor,
                  color: theme.palette.primary.white,
                  width: 40,
                  height: 40,
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    style={{ borderRadius: "50%", width: "100%", height: "100%" }}
                  />
                ) : (
                  <FaRegUserCircle />
                )}
              </IconButton>
              {profileDropdown && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    backgroundColor: navBackground,
                    boxShadow: 3,
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  {user.admin && (
                    <Button
                      onClick={() => navigate("/admin")}
                      sx={{ display: "block", width: "100%" }}
                    >
                      Panel Admin
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate("/profile")}
                    sx={{ display: "block", width: "100%" }}
                  >
                    Perfil
                  </Button>
                  <Button
                    onClick={handleLogout}
                    sx={{ display: "block", width: "100%" }}
                  >
                    Cerrar Sesión
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Link to="/login">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: primaryColor,
                  color: theme.palette.primary.white,
                  textTransform: "none",
                  borderRadius: "20px",
                  px: 3,
                }}
              >
                Ingresar
              </Button>
            </Link>
          )}
        </Box>
      </Box>

      {/* Mobile Menu */}
      {navIsVisible && (
        <Box
          sx={{
            position: "absolute",
            top: 64,
            left: 0,
            width: "100%",
            backgroundColor: navBackground,
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <Link to="/" onClick={toggleNavVisibility}>
            Inicio
          </Link>
          <Link to="/about" onClick={toggleNavVisibility}>
            Nosotros
          </Link>
          <Link to="/experience" onClick={toggleNavVisibility}>
            Explora
          </Link>
          <Link to="/blog" onClick={toggleNavVisibility}>
            Blog
          </Link>
          <Link to="/contacto" onClick={toggleNavVisibility}>
            Contacto
          </Link>
        </Box>
      )}
    </nav>
  );
};

export default Header;
