import React from "react";
import Footer from "./Footer";
import Header from "./header/Header.jsx";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
