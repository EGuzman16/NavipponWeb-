import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  IconButton, useTheme
} from "@mui/material";
import {  LightMode, DarkMode } from "@mui/icons-material";
import { images, stables } from "../../constants/index.js";
import useUser from "../../hooks/useUser.js";
import { setMode } from "../../state/state.js";

const navItemsInfo = [
  { name: 'Inicio', type: 'link', href: '/' },
  { name: 'Nosotros', type: 'link', href: '/about' },
  { name: 'Explora', type: 'link', href: '/experience' },
  { name: 'Blog', type: 'link', href: '/blog' },
  { name: 'Contacto', type: 'link', href: '/contacto' },
];

const NavItem = ({ item }) => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdownHandler = () => {
    setDropdown((curState) => {
      return !curState;
    });
  };

  return (
    <li className="relative group mb-3">
      {item.type === "link" ? (
        <>
          <Link to={item.href} className="px-4 py-2">
            {item.name}
          </Link>
          <span className="cursor-pointer text-[#fa5564] absolute transition-all duration-500 font-bold right-0 top-0 group-hover:right-[90%] opacity-0 group-hover:opacity-100">
            /
          </span>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="px-4 py-2 flex gap-x-1 items-center"
            onClick={toggleDropdownHandler}
          >
            <span>{item.name}</span>
            <MdKeyboardArrowDown />
          </button>
          <div
            className={`${dropdown ? "block" : "hidden"
              } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
          >
            <ul className="bg-[#0A0330] lg:bg-white text-center flex flex-col shadow-lg rounded-lg overflow-hidden space-y-8">
              {item.items.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  className="hover:bg-[#0A0330] hover:text-white px-4 py-2 mb-3 text-white lg:text-[#0A0330]"
                >
                  {page.title}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
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

  const navVisibilityHandler = () => {
    setNavIsVisible((curState) => {
      return !curState;
    });
  };

  const logoutHandler = () => {
    logout();
  };

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
    <section className="w-full">
      <header className="w-full px-5 py-8 flex flex-col md:flex-row justify-between items-center bg-[#0A0330] text-white">
        <div className="flex items-center gap-x-3 mb-4 md:mb-0 md:w-1/4">
          <Link to="/" className="flex items-center">
            <img src={images.Logo} alt="Logo" className="h-20" />
            <h1 className="text-xl font-bold pl-2">Navippon</h1>
          </Link>
          <div className="lg:hidden z-50 ml-4">
            {navIsVisible ? (
              <AiOutlineClose className="w-6 h-6" onClick={navVisibilityHandler} />
            ) : (
              <AiOutlineMenu className="w-6 h-6" onClick={navVisibilityHandler} />
            )}
          </div>
        </div>
        <div
          className={`${navIsVisible ? 'block' : 'hidden'
            } md:flex flex-col md:flex-row gap-x-5 mt-8 md:mt-0 md:w-3/4`}
        >
          <ul className="flex flex-col md:flex-row gap-x-5 items-center justify-center w-full">
            {navItemsInfo.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </ul>  <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ color: "white" }}
            >
              {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
            </IconButton>
          {user ? (
            <div className="text-white bg-[#0A0330] items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold z-50">
              <div className="relative group" ref={profileRef}>
                <div className="flex flex-col items-center">
                  <button
                    className="flex items-center justify-center w-20 h-20 bg-[#fa5564] rounded-full text-white font-semibold hover:bg-white hover:text-[#fa5564] transition-all duration-300"
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
                  <div
                    className={`${profileDropdown ? "block" : "hidden"
                      } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
                  >
                    <ul className="bg-[#0A0330] lg:bg-[#0A0330] text-center flex flex-col shadow-lg rounded-lg overflow-hidden z-50">
                      {user.admin && (
                        <button
                          onClick={() => navigate("/admin")}
                          type="button"
                          className="hover:bg-[#fa5564] hover:text-white px-4 py-2 text-white lg:text-white"
                        >
                          Panel Administrador
                        </button>
                      )}
                      <button
                        onClick={() => navigate("/profile")}
                        type="button"
                        className="hover:bg-[#fa5564] hover:text-white px-4 py-2 text-white lg:text-white"
                      >
                        Perfil
                      </button>
                      <button
                        onClick={() => navigate("/user")}
                        type="button"
                        className="hover:bg-[#fa5564] hover:text-white px-4 py-2 text-white lg:text-white"
                      >
                        Panel de Usuario
                      </button>
                      <button
                        onClick={logoutHandler}
                        type="button"
                        className="hover:bg-[#fa5564] hover:text-white px-4 py-2 text-white lg:text-white"
                      >
                        Cerrar Sesión
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex gap-x-1 items-center mt-5 lg:mt-0 bg-[#fa5564] px-6 py-2 rounded-full text-white font-semibold hover:bg-white hover:text-[#fa5564] transition-all duration-300"
            >
              Ingresar
            </button>
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;