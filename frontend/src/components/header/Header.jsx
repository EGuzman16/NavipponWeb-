import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { IconButton, useTheme, Typography } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { images, stables } from "../../constants";
import useUser from "../../hooks/useUser";
import { setMode } from "../../state/state.js";
import UserMenu from "./UserMenu";

const navItemsInfo = [
  { name: "Inicio", type: "link", href: "/" },
  { name: "Nosotros", type: "link", href: "/about" },
  { name: "Explora", type: "link", href: "/experience" },
  { name: "Blog", type: "link", href: "/blog" },
  { name: "Contacto", type: "link", href: "/contacto" },
];

const NavItem = ({ item }) => {
  const location = useLocation();
  const theme = useTheme();
  const isActive = location.pathname === item.href;

  return (
    <li className="relative group mb-3">
      <Link
        to={item.href}
        className="px-4 py-2 transition-colors duration-300"
        style={{
          color: isActive ? theme.palette.primary.main : theme.palette.primary.white,
        }}
      >
        {item.name}
      </Link>
    </li>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user, logout } = useUser();
  const [navIsVisible, setNavIsVisible] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  const navVisibilityHandler = () => setNavIsVisible((curState) => !curState);
  const logoutHandler = () => logout();

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="w-full overflow-visible relative">
      <header
        className="w-full px-5 py-6 flex justify-between items-center"
        style={{
          backgroundColor: theme.palette.background.nav,
          color: theme.palette.primary.white,
        }}
      >
        <div className="flex items-center gap-x-3">
          <Link to="/" className="flex items-center">
            <img src={images.Logo} alt="Logo Navippon" className="h-14" />
            <Typography
              fontFamily="SifonnPro"
              fontWeight="bold"
              fontSize="clamp(1.25rem, 1.5rem, 2rem)"
              color="white"
              sx={{ textTransform: "none", marginLeft: "10px" }}
            >
              Navippon
            </Typography>
          </Link>
        </div>

        <div
          className={`${
            navIsVisible ? "flex" : "hidden"
          } lg:flex flex-col lg:flex-row items-center justify-center absolute lg:static left-1/2 transform -translate-x-1/2 lg:translate-x-0 gap-x-5 mt-8 lg:mt-0 w-full lg:w-full bg-gray-900 lg:bg-transparent shadow-lg lg:shadow-none z-50`}
          style={{ top: "100%", overflow: "visible" }}
        >
          <ul className="flex flex-col lg:flex-row gap-x-5 items-center justify-center w-full">
            {navItemsInfo.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </ul>
        </div>

        <div className="flex items-center">
          {/* Light/Dark Mode Button */}
          <IconButton onClick={() => dispatch(setMode())} sx={{ color: "white" }}>
            {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
          </IconButton>

          {/* User Profile Menu */}
          {user ? (
            <div className="relative" ref={profileRef} style={{ marginLeft: "0.75rem" }}>
              <button
                className="flex items-center justify-center w-20 h-20 rounded-full"
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.white,
                }}
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                {user.avatar ? (
                  <img
                    src={`${stables.UPLOAD_FOLDER_BASE_URL}${user.avatar}`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaRegUserCircle className="text-3xl" />
                )}
              </button>

              <UserMenu
                anchorEl={profileDropdown ? profileRef.current : null}
                handleClose={() => setProfileDropdown(false)}
                handleLogout={logoutHandler}
              />
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-full font-semibold"
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.secondary.white,
              }}
            >
              Ingresar
            </button>
          )}

          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-auto" style={{ marginLeft: "1rem" }}>
            {navIsVisible ? (
              <AiOutlineClose
                className="w-6 h-6 cursor-pointer"
                onClick={navVisibilityHandler}
                style={{ color: theme.palette.primary.white }}
              />
            ) : (
              <AiOutlineMenu
                className="w-6 h-6 cursor-pointer"
                onClick={navVisibilityHandler}
                style={{ color: theme.palette.primary.white }}
              />
            )}
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
