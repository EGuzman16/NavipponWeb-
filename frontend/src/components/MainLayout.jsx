import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ paddingTop: "10rem" }}>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
