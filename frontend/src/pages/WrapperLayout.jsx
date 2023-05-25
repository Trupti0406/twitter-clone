import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const WrapperLayout = () => {
  return (
    <>
      <Sidebar />
      {/* ! profile section */}
      <Outlet />
    </>
  );
};

export default WrapperLayout;
